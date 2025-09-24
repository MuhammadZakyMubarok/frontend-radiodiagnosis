pipeline {
  agent {
     docker {
        image 'node:24-alpine'
        args '-u root:root'
     }
  }
  environment {
    REGISTRY = 'docker.io/ardianhermawan17'
    IMAGE = "${env.REGISTRY}/frontend-radiodiagnosis"
    KUBECONFIG_CRED = 'kubeconfig-jenkins'
    DOCKER_CRED = 'docker-ardian-read-write'
    K8S_NAMESPACE = 'radiodiagnosis'
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install & build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
    stage('Build & push image to docker') {
      steps {
        script {
          docker.withRegistry("https://${env.REGISTRY}", "${DOCKER_CRED}") {
            def img = docker.build("${IMAGE}:${env.BUILD_NUMBER}")
            img.push()
            sh "docker tag ${IMAGE}:${env.BUILD_NUMBER} ${IMAGE}:latest || true"
            docker.image("${IMAGE}:${env.BUILD_NUMBER}").push('latest')
          }
        }
      }
    }
    stage('Deploy to kubernetes') {
      steps {
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
  post {
    success { echo "Build & deploy finished." }
    failure { echo "Pipeline failed." }
  }
}
