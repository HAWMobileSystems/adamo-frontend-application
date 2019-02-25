#! /bin/sh
docker exec -i intsys_postgres_1 pg_restore -c -d postgres < ipim.dump 
# docker-compose exec -u postgres postgres pg_restore -C -d postgres < ipim.dump
# You'll need to change: <filename>.sql , -i <docker-container-name> and  -U <username