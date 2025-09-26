pipeline {
  agent {
      kubernetes {
        defaultContainer 'jnlp'
        yaml """
              apiVersion: v1
              kind: Pod
              spec:
                containers:
                - name: jnlp
                  image: jenkins/inbound-agent:4.11.2-4
                 # args: ['\${computer.jnlpmac}', '\${computer.name}']
                - name: buildkit
                  image: moby/buildkit:v0.18.2-rootless
                  securityContext:
                    privileged: true
                  command:
                    - /bin/sh
                    - -c
                    - sleep 999999
                    - buildkitd
                  tty: true
                  volumeMounts:
                    - name: docker-config
                      mountPath: /root/.docker
                - name: nodejs
                  image: node:24-alpine
                  command:
                    - /bin/sh
                    - -c
                    - sleep 999999
                  tty: true
                  volumeMounts:
                    - name: workspace
                      mountPath: /workspace
                volumes:
                  - name: docker-config
                    secret:
                      secretName: docker-config
                  - name: workspace
                    emptyDir: {}
              """
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

            # Save to a file for sourcing in next step
            echo "REACT_APP_CLIENT_ID=\$REACT_APP_CLIENT_ID" > /tmp/secrets.env
            echo "REACT_APP_CLIENT_SECRET=\$REACT_APP_CLIENT_SECRET" >> /tmp/secrets.env
          '''
        }
      }
    }

    stage('Build React App') {
      steps {
        container('nodejs') {
          sh '''
            npm ci
            npm run build
            cp -r build /workspace/
          '''
        }
      }
    }

    stage('Build & Push Image with BuildKit') {
      steps {
        container('buildkit') {
          sh '''
            set -a
            source /tmp/secrets.env
            set +a

            # Debug: check buildctl
            buildctl-daemonless.sh --version || echo "Buildctl not found"

            # Run buildctl
            buildctl-daemonless.sh build \
              --frontend dockerfile.v0 \
              --local context=/workspace \
              --local dockerfile=${WORKSPACE} \
              --output type=image,name=${IMAGE}:${BUILD_ID},push=true \
              --output type=image,name=${IMAGE}:latest,push=true \
              --build-arg REACT_APP_CLIENT_ID=${REACT_APP_CLIENT_ID} \
              --build-arg REACT_APP_CLIENT_SECRET=${REACT_APP_CLIENT_SECRET}
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
      node {
        cleanWs()
      }
    }
  }
}
