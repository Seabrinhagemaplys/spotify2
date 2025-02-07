import { Router, Request, Response, NextFunction } from "express";
import { verifyJWT } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";
import musicServices from "../services/musicServices";

const router = Router();

router.post("/", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicServices.createMusic(
			req.body.nome,
			req.body.genero,
			req.body.ID_Artista,
			req.body.album
		);
		res.status(statusCodes.CREATED).json(music);
	} catch (error) {
		next(error);
	}
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musicList = await musicServices.getAllMusic();
		res.status(statusCodes.SUCCESS).json(musicList);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await musicServices.getMusicById(Number(req.params.id));
		if (!music) {
			return res.status(statusCodes.NOT_FOUND).json({ message: "Música não encontrada" });
		}
		res.status(statusCodes.SUCCESS).json(music);
	} catch (error) {
		next(error);
	}
});

router.put("/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedMusic = await musicServices.updateMusica(Number(req.params.id), req.body);
		res.status(statusCodes.SUCCESS).json(updatedMusic);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		await musicServices.deleteMusica(Number(req.params.id));
		res.status(statusCodes.NO_CONTENT).send();
	} catch (error) {
		next(error);
	}
});

export default router;
