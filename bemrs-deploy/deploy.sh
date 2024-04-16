#!/bin/bash 
#if env variable $MODULE = reporting then cd to ~/Development/bitbucket.com/openmrs-module-botswanaemr-reports else cd to the default directory
if [ "$MODULE" = "reporting" ]; then
    echo "MODULE is set to reporting. Using reporting directory"
    cd ~/Development/bitbucket.com/openmrs-module-botswanaemr-reports
else
    echo "MODULE is not set. Using default directory"
    cd ~/Development/bitbucket.com/openmrs-module-botswanaemr
fi
# Dynamically retrieve the default branch and checkout to it
DEFAULT_BRANCH=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)
echo "Checking out to default branch $DEFAULT_BRANCH"
git checkout $DEFAULT_BRANCH
git pull origin --rebase
mvn clean install -DskipTests
echo "Copying module to server $SERVER" 
scp omod/target/*.omod $USER@$SERVER:/opt/docker-emr/web/modules
cd ~/openmrs/refapp250/
zip -r configuration.zip configuration
echo "Copying configuration data to server $SERVER" 
scp configuration.zip $USER@$SERVER:/opt/docker-emr/web/
echo "logging in to server $SERVER to restart services" 
ssh $USER@$SERVER "cd /opt/docker-emr/web/ && unzip -o configuration.zip | docker restart bemrs_db | docker restart bemrs_web"
echo "logging in to server"


