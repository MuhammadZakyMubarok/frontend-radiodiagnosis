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
                  /kaniko/executor --no-push
                tty: true
              - name: jnlp
                image: jenkins/inbound-agent:3341.v0766d82b_dec0-1
                resources:
                  requests:
                    cpu: "500m"
                    memory: "512Mi"
                  limits:
                    cpu: "1"
                    memory: "2Gi"
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

    stage('Build & Push Image with Kaniko') {
      steps {
        container('kaniko') {
          sh '''
            /kaniko/executor \
              --dockerfile="${WORKSPACE}/Dockerfile" \
              --context="${WORKSPACE}" \
              --destination="${IMAGE}:${BUILD_ID}" \
              --destination="${IMAGE}:latest"
          '''
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