import { verifyToken } from "../controllers/auth";
import {
	createCompany,
	createProfile,
	getProfile,
	getSectors,
} from "../controllers/users";
import { Router } from "express";
const router = Router();
export default router;

// -------- Middleware --------
router.use(async (req, res, next) => {
	const { success, message, userId } = await verifyToken(
		req.headers.authorization as string
	);
	if (!success) return res.status(401).send(message);
	(req as any).userId = userId;
	next();
});

router.get("/profile", async (req, res) => {
	try {
		const { success, message, data } = await getProfile((req as any).userId);
		return res.status(200).send({ success, message, data });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.get("/sectors", async (req, res) => {
	try {
		const { success, message, data } = await getSectors();
		return res.status(200).send({ success, message, data });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.post("/createProfile", async (req, res) => {
	try {
		const { nickname, sectorId, companyName } = req.body;
		if (!sectorId || !nickname) return res.status(400).send("Missing fields");
		const { success, message } = await createProfile(
			(req as any).userId,
			sectorId,
			nickname,
			companyName
		);
		return res.status(200).send({ success, message });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

router.post("/newCompany", async (req, res) => {
	try {
		const { name, description, sectors } = req.body;
		if (!name || !sectors) return res.status(400).send("Missing fields");
		const { success, message } = await createCompany(
			(req as any).userId,
			name,
			description,
			sectors
		);
		return res.status(200).send({ success, message });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});
