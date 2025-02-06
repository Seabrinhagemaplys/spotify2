import { PrismaClient } from "@prisma/client";
import { Usuario } from "@prisma/client";
import { QueryError } from "../../../../errors/errors/QueryError";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


// Usuário Service
class UserService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	// Método para criar um novo usuário
	async createUser(body: Usuario) {
		const checkUser = await prisma.usuario.findUnique({
			where: {
				email: body.email
			}
		});
		if(body.nome == null || body.nome.trim() === "") {
			throw new InvalidParamError("Nome do usuario deve ser informado!");
		}		
		if(body.email == null) {
			throw new InvalidParamError("Email nao informado!");
		}
		if(body.senha == null || body.senha.length < 6) {
			throw new InvalidParamError("Senha deve ter no minimo 6 caracteres!");
		}
		// if(body.admin && !reqUser.admin) {
		// 	throw new QueryError("Apenas administradores podem criar administradores!");
		//}
		if(checkUser) {
			throw new QueryError("Esse email ja esta cadastrado!");
		}
		const encrypted = await this.encryptPassword(body.senha);		
		const user = await prisma.usuario.create({
			data: {
				nome: body.nome,
				email: body.email,
				foto: body.foto,
				senha: encrypted,
				admin: body.admin || false
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

	async updateUser(email: string, body: Partial<Usuario>, reqUser: Usuario) {
		const userFound = await prisma.usuario.findUnique({
			where: {
				email
			}
		});
		if(!userFound) {
			throw new QueryError("Usuario nao encontrado!");
		}

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
	async deleteUser(email: string, reqUser: Usuario) {
		const userFound = await prisma.usuario.findUnique({
			where: {
				email
			}
		});
		if(!userFound) {
			throw new QueryError("Usuario nao encontrado!");
		}
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
