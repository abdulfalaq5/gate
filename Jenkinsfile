pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Pulling code from repository...'
                checkout scm
            }
        }
        
        stage('Info') {
            steps {
                echo '📋 Project Information:'
                echo 'Repository: ' + env.JOB_NAME
                echo 'Branch: ' + env.BRANCH_NAME
                echo 'Build Number: ' + env.BUILD_NUMBER
                echo 'Workspace: ' + env.WORKSPACE
            }
        }
        
        stage('List Files') {
            steps {
                echo '📁 Repository contents:'
                sh 'ls -la'
            }
        }
        
        stage('Node.js Info') {
            steps {
                echo '🟢 Node.js Information:'
                sh 'node --version || echo "Node.js not installed"'
                sh 'npm --version || echo "npm not installed"'
            }
        }
    }
    
    post {
        always {
            echo '✅ Pipeline completed!'
            echo 'Build finished at: ' + new Date().toString()
        }
    }
}
