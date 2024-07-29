#!/bin/bash

sudo chmod -R o+w frontend

# sudo apt update
# sudo apt -y install postgresql
# sudo apt -y install openjdk-17-jdk
# sudo apt -y install maven
# sudo apt -y install nodejs
# sudo apt -y install npm
# sudo apt install dbus-x11
# sudo apt -y upgrade

 cd frontend
 npm install react react-dom
 cd ..

# sudo -u postgres psql << EOF
# CREATE DATABASE opening;
# CREATE USER konrad WITH SUPERUSER;
# ALTER USER konrad WITH PASSWORD 'konrad';
# EOF

mvn clean install


sudo gnome-terminal --tab --title="backend" -- bash -c "java -jar target/demo-0.0.1-SNAPSHOT.jar"

sudo gnome-terminal --tab --title="frontend" -- bash -c "cd frontend && npm start"


