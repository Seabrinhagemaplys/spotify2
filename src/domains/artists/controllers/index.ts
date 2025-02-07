import { Router, Request, Response, NextFunction } from "express";
import ArtistService  from "../services/artistsServices";
import { checkRole, verifyJWT } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";


const router = Router();

//Middlewares: verifyJWT (vê se o usuário está logado)
router.get("/", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artists = await ArtistService.getAllArtists();
		res.status(statusCodes.SUCCESS).json(artists);
	} catch(error) {
		next(error);
	}
});

//Middlewares: verifyJWT 
router.get("/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const artist = await ArtistService.getArtistById(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artist);
	} catch(error) {
		next(error);
	}
});

//Middlewares: verifyJWT e checkRole (verifica se o usuário é ADMIN ou não)
router.post("/", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { nome, foto, numero_streams } = req.body;

		const newArtist = await ArtistService.createArtist(nome, foto, numero_streams);
		res.status(statusCodes.CREATED).json(newArtist);
	} catch (error){
		next(error);
	}
});

//Middlewares: verifyJWT e checkRole
router.put("/:id", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) =>{
	try{
		const { id } = req.params;
		const body  = req.body;
		const idArtist = Number(id);
		const updatedArtista = await ArtistService.updateArtista(idArtist, body);
		res.status(statusCodes.SUCCESS).json(updatedArtista);
	} catch(error) {
		next(error);
	}
});

//Middlewares: verifyJWT e checkRole
router.delete("/:id", verifyJWT, checkRole, async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { id } = req.params;
		const idArtist = Number(id);
		await ArtistService.deleteArtista(idArtist);
		res.status(statusCodes.NO_CONTENT).send("Artista deletado");
	} catch(error) {
		next(error);
	}
});

export default router;
