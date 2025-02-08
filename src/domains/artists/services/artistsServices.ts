import { PrismaClient } from "@prisma/client";
import { Artista } from "@prisma/client";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";
import { QueryError } from "../../../../errors/errors/QueryError";

const prisma = new PrismaClient();

//ToDo: Tratamento de Erros (adicionar os res.status em artists/index.ts)

class ArtistService {
	//Método para criar um novo artista
	async createArtist(nome: string, foto?: string, numero_streams?: number) {
		try {
			if (nome == null){
				throw new InvalidParamError("Nome do artista não informado!");
			}
	
			if (numero_streams != undefined && numero_streams < 0){
				throw new QueryError("O número de stream não pode ser negativo!");
			}
	
			return await prisma.artista.create({
				data: { nome, foto, numero_streams },
			});

		} catch (error) {
			console.error("Erro ao criar o artista:", error);
			throw new Error("Não foi possível criar o artista!");
		}
	}

	//Método para buscar um artista pelo ID
	async getArtistById(id: number) {
		try {

			if (!id){
				throw new InvalidParamError("ID inválido!");
			}

			const artista = await prisma.artista.findUnique({
				where: { ID_Artista: id },
				include: { musicas: true },
			});

			if (!artista) {
				throw new QueryError("Artista não encontrado!");
			}
		} catch (error) {
			console.error("Erro ao buscar o artista", error);
			throw new Error("Não foi possível achar o artista!");
		}
	}

	//Método para buscar todos os artistas cadastrados
	async getAllArtists() {

		try{
			return await prisma.artista.findMany({
				orderBy: {
					nome: "asc", // Ordena em ordem alfabética crescente (A-Z)
				},
			});
		} catch(error){
			console.error("Erro ao buscar os artistas", error);
			throw new Error("Não foi possível buscar os artistas!");
		}
	}

	async updateArtista(id: number, body: Partial<Artista>) {
		try {

			if (!id){
				throw new InvalidParamError("ID inválido!");
			}

			const artistaFound = await prisma.artista.findUnique({
				where: { ID_Artista: id },
			});

			if (!artistaFound) {
				throw new QueryError("Artista não encontrado!");
			}

			if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
				throw new InvalidParamError("Nenhum dado informado para atualização!");
			}

			const updatedArtista = await prisma.artista.update({
				data: {
					nome: body.nome,
					foto: body.foto,
					numero_streams: body.numero_streams,
				},
				where: { ID_Artista: id },
			});

			return updatedArtista;
		} catch (error) {
			console.error("Erro ao atualizar artista: ", error);
			throw new Error("Não foi possível atualizar o artista.");
		}
	}

	async deleteArtista(id: number) {
		try {

			if (!id){
				throw new InvalidParamError("ID inválido!");
			}

			const artista = await prisma.artista.findUnique({
				where: { ID_Artista: id },
				include: { musicas: true },
			});

			if (!artista) {
				throw new QueryError("Artista não encontrado!");
			}

			await prisma.artista.delete({
				where: { ID_Artista: id },
			});
			
			console.log("Artista deletado com sucesso.");
		} catch (error) {
			console.error("Erro ao deletar artista:", error);
			throw new Error("Não foi possível deletar o artista.");
		}
	}
}

export default new ArtistService();
