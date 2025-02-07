import { Router, Request, Response, NextFunction } from "express";
import userService from "../services/userServices";
import { checkRole, login, logout, verifyJWT } from "../../../middlewares/auth";

const router = Router();

router.get("/", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) =>{
	try {
		const users = await userService.getAllUsers();
		res.json(users);
	} catch(error){
		next(error);
	}
});

router.get("/:id", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { id } = req.params;
		const user = await userService.getUserById(Number(id));
		res.json(user);
	} catch(error){
		next(error);
	}
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await userService.createUser(req.body, req.user);
		res.json({ message: "Usuario criado com sucesso!", user: user});
	} catch(error){
		next(error);
	}
});

router.put("/update/:email", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email } = req.params;
		const body = req.body;
		const user = await userService.updateUser(email, body, req.user);
		res.json({ message: "Usuario atualizado com sucesso!", user: user});	
	} catch (error) {
		next(error);
	}
});

router.delete("/delete/:email", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email } = req.params;
		await userService.deleteUser(email, req.user);
		res.json({ message: "Usuario deletado com sucesso!"});
	} catch (error) {
		next(error);
	}
});

router.post("/login", login);

router.post("/logout", verifyJWT, logout);

export default router;