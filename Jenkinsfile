pipeline {
  agent any

  environment {
    APP_NAME = "api-gate-sso"
    IMAGE_NAME = "api-gate-sso"
    DOCKER_NETWORK = "infra_net"
    BRANCH = "${env.BRANCH_NAME}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Set Environment') {
      steps {
        script {
          if (BRANCH == 'production-new') {
            env.ENV_NAME = 'production'
            env.APP_DIR = "/opt/services/prod/${APP_NAME}"
            env.APP_PORT = "9601"
          } else if (BRANCH == 'staging') {
            env.ENV_NAME = 'staging'
            env.APP_DIR = "/opt/services/staging/${APP_NAME}"
            env.APP_PORT = "9601"
          } else {
            env.ENV_NAME = 'development'
            env.APP_DIR = "/opt/services/dev/${APP_NAME}"
            env.APP_PORT = "9601"
          }
        }
      }
    }

    stage('Prepare Workspace') {
      steps {
        sh """
          mkdir -p ${APP_DIR}
          rsync -av --delete ./ ${APP_DIR}/
        """
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
          cd ${APP_DIR}
          docker build -t ${IMAGE_NAME}:${BRANCH} .
        """
      }
    }

    stage('Run Migration') {
      when {
        branch 'production-new'
      }
      steps {
        sh """
          cd ${APP_DIR}
          docker run --rm \
            --env-file .env \
            ${IMAGE_NAME}:${BRANCH} \
            npm run migrate
        """
      }
    }

    stage('Deploy Container') {
      steps {
        sh """
          cd ${APP_DIR}
          docker compose down || true
          docker compose up -d --build
        """
      }
    }

    stage('Health Check') {
      steps {
        sh """
          sleep 15
          curl -f http://localhost:${APP_PORT}/health
        """
      }
    }
  }

  post {
    success {
      echo "✅ Deploy SUCCESS for ${APP_NAME} (${ENV_NAME})"
    }
    failure {
      echo "❌ Deploy FAILED for ${APP_NAME}"
    }
  }
}
