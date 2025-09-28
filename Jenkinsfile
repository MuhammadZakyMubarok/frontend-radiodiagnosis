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
              image: bitnami/kubectl:1.30
              command: ["sleep","infinity"]
              tty: true
              securityContext:
                runAsUser: 0
                runAsGroup: 0
              volumeMounts:
                - name: workspace-volume
                  mountPath: /home/jenkins/agent
            volumes:
              - name: docker-config
                secret:
                  secretName: docker-config
              - name: workspace-volume
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
    LABEL_APP       = 'frontend'
    DEPLOYMENT_NAME = 'frontend'
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
             # Ambil secret dari kubernetes (cluster)
             export REACT_APP_CLIENT_ID=$(kubectl get secret frontend-radiodiagnosis-env -n ${K8S_NAMESPACE} -o jsonpath='{.data.REACT_APP_CLIENT_ID}' | base64 -d)
             export REACT_APP_CLIENT_SECRET=$(kubectl get secret frontend-radiodiagnosis-env -n ${K8S_NAMESPACE} -o jsonpath='{.data.REACT_APP_CLIENT_SECRET}' | base64 -d)

             # Save file
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
          sed -i "s|docker.io/ardianhermawan17/frontend-radiodiagnosis:latest|${IMAGE}:${BUILD_ID}|g" config/k8s/deploy-frontend-radiodiagnosis-k8s.yaml
        '''
      }
    }

    stage('Deploy to RKE2') {
      steps {
        container('kubectl') {
          withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
            sh '''
              bash -eo pipefail -c "
                      sed -i \"s|BUILD_ID_PLACEHOLDER|\\\"${BUILD_ID}\\\"|g\" config/k8s/deploy-frontend-radiodiagnosis-k8s.yaml
                      sed -i \"s|docker.io/ardianhermawan17/frontend-radiodiagnosis:latest|${IMAGE}:${BUILD_ID}|g\" config/k8s/deploy-frontend-radiodiagnosis-k8s.yaml
                      kubectl apply -n ${K8S_NAMESPACE} -f config/k8s/deploy-frontend-radiodiagnosis-k8s.yaml -o name > ${WORKSPACE}/applied.txt
                      echo 'Applied:'
                      cat ${WORKSPACE}/applied.txt || true
                    "
            '''
          }
        }
      }
    }

//     stage('Apply Ingress') {
//       steps {
//       container('kubectl') {
//         withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
//             sh 'kubectl apply -n ${K8S_NAMESPACE} -f config/k8s/ingress-frontend-radiodiagnosis-k8s.yaml'
//           }
//         }
//       }
//     }

    stage('Verify Deployment') {
      steps {
        container('kubectl') {
          withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
            sh '''
              set -euo pipefail
              kubectl -n ${K8S_NAMESPACE} rollout status deployment/${DEPLOYMENT_NAME} --timeout=300s
              kubectl -n ${K8S_NAMESPACE} get pods -l app=${LABEL_APP} -o wide
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
        echo 'Pipeline failed! Attempting safe rollback/cleanup...'
        container('kubectl') {
          withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
            sh '''
              set -euo pipefail
              APPLIED_FILE=${WORKSPACE}/applied.txt

              echo "Checking for existing deployment ${DEPLOYMENT_NAME}..."
              if kubectl -n ${K8S_NAMESPACE} get deployment ${DEPLOYMENT_NAME} >/dev/null 2>&1; then
                echo "Rolling back deployment ${DEPLOYMENT_NAME} (if previous revision exists)..."
                kubectl -n ${K8S_NAMESPACE} rollout undo deployment/${DEPLOYMENT_NAME} || echo "rollout undo ok/ignored"
              else
                echo "Deployment ${DEPLOYMENT_NAME} does not exist (nothing to rollback)"
              fi

              # If we have applied.txt, delete only those exact resource names (safe)
              if [ -f "$APPLIED_FILE" ]; then
                echo "Deleting applied resources listed in $APPLIED_FILE"
                while IFS= read -r r || [ -n "$r" ]; do
                  [ -z "$r" ] && continue
                  echo "Deleting resource: $r"
                  # Delete the exact resource name (e.g. deployment.apps/frontend)
                  kubectl -n ${K8S_NAMESPACE} delete "$r" --ignore-not-found || echo "delete $r failed (ignored)"
                done < "$APPLIED_FILE"
              else
                echo "No applied.txt found; skipping exact-delete step."
              fi

              echo "Final check: deployments in namespace:"
              kubectl -n ${K8S_NAMESPACE} get deployments -o wide || true
            '''
          }
        }
    }
    always {
      echo 'Pipeline execution completed.'
      cleanWs()
    }
  }
}