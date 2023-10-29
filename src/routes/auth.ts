import { signIn, signUp, verifyToken } from "../controllers/auth";
import { Router } from "express";
const router = Router();
export default router;

router.post("/signup", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).send("Missing email or password");
		const { success, message, token } = await signUp(email, password);
		return res.status(200).send({ success, message, token });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.get("/verifyToken/:token", async (req, res) => {
	try {
		const { token } = req.params;
		if (!token) return res.status(400).send("Missing token");
		const { success, message } = await verifyToken(token);
		return res.status(200).send({ success, message });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.get("/signin/:email?/:password?", async (req, res) => {
	try {
		const { email, password } = req.params;
		if (!email || !password) return res.status(400).send("Missing email or password");
		const { success, message, token } = await signIn(email, password);
		return res.status(200).send({ success, message, token });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});
