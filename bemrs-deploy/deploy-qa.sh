#!/bin/bash 
cd ~/Development/bitbucket.com/openmrs-module-botswanaemr
mvn clean install -DskipTests
echo "Copying data to server"
scp omod/target/botswanaemr*.omod $USER@botswanaemrdemo.intellisoftkenya.com:/opt/docker-emr/web/modules
cd ~/openmrs/refapp250/
zip -r configuration.zip configuration
echo "Copying configuration data to server"
scp configuration.zip $USER@botswanaemrdemo.intellisoftkenya.com:/opt/docker-emr/web/
echo "logging in to server"
ssh $USER@botswanaemrdemo.intellisoftkenya.com "cd /opt/docker-emr/web/ && unzip -f -o configuration.zip | docker restart bemrs_web"
echo "logging in to server"


