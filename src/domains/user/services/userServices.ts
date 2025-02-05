import { PrismaClient } from "@prisma/client";
import { Usuario } from "@prisma/client";
const prisma = new PrismaClient();

// Usuário Service
class UserService {
	// Método para criar um novo usuário
	async createUser(body: Usuario) {
		const user = await prisma.usuario.create({
			data: {
				nome: body.nome,
				email: body.email,
				foto: body.foto,
				senha: body.senha,
				admin: body.admin
			}
		});
		return user;
	}
	//Método para buscar um usuário pelo ID com suas músicas associadas
	async getUserById(id: number) {
		return prisma.usuario.findUnique({
			where: { ID_Usuario: id },
			include: { musicas: true }, //musicas conectados ao usuario
		});
	}
	//Método para buscar todos os usuários cadastrados
	async getAllUsers() {
		return prisma.usuario.findMany();
	}

	async updateUser(email: string, body: Partial<Usuario>) {
		try {
			// Verifica se o usuário existe
			const userFound = await prisma.usuario.findUnique({
				where: { email },
			});

			if (!userFound) {
				throw new Error("Usuário não encontrado.");
			}

			const updatedUser = await prisma.usuario.update({
				data: {
					nome: body.nome,
					email: body.email,
					senha: body.senha,
					foto: body.foto,
					admin: body.admin,
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
			await prisma.usuario.delete({
				where: { email },
			});
			console.log("Usuário deletado com sucesso.");
		} catch (error) {
			console.error("Erro ao deletar usuário:", error);
			throw new Error("Não foi possível deletar o usuário.");
		}
	}
}
export default new UserService();
