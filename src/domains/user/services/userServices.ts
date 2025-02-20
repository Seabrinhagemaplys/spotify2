import prisma from "../../../../config/prismaClient";
import { Usuario } from "@prisma/client";
import { QueryError } from "../../../../errors/errors/QueryError";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";
import bcrypt from "bcrypt";
import { NotAuthorizedError } from "../../../../errors/errors/NotAuthorizedError";


// Usuário Service
class UserService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	// Método para criar um novo usuário
	async createUser(body: Usuario, reqUser: Usuario | null) {
		const checkUser = await prisma.usuario.findUnique({
			where: {
				email: body.email
			}
		});
		if (!reqUser && body.admin) {
			throw new NotAuthorizedError("Apenas administradores podem criar administradores!");
		}
		if (!body.nome || body.nome.trim() === "") {
			throw new InvalidParamError("Nome do usuario deve ser informado!");
		}
		if (!body.email || body.email.trim() === "") {
			throw new InvalidParamError("Email nao informado!");
		}
		if (body.senha == null || body.senha.length < 6) {
			throw new InvalidParamError("Senha deve ter no minimo 6 caracteres!");
		}
		if (checkUser) {
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
		const user = await prisma.usuario.findUnique({
			where: { ID_Usuario: id },
			include: {
				musicas: {
					include: {
						musica: {
							select: {
								nome: true,
							}
						}
					}
				}
			}
		});
		if (!user) {
			throw new QueryError("Usuario nao encontrado!");
		}
		const formattedUser = {
			...user,
			musicas: user.musicas.map((um) => um.musica.nome),
		}
		return formattedUser;
	}
	//Método para buscar todos os usuários cadastrados
	async getAllUsers() {
		return prisma.usuario.findMany();
	}

	async updateUser(id: number, body: Partial<Usuario>, reqUser: Usuario) {
		try {
			const userFound = await prisma.usuario.findUnique({
				where: { ID_Usuario: id }
			});
			if (!userFound) {
				throw new QueryError("Usuario nao encontrado!");
			}
			if (body.ID_Usuario !== undefined) {
				throw new NotAuthorizedError("Não é permitido alterar o ID do usuário!");
			}
			if (body.admin !== undefined && reqUser.admin === false) {
				throw new NotAuthorizedError("Somente administradores podem alterar o cargo de um usuario!");
			}
			if (body.email && body.email.trim() === "") {
				throw new InvalidParamError("Email deve ser informado!");
			}
			if (body.senha) {
				body.senha = await this.encryptPassword(body.senha);
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
					ID_Usuario: id,
				},
			});
			return updatedUser;
		} catch (error) {
			console.error("Erro ao atualizar os dados: ", error);
			throw error;
		}
	}
	async deleteUser(id: number) {
		try {
			const userFound = await prisma.usuario.findUnique({
				where: { ID_Usuario: id }
			});
			if (!userFound) {
				throw new QueryError("Usuario nao encontrado!");
			}
			await prisma.usuario.delete({
				where: { ID_Usuario: id },
			});
			console.log("Usuário deletado com sucesso.");
		} catch (error) {
			console.error("Erro ao deletar usuário:", error);
			throw error;
		}
	}
	async linkMusicToUser(userId: number, musicId: number) {
		const music = await prisma.musica.findUnique({
			where: {
				ID_Musica: musicId
			},
		});
		if (!music) {
			throw new QueryError("Musica nao encontrada!");
		}
		return await prisma.usuarios_Musicas.create({
			data: {
				ID_Usuario: userId,
				ID_Musica: musicId,
			},
		});
	}
}

export default new UserService();
