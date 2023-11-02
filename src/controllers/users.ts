import { sql } from "../database/postgres";

export const getProfile = async (userId: string) => {
	try {
		const response = await sql`
			SELECT * FROM profiles
			WHERE user_id = ${userId}
      `;
		if (response.length === 0)
			return { success: true, message: "Profile not found", data: null };
		return { success: true, message: "Profile found", data: response[0] };
	} catch (error) {
		console.log(error);
		throw new Error("getProfile Error");
	}
};

export const getSectors = async () => {
	try {
		const response = await sql`
			SELECT * FROM sectors
		`;
		return { success: true, message: "Sectors found", data: response };
	} catch (error) {
		console.log(error);
		throw new Error("getSectors Error");
	}
};

export const createProfile = async (
	userId: string,
	sectorId: string,
	nickname: string,
	companyName: string | null
) => {
	try {
		const hasProfile = await sql`
			SELECT * FROM profiles
			WHERE user_id = ${userId}
		`;
		if (hasProfile.length > 0)
			return { success: false, message: "Profile already exists" };
		await sql`
			INSERT INTO profiles (user_id, sector_id, nickname)
			VALUES (${userId}, ${sectorId}, ${nickname})
		`;
		if (companyName) {
			const [company] = await sql`
				INSERT INTO companies (name)
				VALUES (${companyName})
				returning id
			`;
			const [role] = await sql`
				SELECT id FROM roles
				WHERE name = 'Owner' 
			`;
			await sql`
				INSERT INTO users_roles_companies (user_id, role_id, company_id)
				VALUES (${userId}, ${role.id}, ${company.id})
			`;
		}
		return { success: true, message: "Profile created" };
	} catch (error) {
		console.log(error);
		throw new Error("createProfile Error");
	}
};

export const createCompany = async (
	userId: string,
	name: string,
	description: string,
	sectors: string[]
) => {
	try {
		const response = await sql`
			INSERT INTO companies (name, description)
			VALUES (${name}, ${description})
			RETURNING id
		`;
		const companyId = response[0].id;
		await sql`
			INSERT INTO users_roles_companies (companies_id, users_id, roles_id)
			VALUES (${companyId}, ${userId})
		`;
		for (const sectorId of sectors) {
			await sql`
				INSERT INTO companies_sectors (companies_id, sectors_id)
				VALUES (${companyId}, ${sectorId})
			`;
		}
		return { success: true, message: "Company created" };
	} catch (error) {
		console.log(error);
		throw new Error("createCompany Error");
	}
};
