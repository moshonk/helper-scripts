#!/bin/bash 
cd ~/Development/bitbucket.com/openmrs-module-botswanaemr
mvn clean install -DskipTests
echo "Copying data to server"
scp omod/target/botswanaemr*.omod $USER@$SERVER:/opt/docker-emr/web/modules
cd ~/openmrs/refapp250/
zip -r configuration.zip configuration
echo "Copying configuration data to server"
scp configuration.zip $USER@$SERVER:/opt/docker-emr/web/
echo "logging in to server"
ssh $USER@$SERVER "cd /opt/docker-emr/web/ && unzip -o configuration.zip | docker restart bemrs_web"
echo "logging in to server"


