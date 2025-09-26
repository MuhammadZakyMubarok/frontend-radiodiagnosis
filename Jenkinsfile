pipeline {
  agent any

  environment {
    REGISTRY       = 'docker.io/ardianhermawan17'
    IMAGE          = "${env.REGISTRY}/frontend-radiodiagnosis"
    KUBECONFIG_CRED = 'kubeconfig-jenkins'
    K8S_NAMESPACE  = 'radiodiagnosis'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        script {
          docker.withRegistry('https://docker.io', 'docker-hub-creds') {
            def img = docker.build("${env.IMAGE}:${env.BUILD_ID}")
            img.push()
            img.push('latest')
          }
        }
      }
    }

    stage('Deploy to RKE2') {
      steps {
        withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
          sh 'kubectl apply -f config/k8s/frontend-radiodiagnosis-deploy-k8s.yaml'
        }
      }
    }
  }
}