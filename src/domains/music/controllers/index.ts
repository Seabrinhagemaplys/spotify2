import { Router, Request, Response, NextFunction } from "express";
import { verifyJWT, checkRole } from "../../../middlewares/auth";
import musicServices from "../services/musicServices";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";
import { QueryError } from "../../../../errors/errors/QueryError";

const router = Router();

router.post("/", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { nome, genero, ID_Artista, album } = req.body;
		if (!nome || !genero || !ID_Artista) {
			throw new InvalidParamError("Nome, gênero e ID do artista são obrigatórios!");
		}
		const music = await musicServices.createMusic(nome, genero, ID_Artista, album);
		res.json(music);
	} catch (error) {
		next(error);
	}
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musicList = await musicServices.getAllMusic();
		res.json(musicList);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			throw new InvalidParamError("ID inválido!");
		}
		const music = await musicServices.getMusicById(id);
		if (!music) {
			throw new QueryError("Música não encontrada!");
		}
		res.json(music);
	} catch (error) {
		next(error);
	}
});

router.put("/:id", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			throw new InvalidParamError("ID inválido!");
		}
		const updatedMusic = await musicServices.updateMusica(id, req.body);
		res.json(updatedMusic);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			throw new InvalidParamError("ID inválido!");
		}
		await musicServices.deleteMusica(id);
		res.send();
	} catch (error) {
		next(error);
	}
});

export default router;

