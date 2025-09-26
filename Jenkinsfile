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
              image: jenkins/inbound-agent:latest
            - name: buildkit
              image: moby/buildkit:v0.18.2-rootless
              command: ["/bin/sh","-c","sleep 999999"]
              tty: true
              volumeMounts:
                - name: docker-config
                  mountPath: /root/.docker
            volumes:
              - name: docker-config
                secret:
                  secretName: docker-config
          """
      }
    }

  environment {
    REGISTRY        = 'docker.io/ardianhermawan17'
    IMAGE           = "${env.REGISTRY}/frontend-radiodiagnosis"
    KUBECONFIG_CRED = 'kubeconfig-jenkins'
    K8S_NAMESPACE   = 'radiodiagnosis'
    DOCKER_HUB_AUTH = credentials('docker-ardian-read-write')
    REACT_APP_CLIENT_ID='uKvQMdoWlOyF4irX5Svvm6gU9NKoU3er29JsARLoJXZYgARO'
    REACT_APP_CLIENT_SECRET='2KNWAXaRj4t9zAt1RFUR4zUpphLjlpZS5ZmAzwihj336bJca2ydsDqIosAWjXa9f'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

//     stage('Load Secrets from Kubernetes') {
//       steps {
//         withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
//           sh '''
//             # Fetch and decode secrets
//             export REACT_APP_CLIENT_ID=$(kubectl get secret frontend-radiodiagnosis-env -n ${K8S_NAMESPACE} -o jsonpath='{.data.REACT_APP_CLIENT_ID}' | base64 -d)
//             export REACT_APP_CLIENT_SECRET=$(kubectl get secret frontend-radiodiagnosis-env -n ${K8S_NAMESPACE} -o jsonpath='{.data.REACT_APP_CLIENT_SECRET}' | base64 -d)
//
//             # Save to a file for sourcing in next step
//             echo "REACT_APP_CLIENT_ID=\$REACT_APP_CLIENT_ID" > /tmp/secrets.env
//             echo "REACT_APP_CLIENT_SECRET=\$REACT_APP_CLIENT_SECRET" >> /tmp/secrets.env
//           '''
//         }
//       }
//     }

    stage('Build & Push Image with BuildKit') {
          steps {
            container('buildkit') {
              sh '''
                   ls -la ${WORKSPACE}

                   buildctl-daemonless.sh build \
                     --frontend dockerfile.v0 \
                     --local context=${WORKSPACE} \
                     --local dockerfile=${WORKSPACE} \
                     --output type=image,name=${IMAGE}:${BUILD_ID},push=true \
                     --output type=image,name=${IMAGE}:latest,push=true \
                     --build-arg REACT_APP_CLIENT_ID=${REACT_APP_CLIENT_ID} \
                     --build-arg REACT_APP_CLIENT_SECRET=${REACT_APP_CLIENT_SECRET} \
                     --build-arg CI=false
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
