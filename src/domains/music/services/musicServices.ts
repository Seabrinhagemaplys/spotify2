import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MusicServices {
	// Método para criar uma nova música
	async createMusic(
		nome: string,
		genero: string,
		ID_Artista: number,
		album?: string
	) {
		return prisma.musica.create({
			data: { nome, genero, album, ID_Artista },
		});
	}
	// Método para buscar uma música pelo ID
	async getMusicById(id: number) {
		return prisma.musica.findUnique({
			where: { ID_Musica: id },
			include: { artista: true },
		});
	}
	// Método para buscar todas as músicas cadastradas
	async getAllMusic() {
		return prisma.musica.findMany();
	}

	async updateMusica(id: number, body: any) {
		try {
			const musicaFound = await prisma.musica.findUnique({
				where: { ID_Musica: id },
			});

			if (!musicaFound) {
				throw new Error("Música não encontrada.");
			}

			const updatedMusica = await prisma.musica.update({
				data: {
					nome: body.nome,
					genero: body.genero,
					album: body.album,
					ID_Artista: body.ID_Artista,
				},
				where: { ID_Musica: id },
			});

			return updatedMusica;
		} catch (error) {
			console.error("Erro ao atualizar música: ", error);
			throw new Error("Não foi possível atualizar a música.");
		}
	}

	async deleteMusica(id: number) {
		try {
			await prisma.musica.delete({
				where: { ID_Musica: id },
			});
			console.log("Música deletada com sucesso.");
		} catch (error) {
			console.error("Erro ao deletar música:", error);
			throw new Error("Não foi possível deletar a música.");
		}
	}
}
export default new MusicServices();
