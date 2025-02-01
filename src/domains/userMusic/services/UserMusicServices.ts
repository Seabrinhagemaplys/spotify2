import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserMusicService {
    // Método para adicionar uma música à lista do usuário
  async addMusicToUser(ID_Usuario: number, ID_Musica: number) {
    return prisma.usuarios_Musicas.create({
      data: { ID_Usuario, ID_Musica },
    });
  }
//Método para remover uma música da lista do usuário
  async removeMusicFromUser(ID_Usuario: number, ID_Musica: number) {
    return prisma.usuarios_Musicas.delete({
      where: { 
        ID_Usuario_ID_Musica: { ID_Usuario, ID_Musica } // Verifique se essa é realmente a chave no Prisma
      },
    });
  }
//Método para buscar todas as músicas de um usuário definido
  async getUserMusic(ID_Usuario: number) {
    return prisma.usuarios_Musicas.findMany({
      where: { ID_Usuario },
      include: { musica: true },
    });
  }
}

const userMusicService = new UserMusicService();

export { userMusicService };
