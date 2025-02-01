import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ArtistService {
	//Método para criar um novo artista
	async createArtist(nome: string, foto?: string, numero_streams?: number) {
		return prisma.artista.create({
			data: { nome, foto, numero_streams },
		});
	}
	//Método para buscar um artista pelo ID
	async getArtistById(id: number) {
		return prisma.artista.findUnique({
			where: { ID_Artista: id },
			include: { musicas: true },
		});
	}
	//Método para buscar todos os artistas cadastrados
	async getAllArtists() {
		return prisma.artista.findMany();
	}

	async updateArtista(id: number, body: any) {
		try {
			const artistaFound = await prisma.artista.findUnique({
				where: { ID_Artista: id },
			});

			if (!artistaFound) {
				throw new Error("Artista não encontrado.");
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
