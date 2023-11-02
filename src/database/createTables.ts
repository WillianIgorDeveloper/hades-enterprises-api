import { sql } from "./postgres";

const createTable = async () => {
	try {
		await sql`
			CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS users (
            id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            createdat TIMESTAMP DEFAULT NOW()
      	);
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS sectors (
				id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
				name TEXT NOT NULL
			);
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS companies (
				id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
				name TEXT NOT NULL,
				description TEXT
			);	
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS roles (
				id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
				name TEXT NOT NULL
			);
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS profiles (
				id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
				user_id uuid REFERENCES users(id) ON DELETE CASCADE,
				sector_id uuid REFERENCES sectors(id),
				nickname TEXT NOT NULL
			);	
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS companies_sectors (
				id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
				company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
				sector_id uuid REFERENCES sectors(id) ON DELETE CASCADE
			);
		`;
		await sql`
			CREATE TABLE IF NOT EXISTS users_roles_companies (
				id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
				user_id uuid REFERENCES users(id) ON DELETE CASCADE,
				role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
				company_id uuid REFERENCES companies(id) ON DELETE CASCADE
			);
		`;
		console.log("Tables created successfully");
	} catch (error) {
		console.log(error);
	}
};
createTable();
