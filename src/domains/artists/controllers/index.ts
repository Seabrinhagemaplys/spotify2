import { Router, Request, Response, NextFunction } from "express";
import ArtistService  from "../services/artistsServices";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artists = await ArtistService.getAllArtists();
		res.json(artists);
	} catch(error) {
		next(error);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await ArtistService.getArtistById(Number(req.params.id));
		res.json(artist);
	} catch(error) {
		next(error);
	}
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { nome, foto, numero_streams } = req.body;

		const newArtist = await ArtistService.createArtist(nome, foto, numero_streams);
		res.json(newArtist);
	} catch (error){
		next(error);
	}
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) =>{
	try{
		const { id } = req.params;
		const body  = req.body;
		const idArtist = Number(id);
		const updatedArtista = await ArtistService.updateArtista(idArtist, body);
		res.json(updatedArtista);
	} catch(error) {
		next(error);
	}
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { id } = req.params;
		const idArtist = Number(id);
		await ArtistService.deleteArtista(idArtist);
		res.send("Artista deletado");
	} catch(error) {
		next(error);
	}
});

export default router;
