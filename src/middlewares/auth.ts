import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";
import { PermissionError } from "../../errors/errors/PermissionError";
import { NotAuthorizedError } from "../../errors/errors/NotAuthorizedError";
import { compare } from "bcrypt";
import statusCodes from "../../utils/constants/statusCodes";
import { Usuario } from "@prisma/client";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { TokenError } from "../../errors/errors/TokenError";

function generateJWT(user: Usuario, res: Response){
	const body = {
		ID_Usuario: user.ID_Usuario,
		nome: user.nome,
		email: user.email,
		admin: user.admin,
	};
	const token = sign({user: body}, process.env.SECRET_KEY || "", {expiresIn: Number(process.env.JWT_EXPIRATION)});
	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development"
	});
}

function cookieExtractor(req: Request){
	let token = null;
	if(req.cookies) {
		token = req.cookies["jwt"];
	}
	return token;
}

export function verifyJWT(req: Request, res: Response, next: NextFunction){
	try {
		const token = cookieExtractor(req);
		if(token){
			const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
			req.user = decoded.user;
		}
		if(req.user == null){
			throw new TokenError("Voce precisa estar logado para realizar essa açao!");
		}
		next();
	} catch (error) {
		next(error);
	}
}

export async function login(req: Request, res: Response, next: NextFunction){
	try{
		const user = await prisma.usuario.findUnique({
			where: {
				email: req.body.email
			}
		});
		if(!user){
			throw new PermissionError("Email e/ou senha incorretos!");
		}
		const match = await compare(req.body.senha, user.senha);
		if(!match){
			throw new PermissionError("Email e/ou senha incorretos!");
		}
		generateJWT(user, res);
		res.status(statusCodes.SUCCESS).json("Login realizado com sucesso!");
	} catch(error) {
		next(error);
	}
}

export async function logout(req: Request, res: Response, next: NextFunction) {
	try {

	} catch(error) {
		next(error);
	}
}

export async function notLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
        
	} catch (error) {
        
	}
}

export function checkRole(req: Request, res: Response, next: NextFunction) {
	const user = req.user;
	if(user.admin == false){
		return next(new NotAuthorizedError("Acesso restrito a administradores!"));
	}
	next();
}