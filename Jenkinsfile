pipeline {
  agent {
    kubernetes {
      yaml """
            apiVersion: v1
            kind: Pod
            spec:
              serviceAccountName: jenkins
              containers:
              - name: node
                image: node:24-alpine
                command:
                - sleep
                args:
                - infinity
                resources:
                  limits:
                    memory: "1024Mi"
                    cpu: "500m"
              - name: kaniko
                image: gcr.io/kaniko-project/executor:v1.23.2-debug
                command:
                - sleep
                args:
                - infinity
                volumeMounts:
                - name: docker-config
                  mountPath: /kaniko/.docker
              volumes:
              - name: docker-config
                secret:
                  secretName: docker-regcred
            """
    }
  }
  environment {
    REGISTRY = 'docker.io/ardianhermawan17'
    IMAGE = "${env.REGISTRY}/frontend-radiodiagnosis"
    KUBECONFIG_CRED = 'kubeconfig-jenkins'
    DOCKER_CRED = 'docker-ardian-read-write'
    K8S_NAMESPACE = 'radiodiagnosis'
    CLIENT_ID = 'uKvQMdoWlOyF4irX5Svvm6gU9NKoU3er29JsARLoJXZYgARO'
    CLIENT_SECRET = '2KNWAXaRj4t9zAt1RFUR4zUpphLjlpZS5ZmAzwihj336bJca2ydsDqIosAWjXa9f'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install & build') {
      steps {
        container('node') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }
    stage('Build & push image') {
      steps {
        container('kaniko') {
          sh '''
            /kaniko/executor --context . \
              --dockerfile Dockerfile \
              --destination=${IMAGE}:${BUILD_NUMBER} \
              --destination=${IMAGE}:latest \
              --build-arg REACT_APP_CLIENT_ID=${CLIENT_ID} \
              --build-arg REACT_APP_CLIENT_SECRET=${CLIENT_SECRET}
          '''
        }
      }
    }
    stage('Deploy to kubernetes') {
      steps {
        container('node') {
          withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG_FILE')]) {
            sh '''
              export KUBECONFIG=$KUBECONFIG_FILE
              kubectl -n ${K8S_NAMESPACE} set image deployment/frontend frontend=${IMAGE}:${BUILD_NUMBER} --record
              kubectl -n ${K8S_NAMESPACE} rollout status deployment/frontend --timeout=120s
            '''
          }
        }
      }
    }
  }
}