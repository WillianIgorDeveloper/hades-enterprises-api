import express from "express";
import cors from "cors";
const server = express();
const { PORT } = process.env;
server.use(express.json());
server.use(cors());
server.listen(PORT ?? 5000, () => {
	console.log(`Server listening on port ${PORT ?? 5000}`);
});

import authRouter from "./routes/auth";
server.use("/auth", authRouter);

import users from "./routes/users";
server.use("/users", users);
