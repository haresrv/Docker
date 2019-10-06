Sample Form App which makes use of React+Node+AWS(S3+Lambda+RDS) fully implemented using Docker-Compose.

To test the app
* Install all npm modules required for project
* Make sure you have installed Docker. I tested it using Docker Toolbox for Windows
* Run docker-compose up --build
      This will download some files to set up the container.
* Run docker-machine ip to check ip assigned to your container
* Visit http://<<Docker-machine-IP>>:3000 -> React APP
        http://<<Docker-machine-IP>>:8000 -> NodeJS
