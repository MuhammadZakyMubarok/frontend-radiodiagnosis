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
              set -euo pipefail
              echo "Applying manifests..."
              # apply manifests and save resource names (like deployment.apps/frontend)
              kubectl apply -n ${K8S_NAMESPACE} -f config/k8s/deploy-frontend-radiodiagnosis-k8s.yaml -o name > ${WORKSPACE}/applied.txt
              # optionally also apply ingress (if separate file)
              # kubectl apply -n ${K8S_NAMESPACE} -f config/k8s/ingress-frontend-radiodiagnosis-k8s.yaml >> ${WORKSPACE}/applied.txt || true

              echo "Applied resources:"
              cat ${WORKSPACE}/applied.txt || true
            '''
          }
        }
      }
    }

//     stage('Apply Ingress') {
//       steps {
//       container('kubectl') {
//         withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
//             sh 'kubectl apply -n ${K8S_NAMESPACE} -f config/k8s/ingress-frontend-radiodiagnosis-k8s.yaml >> ${WORKSPACE}/applied.txt || true'
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
                    echo "Waiting for rollout..."
                    kubectl -n ${K8S_NAMESPACE} rollout status deployment/frontend-radiodiagnosis --timeout=300s
                    echo "Listing pods:"
                    kubectl -n ${K8S_NAMESPACE} get pods -l app=frontend -o wide
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
      container('kubectl') {
        withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
          sh '''
            set -euo pipefail
            APPLIED_FILE=${WORKSPACE}/applied.txt

            if [ -f "$APPLIED_FILE" ]; then
              echo "Applied resources were:"
              cat "$APPLIED_FILE"
              echo

              # Try to rollback deployments first (safe operation)
              while read -r res; do
                # ignore empty lines
                [ -z "$res" ] && continue
                kind=$(echo "$res" | cut -d'/' -f1)    # e.g. deployment.apps
                name=$(echo "$res" | cut -d'/' -f2)    # e.g. frontend

                echo "Handling resource: $res (kind=$kind name=$name)"

                if echo "$kind" | grep -q 'deployment'; then
                  echo " -> Attempting rollout undo for $res"
                  kubectl -n ${K8S_NAMESPACE} rollout undo "$res" || echo "rollback failed for $res (ignored)"
                else
                  echo " -> Deleting $res (if created by this run)"
                  kubectl -n ${K8S_NAMESPACE} delete "$res" --ignore-not-found || echo "delete failed for $res (ignored)"
                fi
              done < "$APPLIED_FILE"

              echo "Rollback/cleanup done (attempted)."
            else
              echo "No applied resource list found at $APPLIED_FILE; skipping cleanup."
            fi

            # optional: check deployment status after undo
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
