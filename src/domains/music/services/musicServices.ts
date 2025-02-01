import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MusicService {
   // Método para criar uma nova música
  async createMusic(nome: string, genero: string, ID_Artista: number, album?: string) {
    return prisma.musica.create({
      data: { nome, genero, album, ID_Artista },
    });
  }
  // Método para buscar uma música pelo ID
  async getMusicById(id: number) {
    return prisma.musica.findUnique({ 
      where: { ID_Musica: id }, 
      include: { artista: true }
    });
  }
// Método para buscar todas as músicas cadastradas
  async getAllMusic() {
    return prisma.musica.findMany();
  }
   
}