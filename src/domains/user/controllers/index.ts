import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/userServices";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) =>{
	try {
		const users = await UserService.getAllUsers();
		res.json(users);
	} catch(error){
		next(error);
	}
});

export default router;