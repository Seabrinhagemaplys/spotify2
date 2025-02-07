import { PrismaClient } from "@prisma/client";
import { Usuario } from "@prisma/client";
import { QueryError } from "../../../../errors/errors/QueryError";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";
import bcrypt from "bcrypt";
import { NotAuthorizedError } from "../../../../errors/errors/NotAuthorizedError";

const prisma = new PrismaClient();


// Usuário Service
class UserService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	// Método para criar um novo usuário
	async createUser(body: Usuario, reqUser: Usuario) {
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
		if(body.admin && reqUser.admin == false) {
			throw new QueryError("Apenas administradores podem criar administradores!");
		}
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
	async getUserById(id: number, reqUser: Usuario) {
		if(reqUser.admin == false && reqUser.ID_Usuario !== id){
			throw new NotAuthorizedError("Você deve ser um administrador para ver dados de outros usuarios!");
		}
		const user = await prisma.usuario.findUnique({
			where: { ID_Usuario: id },
			include: { musicas: true }, //musicas conectados ao usuario
		});
		if(!user) {
			throw new QueryError("Usuario nao encontrado!");
		}
		return user;
	}
	//Método para buscar todos os usuários cadastrados
	async getAllUsers(reqUser: Usuario) {
		if(reqUser.admin == false){
			throw new NotAuthorizedError("Ação restrita a administradores!");
		}
		return prisma.usuario.findMany();
	}

	async updateUser(email: string, body: Partial<Usuario>, reqUser: Usuario) {
		try {
			const userFound = await prisma.usuario.findUnique({
				where: { email }
			});
			if(!userFound) {
				throw new QueryError("Usuario nao encontrado!");
			}
			if(body.ID_Usuario !== undefined) {
				throw new NotAuthorizedError("Não é permitido alterar o ID do usuário!"); 
			}
			if(body.admin !== undefined && reqUser.admin == false){
				throw new NotAuthorizedError("Somente administradores podem alterar o cargo de um usuario!");
			}
			if(reqUser.admin == false && email !== reqUser.email){
				throw new NotAuthorizedError("Somente administradores podem alterar outros usuarios!");	
			}
			if(body.email && body.email.trim() === ""){
				throw new InvalidParamError("Email deve ser informado!");
			}
			if(body.senha){
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
					email: email,
				},
			});
			return updatedUser;
		} catch (error) {
			console.error("Erro ao atualizar os dados: ", error);
			throw error;
		}
	}
	async deleteUser(email: string, reqUser: Usuario) {
		try {
			const userFound = await prisma.usuario.findUnique({
				where: { email }
			});
			if(!userFound) {
				throw new QueryError("Usuario nao encontrado!");
			}
			if(reqUser.admin == false && reqUser.email !== email) {
				throw new NotAuthorizedError("Voce nao tem permissao para deletar outros usuarios!");
			}
			await prisma.usuario.delete({
				where: { email },
			});
			console.log("Usuário deletado com sucesso.");
		} catch (error) {
			console.error("Erro ao deletar usuário:", error);
			throw error;
		}
	}
}

export default new UserService();
