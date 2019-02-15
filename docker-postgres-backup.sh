docker exec -t intsys_postgres_1 pg_dumpall -c -U postgres > 20190215_dump.sql

# You'll need to fix the -U <username> and the > <date>_dump.sql