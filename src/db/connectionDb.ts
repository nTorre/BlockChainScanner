import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

const dbConfig: DBConfig = {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: Number.parseInt(process.env.PORT || '3006')
};

export const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port
});

module.exports = { connection };