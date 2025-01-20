import prisma from "../../../../database/prismaClient";

class userService{
        // Criar um novo usuário
        async create(data: { nome: string; email: string; senha: string; foto?: string; admin?: boolean }) {
          return prisma.usuarios.create({
            data,
          });
        }
        // Obter todos os usuários
        async findAll() {
          return prisma.usuarios.findMany();
        }
      
        // Encontrar um usuário pelo ID
        async findById(id: number) {
          return prisma.usuarios.findUnique({
            where: { ID_Usuario: id },
          });
        }    
        //Atualizar os dados de um artista
       // Deletar um artista pelo ID
}