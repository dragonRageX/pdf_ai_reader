import * as mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export async function connectSingleStore(
    config: Partial<mysql.ConnectionOptions> = {}
) {
    const baseConfig: mysql.ConnectionOptions = {
        host: process.env.HOST,
        password: process.env.PASSWORD,
        user: "admin",
    };

    return await mysql.createConnection({
        ...baseConfig,
        ...config,
    });
}

export async function stopSingleStore(conn: mysql.Connection) {
    await conn.end();
}

export async function getDatabases({ conn }: { conn?: mysql.Connection } = {}) {
    try {
        let closeConn = false;
        if (!conn) {
            conn = await connectSingleStore();
            closeConn = true;
        }

        const [results] = await conn.query("SHOW DATABASES");
        console.log("get databases:", { results });

        if (closeConn) {
            await stopSingleStore(conn);
        }

        return results;
    } catch (error) {
        console.error({ error });
        return error;
    }
}

export async function selectTable({
    conn,
    database,
    table,
}: {
    conn?: mysql.Connection;
    database: string;
    table: string;
}) {
    try {
        let closeConn = false;
        if (!conn) {
            conn = await connectSingleStore({ database });
            closeConn = true;
        }

        const [rows, fields] = await conn.query(`SELECT * FROM ${table}`);
        console.log("select table:", table, { rows });

        if (closeConn) {
            await stopSingleStore(conn);
        }

        return rows;
    } catch (error) {
        console.error({ error });
        return error;
    }
}

export async function readData({ conn, database, embedding }: { conn?: mysql.Connection, database: string, embedding: any })
{
    try {
        let closeConn = false;
        if (!conn) {
            conn = await connectSingleStore({ database });
            closeConn = true;
        }

        const [rows] = await conn.execute(
            `SELECT text, DOT_PRODUCT(embedding, JSON_ARRAY_PACK('[${embedding}]')) AS similarity FROM my_book ORDER BY similarity DESC LIMIT 1`   //This SQL command sorts the most similar text to the user query/prompt text in descending order. This comparison is based on the dot product (cosine similarity) of the embedding present in our SingleStoreDB table and the embedding of the user query/prompt. It gives back the 'text' and 'similarity' column values which match our user query text
        );

        if (closeConn) {
            await stopSingleStore(conn);
        }

        console.log("Rows[0]: ", rows[0]);
        return (rows[0]);
        
    } catch (error) {
        console.error(error);
        return error;
    }
}
