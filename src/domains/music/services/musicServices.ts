import prisma from "../../../../database/prismaClient";
export class MusicService {
    // Criar uma nova música
    async create(data: { nome: string; genero: string; album?: string; ID_Artista: number }) {
      return prisma.musicas.create({
        data,
      });
    }
  
    // Obter todas as músicas
    async findAll() {
      return prisma.musicas.findMany();
    }
  
    // Encontrar uma música pelo ID
    async findById(id: number) {
      return prisma.musicas.findUnique({
        where: { ID_Musica: id },
      });
    }
    //Atualizar os dados de uma música
    //Deletar uma música pelo ID
}