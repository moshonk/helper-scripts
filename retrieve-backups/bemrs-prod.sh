#!/bin/bash
time=$(date +%Y-%m-%d_%H%M%S)
echo "$time"
backupFileName="openmrs_prod_backup_$time.sql"
ssh root@192.168.53.42 "mysqldump -uroot -p"$DEFAULT_DB_PASS" -h 127.0.0.1 --column-statistics=0 openmrs | zip /tmp/"$backupFileName".zip -" &
# ssh root@192.168.53.42 "mysqldump --single-transaction --quick --lock-tables=false --compression-algorithms=ZLIB -uroot -p"$DEFAULT_DB_PASS" -h 127.0.0.1 --column-statistics=0 openmrs | zip /tmp/"$backupFileName".zip -" &
echo "Backing up remote database openmrs" &
wait &
cd /tmp
wait
rm -f $backupFileName.zip &
wait
echo "Copying backed-up db" &
wait
scp root@192.168.53.42:/tmp/$backupFileName.zip . &
wait
echo "Extracting and Restoring DB file" &
unzip -p $backupFileName.zip | mysql -uroot -p$DEFAULT_DB_PASS -P 3308 -h 127.0.0.1 refapp250 &
wait
echo "Finished restoring DB file"