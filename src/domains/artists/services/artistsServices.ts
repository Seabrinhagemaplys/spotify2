import prisma from "../../../../database/prismaClient";

export class ArtistService {
    // Criar um novo artista
    async create(data: { nome: string; foto?: string; numero_streams: number }) {
     return prisma.artistas.create({
    data,
    });
    }
  
    // Obter todos os artistas
    async findAll() {
      return prisma.artistas.findMany();
    }
  
    // Encontrar um artista pelo ID
    async findById(id: number) {
      return prisma.artistas.findUnique({
        where: { ID_Artista: id },
      });
}
// Atualizar os dados de um artista
// Deletar um artista pelo ID
}

