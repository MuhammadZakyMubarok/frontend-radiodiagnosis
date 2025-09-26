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
              image: moby/buildkit:v0.18.2
              securityContext:
                privileged: true
              command: ["/bin/sh","-c","sleep 999999"]
              tty: true
              volumeMounts:
                - name: docker-config
                  mountPath: /root/.docker
            - name: kubectl
              image: bitnami/kubectl:latest
              command: ["/bin/sh","-c","sleep 999999"]
              tty: true
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
    REACT_APP_CLIENT_ID=''
    REACT_APP_CLIENT_SECRET=''
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Load Secrets from Kubernetes') {
      steps {
        container('kubectl') {
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
    }

    stage('Setup Docker Config Secret') {
      steps {
        container('kubectl') {
          withCredentials([usernamePassword(credentialsId: 'docker-ardian-read-write',
                                                    usernameVariable: 'DOCKER_USER',
                                                    passwordVariable: 'DOCKER_PASS')]) {
                    withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
                      sh '''
                        set -e

                        AUTH=$(echo -n "$DOCKER_USER:$DOCKER_PASS" | base64 | tr -d '\\n')

                        cat > config.json <<EOF
                        {
                          "auths": {
                            "https://index.docker.io/v1/": {
                              "auth": "$AUTH"
                            }
                          }
                        }
                        EOF

                        kubectl -n jenkins delete secret docker-config --ignore-not-found
                        kubectl -n jenkins create secret generic docker-config \
                          --from-file=config.json=./config.json
                      '''
                    }
          }
        }
      }
    }

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
              --opt build-arg:REACT_APP_CLIENT_ID=${REACT_APP_CLIENT_ID} \
              --opt build-arg:REACT_APP_CLIENT_SECRET=${REACT_APP_CLIENT_SECRET} \
              --opt build-arg:CI=false
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
        container('kubectl') {
          withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
                    sh 'kubectl apply -f config/k8s/frontend-radiodiagnosis-deploy-k8s.yaml'
          }
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        container('kubectl') {
          withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
                    sh '''
                      kubectl rollout status deployment/frontend-radiodiagnosis -n ${K8S_NAMESPACE} --timeout=300s
                      kubectl get pods -n ${K8S_NAMESPACE} -l app=frontend-radiodiagnosis
                    '''
          }
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
