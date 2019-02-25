# docker exec -t intsys_postgres_1 pg_dumpall -c -U postgres > 20190215_dump.sql
# docker-compose exec postgres backup
docker-compose exec --user postgres postgres pg_dump -Fc ipim > ipim.dump
#docker-compose -f local.yml exec postgres restore backup_2018_03_13T09_05_07.sql.gz
# You'll need to fix the -U <username> and the > <date>_dump.sql