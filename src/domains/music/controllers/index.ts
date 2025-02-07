import { Router, Request, Response, NextFunction } from "express";
import musicServices from "../services/musicServices";

const router = Router();

// Buscar todas as músicas
router.get("/", async (req:Request, res : Response, next: NextFunction) => {

    try{
        const musicas = await musicServices.getAllMusic();
        res.json(musicas);
    }catch(error){
        next(error);
    }
});

// Buscar uma música pelo ID
router.get("/:id", async (req:Request, res : Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const musica = await musicServices.getMusicById(Number(id));
        res.json(musica);
    }catch(error){
    next(error);
}
});

//Criar uma nova música

router.post("/create", async (req:Request, res: Response, next: NextFunction) => {
    try{
        const musica = await musicServices.createMusic(req.body.nome, req.body.genero, req.body.ID_Artista, req.body.album);
        res.json({message: "Música criada com sucesso!", musica});
    }catch(error){
        next(error);
    }

});

// Atualizar uma música
router.put("/update/:id", async (req:Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const musica = await musicServices.updateMusica(Number(id), req.body);
        res.json({ message: "Música atualizada com sucesso!", musica });
    }catch(error){
        next(error);
    }
});

router.put("/delete/:id", async (req: Request,res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const musica = await musicServices.deleteMusica(Number(id));
    }catch(error){
        next(error);
    }
});

export default router;
