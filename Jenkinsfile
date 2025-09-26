pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: kaniko
            image: gcr.io/kaniko-project/executor:latest
            command:
            - /busybox/sh
            - -c
            - |
              cat <<EOF > /kaniko/.docker/config.json
              {
                "auths": {
                  "https://index.docker.io/v1/": {
                    "auth": "' + "${DOCKER_HUB_AUTH}" + '"
                  }
                }
              }
              EOF
              sleep 9999999
            tty: true
            volumeMounts:
              - name: kaniko-secret
                mountPath: /kaniko/.docker
          - name: jnlp
            image: jenkins/inbound-agent:3341.v0766d82b_dec0-1
            resources:
              requests:
                cpu: "500m"
                memory: "512Mi"
              limits:
                cpu: "1"
                memory: "2Gi"
          volumes:
            - name: kaniko-secret
              emptyDir: {}
        '''
    }
  }

  environment {
    REGISTRY        = 'docker.io/ardianhermawan17'
    IMAGE           = "${env.REGISTRY}/frontend-radiodiagnosis"
    KUBECONFIG_CRED = 'kubeconfig-jenkins'
    K8S_NAMESPACE   = 'radiodiagnosis'
    DOCKER_HUB_AUTH = credentials('docker-ardian-read-write')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Load Secrets from Kubernetes') {
      steps {
        withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
          sh '''
            # Fetch and decode secrets
            export REACT_APP_CLIENT_ID=$(kubectl get secret frontend-radiodiagnosis-env -n ${K8S_NAMESPACE} -o jsonpath='{.data.REACT_APP_CLIENT_ID}' | base64 -d)
            export REACT_APP_CLIENT_SECRET=$(kubectl get secret frontend-radiodiagnosis-env -n ${K8S_NAMESPACE} -o jsonpath='{.data.REACT_APP_CLIENT_SECRET}' | base64 -d)

            # Save to a file for sourcing in next step (since env vars don't persist across sh blocks)
            echo "REACT_APP_CLIENT_ID=\$REACT_APP_CLIENT_ID" > /tmp/secrets.env
            echo "REACT_APP_CLIENT_SECRET=\$REACT_APP_CLIENT_SECRET" >> /tmp/secrets.env
          '''
        }
      }
    }

    stage('Build & Push Image with Kaniko') {
      steps {
        container('kaniko') {
          sh '''
            # Source the secrets
            set -a
            source /tmp/secrets.env
            set +a

            /kaniko/executor \
              --dockerfile="${WORKSPACE}/Dockerfile" \
              --context="${WORKSPACE}" \
              --destination="${IMAGE}:${BUILD_ID}" \
              --destination="${IMAGE}:latest" \
              --build-arg=REACT_APP_CLIENT_ID="${REACT_APP_CLIENT_ID}" \
              --build-arg=REACT_APP_CLIENT_SECRET="${REACT_APP_CLIENT_SECRET}" \
              --verbosity=debug
          '''
        }
      }
    }

    stage('Update Kubernetes Manifests') {
      steps {
        sh '''
          sed -i "s|docker.io/ardianhermawan17/frontend-radiodiagnosis:latest|${IMAGE}:${BUILD_ID}|g" config/k8s/frontend-radiodiagnosis-deploy-k8s.yaml
        '''
      }
    }

    stage('Deploy to RKE2') {
      steps {
        withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
          sh 'kubectl apply -f config/k8s/frontend-radiodiagnosis-deploy-k8s.yaml'
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
          sh '''
            kubectl rollout status deployment/frontend-radiodiagnosis -n ${K8S_NAMESPACE} --timeout=300s
            kubectl get pods -n ${K8S_NAMESPACE} -l app=frontend-radiodiagnosis
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded! Deployment completed.'
    }
    failure {
      echo 'Pipeline failed! Please check the logs for errors.'
    }
    always {
      echo 'Pipeline execution completed.'
      cleanWs()
    }
  }
}