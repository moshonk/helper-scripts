#!/bin/bash
time=$(date +%Y-%m-%d_%H%M%S)
echo "$time"
backupFileName="openmrs_prod_backup_$time.sql"
ssh root@botswanaemrdemo.intellisoftkenya.com "mysqldump -uroot -p"$DEFAULT_DB_PASS" -P 3309 -h 127.0.0.1 openmrs | zip /tmp/"$backupFileName".zip -" &
echo "Backing up remote database openmrs" &
wait &
cd /tmp
wait
rm -f $backupFileName.zip &
wait
echo "Copying backed-up db" &
wait
scp root@botswanaemrdemo.intellisoftkenya.com:/tmp/$backupFileName.zip . &
wait
echo "Extracting and Restoring DB file" &
unzip -p $backupFileName.zip | mysql -uroot -p$DEFAULT_DB_PASS -P 3308 -h 127.0.0.1 refapp250 &
wait
echo "Finished restoring DB file"