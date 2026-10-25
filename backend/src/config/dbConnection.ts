import { createPool } from 'mariadb';
import { env } from 'node:process';

const pool = createPool({
    host: env["DB_HOST"],
    user: env["DB_USER"],
    password: env["DB_PASSWORD"],
    database: env["DB_NAME"]
});

export default pool;