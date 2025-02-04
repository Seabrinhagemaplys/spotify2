import { Router, Request, Response, NextFunction } from "express";
import userService from "../services/userServices";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) =>{
	try {
		const users = await userService.getAllUsers();
		res.json(users);
	} catch(error){
		next(error);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.getUserById(Number(req.params.id));
		res.json(user);
	} catch(error){
		next(error);
	}
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { nome, email, senha, admin, foto} = req.body;
		const user = await userService.createUser(nome, email, senha, admin, foto);
		res.json(user);
	} catch(error){
		next(error);
	}
});

export default router;