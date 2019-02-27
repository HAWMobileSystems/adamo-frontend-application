#! /bin/sh
# Hey there.. there are some odd things going around
# If any errror occurs please check the file encoding with the following command  > the correct one should be UTF-8
# file dump.sql
# > postgres\dump.sql: Little-endian UTF-16 Unicode text, with very long lines, with CRLF line terminators 
# maybe this is related to the shell inside vscode 
# you can change file encoding using following command 
# iconv -f UTF-16LE -t UTF-8 ./postgres/dump.sql -o ./postgres/dump-UTF-8.sql
# if you file the new file again maybe you'll get 
# > postgres\dump-UTF-8.sql: UTF-8 Unicode (with BOM) text, with very long lines, with CRLF line terminators
# now go to any console you like (do not use vscode terminal :D) and exit this script

cat ./postgres/dump-UTF-8.sql | docker exec -i intsys_postgres_1 psql -U postgres


# cat dump.sql | docker exec -i intsys_postgres_1 /usr/bin/psql -h [POSTGRESQL_HOST] -U postgres

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d <database-name> -f /data/database_bkp.sql)
# docker-compose exec -u postgres postgres pg_restore -C -d postgres < ipim.dump 
# docker exec -i intsys_postgres_1 pg_restore -c -d postgres < ipim.dump
