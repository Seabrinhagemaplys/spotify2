import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Usuário Service
class UserService {
  // Método para criar um novo usuário
  async createUser(nome: string, email: string, senha: string, admin: boolean = false, foto?: string) {
    return prisma.usuario.create({
      data: { nome, email, senha, admin, foto },
    });
  }
//Método para buscar um usuário pelo ID com suas músicas associadas
  async getUserById(id: number) {
    return prisma.usuario.findUnique({ 
      where: { ID_Usuario: id }, 
      include: { musicas: true }//musicas conectados ao usuario
    });
  }
//Método para buscar todos os usuários cadastrados
  async getAllUsers() {
    return prisma.usuario.findMany();
  }

}
