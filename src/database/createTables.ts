import { sql } from "./postgres";
const createTable = async () => {
	try {
		await sql`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            createdat TIMESTAMP DEFAULT NOW()
        )`;
		console.log("Tables created successfully");
	} catch (error) {
		console.log(error);
	}
};
createTable();