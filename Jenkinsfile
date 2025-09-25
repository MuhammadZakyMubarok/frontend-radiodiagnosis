pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  volumes:
    - name: docker-config
      secret:
        secretName: docker-regcred
    - name: workspace
      emptyDir: {}
  containers:
    - name: node
      image: node:24-alpine
      command: ['cat']
      tty: true
      env:
        - name: NODE_OPTIONS
          value: "--max_old_space_size=2048"
      resources:
        requests:
          memory: "1Gi"
          cpu: "1000m"
        limits:
          memory: "3Gi"
          cpu: "1500m"
      volumeMounts:
        - name: workspace
          mountPath: /home/jenkins/agent
    - name: kaniko
      image: gcr.io/kaniko-project/executor:v1.23.2-debug
      command: ['cat']
      tty: true
      resources:
        requests:
          memory: "512Mi"
          cpu: "250m"
        limits:
          memory: "1Gi"
          cpu: "500m"
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker
        - name: workspace
          mountPath: /home/jenkins/agent
"""
    }
  }

  environment {
    REGISTRY = 'docker.io/ardianhermawan17'
    IMAGE = "${env.REGISTRY}/frontend-radiodiagnosis"
    KUBECONFIG_CRED = 'kubeconfig-jenkins'
    K8S_NAMESPACE = 'radiodiagnosis'
    CLIENT_ID = 'uKvQMdoWlOyF4irX5Svvm6gU9NKoU3er29JsARLoJXZYgARO'
    CLIENT_SECRET = '2KNWAXaRj4t9zAt1RFUR4zUpphLjlpZS5ZmAzwihj336bJca2ydsDqIosAWjXa9f'
  }

  stages {
    stage('Checkout') {
      steps {
        container('node') {
          // Jenkins uses its agent workdir by default; we mounted it at /home/jenkins/agent
          checkout scm
        }
      }
    }

    stage('Install & Build') {
      steps {
        container('node') {
          sh '''
            # print node info and available memory for debugging
            node --version || true
            free -m || true

            # install deps and build; NODE_OPTIONS helps prevent V8 OOM
            npm ci
            npm run build
          '''
        }
      }
    }

    stage('Build & push image (Kaniko)') {
      steps {
        container('kaniko') {
          sh '''
            # Use the agent workspace (mounted at /home/jenkins/agent) as kaniko context
            /kaniko/executor \
              --context /home/jenkins/agent \
              --dockerfile /home/jenkins/agent/Dockerfile \
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
              kubectl -n ${K8S_NAMESPACE} rollout status deployment/frontend --timeout=180s
            '''
          }
        }
      }
    }
  }

  post {
    success { echo "Pipeline Succeeded" }
    failure { echo "Pipeline Failed" }
    always {
      // optional: print workspace disk usage for debugging
      container('node') {
        sh 'df -h || true'
      }
    }
  }
}
