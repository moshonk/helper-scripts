#!/bin/bash 
cd ~/Development/bitbucket.com/openmrs-module-botswanaemr
mvn clean install -DskipTests
echo "Copying botswanaemr module to server $SERVER" 
scp omod/target/botswanaemr*.omod $USER@$SERVER:/opt/docker-emr/web/modules
cd ~/openmrs/refapp250/
zip -r configuration.zip configuration
echo "Copying configuration data to server $SERVER" 
scp configuration.zip $USER@$SERVER:/opt/docker-emr/web/
echo "logging in to server $SERVER to restart services" 
ssh $USER@$SERVER "cd /opt/docker-emr/web/ && unzip -o configuration.zip | docker restart bemrs_web"
echo "logging in to server"


