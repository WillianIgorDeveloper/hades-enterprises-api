import { sql } from "../database/postgres";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export const signUp = async (email: string, password: string) => {
	try {
		const hasUser = await sql`SELECT * FROM users WHERE email = ${email}`;
		if (hasUser.length > 0)
			return {
				success: false,
				message: "Email or password invalid",
				token: null,
			};
		const { SALT, JWT_KEY } = process.env;
		const hash = bcrypt.hashSync(password, Number(SALT));
		const id = uuidv4();
		const response = await sql`
			INSERT INTO users (id, email, password) 
			VALUES (${id}, ${email}, ${hash}) 
			RETURNING id
        `;
		const token = jwt.sign({ id: response[0].id }, `${JWT_KEY}`, { expiresIn: "7d" });
		return {
			success: true,
			message: "User created successfully",
			token,
		};
	} catch (error) {
		console.log(error);
		throw new Error("SignUp Error");
	}
};

export const verifyToken = async (token: string) => {
	try {
		const { JWT_KEY } = process.env;
		const decoded = jwt.verify(token, `${JWT_KEY}`);
		if (!decoded) return { success: false, message: "Invalid token" };
		return { success: true, message: "Valid token" };
	} catch (error) {
		console.log(error);
		throw new Error("VerifyToken Error");
	}
};

export const signIn = async (email: string, password: string) => {
	try {
		const { JWT_KEY } = process.env;
		const response = await sql`SELECT * FROM users WHERE email = ${email}`;
		if (response.length === 0)
			return {
				success: false,
				message: "Email or password invalid",
				token: null,
			};
		const { id, password: hash } = response[0];
		const isValid = bcrypt.compareSync(password, hash);
		if (!isValid)
			return {
				success: false,
				message: "Email or password invalid",
				token: null,
			};
		const token = jwt.sign({ id }, `${JWT_KEY}`, { expiresIn: "6d" });
		return {
			success: true,
			message: "User logged successfully",
			token,
		};
	} catch (error) {
		console.log(error);
		throw new Error("SignIn Error");
	}
};
