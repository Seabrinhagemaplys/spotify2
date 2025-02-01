import prisma from "../../../../database/prismaClient";
import { User } from "@prisma/client";

class userService {
  async updateUser(email: string, body: User) {
    try {
      // Verifica se o usuário existe
      const userFound = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFound) {
        throw new Error("Usuário não encontrado.");
      }

      const updatedUser = await prisma.user.update({
        data: {
          username: body.username,
          email: body.email,
          senha: body.senha,
          foto_user: body.foto_user,
        },
        where: {
          email: email,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar os dados: ", error);
      throw new Error("Não foi possível atualizar os dados.");
    }
  }
  async deleteUser(email: string) {
    try {
      await prisma.user.delete({
        where: { email },
      });
      console.log("Usuário deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw new Error("Não foi possível deletar o usuário.");
    }
  }
}
