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
      include: { musicas: true }
    });
  }
//Método para buscar todos os artistas cadastrados
  async getAllArtists() {
    return prisma.artista.findMany();
  }
}
