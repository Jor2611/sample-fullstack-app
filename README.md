# Sample Fullstack Application

### About

This repository demonstrates a sample implementation of Fullstack Application using Nest.js as backend technology and React.js as frontend. The service is connected to MysSQL via Sequelize ORM.

### Features
- **Registering A User:**  Create a user with the role of admin or a user.
- **Logging A User:**  You can log in to the application with the created user.
- **Fetch User Data:** Fetch the data of your current user.
- **Manipulate User Data** Update/Remove user data (only with api).

## Setup

### Prerequisites
Before running the app, make sure you have the following:
- Minikube 
- Kubectl

OR

- Nest.js (Node v20.10.0)
- React.js v18
- MySQL 8.3.0

### On Local Environment with minikube
```bash
# 1.Clone the repository
$ git clone <repository_url>

#  2.Start Minikube Cluster 
$ minikube start
# Note: The version of Minikube must be v1.32.0; otherwise, the ingress configuration might be different.

# 3.Enable Nginx Ingress 
$ minikube addons enable ingress

# 4.Create Secret for MYSQL Password and JWT Secret
$ kubectl create secret generic credentials --from-literal=MYSQL_PASSWORD=[YOUR_PG_PASSWORD] --from-literal=JWT_SECRET=[JWT_SECRET]
# Note: This password is added as an environment variable to services and configured for the MySQL instance in the cluster.

# 5.Create Secret for MYSQL CNF file
$ kubectl create secret generic mysql-cnf --from-file=$(pwd)/my.cnf
# Note: The file allows other instances inside the cluster to have remote access to the MySQL instance.


# 6.Apply System Elements to Cluster
$ kubectl apply -f k8s/
# Note: Ensure that all deployments work correctly. Alternatively, apply declaration files of the infra directory in the order (Client, MySQL, Service, Ingress).

## Optional Configurations

# 7.Configure Local DNS (Example for linux)
$ echo "192.168.49.2 usersapp.xyz" | sudo tee -a /etc/hosts
# Replace IP with your kuberentes cluster ip. You can retrieve it using `minikube ip`.

```

### On Local Environment
```bash
# 1.Clone the repository
$ git clone <repository_url>

#  2. Add .env file in front directory
REACT_APP_BACKEND_BASE_URL=[URL_TO_BACK]

# 3. Add .env.dev and .env.test files in back directory
PORT=[APP_RUNNING_PORT]
JWT_SECRET=[JWT_SECRET]
JWT_EXPIRATION=[JWT_EXPIRATION_TIME]
MYSQL_HOST=[DB_HOST]
MYSQL_PORT=[DB_PORT]
MYSQL_USERNAME=[DB_USERNAME]
MYSQL_PASSWORD=[DB_PASSWORD]
MYSQL_DATABASE=[DB_DATABASE]
ALLOWED_ORIGINS='*'
# ALLOWED_ORIGINS can be array with origins that will be accepted by backend

# 4.Install dependencies in bot directories
$ npm install

# 5. Run backend 
$ npm run start:dev

# 6.Run frontend
$ npm start

### Improvements
- Write unit and end-to-end (e2e) tests in the backend.
- Add migrations for more robust and production ready setup.
- Write a CI/CD pipeline with some cloud service.

### Final Reflections
This is a sample configuration of a full-stack app with React as the frontend and NestJS as the backend, configured in a Kubernetes environment. The backend involves a custom RBAC system that allows for access control. The application allows for user creation, reading user data, updating users, and deleting users, all with permission checks.
