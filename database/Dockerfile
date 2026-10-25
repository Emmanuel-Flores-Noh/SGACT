FROM mariadb:11.4


COPY ./init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY ./seed.sql /docker-entrypoint-initdb.d/02-seed.sql