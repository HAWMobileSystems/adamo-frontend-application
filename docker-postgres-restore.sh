cat 20190215_dump.sql | docker exec -i intsys_postgres_1 psql -U postgres

# You'll need to change: <filename>.sql , -i <docker-container-name> and  -U <username