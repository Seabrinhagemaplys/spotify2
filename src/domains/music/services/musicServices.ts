import { PrismaClient } from "@prisma/client";
import { QueryError } from "../../../../errors/errors/QueryError";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";

const prisma = new PrismaClient();

class MusicServices {
    async createMusic(nome: string, genero: string, ID_Artista: number, album?: string) {
        try {
            if (!nome || nome.trim() === "") {
                throw new InvalidParamError("Nome da música deve ser informado!");
            }
            if (!genero || genero.trim() === "") {
                throw new InvalidParamError("Gênero da música deve ser informado!");
            }
            if (!ID_Artista) {
                throw new InvalidParamError("ID do artista deve ser informado!");
            }
            const music = await prisma.musica.create({ data: { nome, genero, album, ID_Artista } });
            return music;
        } catch (error) {
            console.error("Erro ao criar música: ", error);
            throw new QueryError("Erro ao criar música.");
        }
    }

    async getMusicById(id: number) {
        try {
            if (!id || isNaN(id)) {
                throw new InvalidParamError("ID inválido.");
            }
            const music = await prisma.musica.findUnique({ where: { ID_Musica: id }, include: { artista: true } });
            if (!music) {
                throw new QueryError("Música não encontrada.");
            }
            return music;
        } catch (error) {
            console.error("Erro ao buscar música: ", error);
            throw error;
        }
    }

    async getAllMusic() {
        try {
            const musicas = await prisma.musica.findMany();
            return musicas;
        } catch (error) {
            console.error("Erro ao buscar músicas: ", error);
            throw new QueryError("Erro interno ao buscar músicas.");
        }
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
