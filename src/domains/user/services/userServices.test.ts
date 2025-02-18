import userServices from "./userServices";
import { prismaMock } from "../../../../config/singleton";
import { QueryError } from "../../../../errors/errors/QueryError";
import { NotAuthorizedError } from "../../../../errors/errors/NotAuthorizedError";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";

describe('createUser', () => {
    test('should create a new user', async () => {
        const user = {
            ID_Usuario: 1,
            nome: 'user teste',
            email: 'user@test.com',
            senha: 'teste123',
            foto: null,
            admin: false,
        };
        const encrypted = await userServices.encryptPassword(user.senha);  
        prismaMock.usuario.findUnique.mockResolvedValue(null);
        prismaMock.usuario.create.mockResolvedValue({
            ...user,
            senha: encrypted,
        });
        await expect(userServices.createUser(user, { 
            ID_Usuario: 999,
            nome: "admin",
            email: "user@admin.com",
            senha: "admin123",
            foto: null,
            admin: true 
        })).resolves.toEqual(
            expect.objectContaining({
                nome: 'user teste',
                email: 'user@test.com',
                admin: false,
            })
        );
    });
    test('should not create a user if email already exists', async () => {
        const user = {
            ID_Usuario: 2,
            nome: 'user teste',
            email: 'user@test.com',
            senha: 'teste123',
            foto: null,
            admin: false,
        };
        prismaMock.usuario.findUnique.mockResolvedValue(user);
        await expect(userServices.createUser(user, {
            ID_Usuario: 999,
            nome: "admin",
            email: "user@admin.com",
            senha: "admin123",
            foto: null,
            admin: true 
        })).rejects.toThrow(QueryError);
    });
    test('normal user should not create admin user', async() => {
        const user = {
            ID_Usuario: 3,
            nome: 'user teste',
            email: 'normaluser@test.com',
            senha: 'teste123',
            foto: null,
            admin: true,
        };
        prismaMock.usuario.findUnique.mockResolvedValue(null);
        await expect(userServices.createUser(user, {
                ID_Usuario: 111,
                nome: 'normal user',
                email: 'not_admin@test.com',
                senha: 'notadmin123',
                foto: null,
                admin: false,
        })).rejects.toThrow(NotAuthorizedError);
    });
    test('should fail if name is not provided', async () => {
        const user = {
            ID_Usuario: 4,
            nome: '',
            email: 'no_name@test.com',
            senha: 'no_name123',
            foto: null,
            admin: false,
        };
        await expect(userServices.createUser(user, {
            
                ID_Usuario: 999,
                nome: 'admin',
                email: 'admin@test.com',
                senha: 'admin123',
                foto: null,
                admin: true
        })).rejects.toThrow(InvalidParamError);
    });
    test('should fail if password is less than 6 characters', async () => {
        const user = {
            ID_Usuario: 5,
            nome: 'passwrd test',
            email: 'passwrd@test.com',
            senha: '123',
            foto: null,
            admin: false,
        };
        await expect(userServices.createUser(user, {
                ID_Usuario: 999,
                nome: 'admin',
                email: 'admin@test.com',
                senha: 'teste123',
                foto: null,
                admin: true
        })).rejects.toThrow(InvalidParamError);
    });
});

describe('getUserById', () => {
    test('should retrieve a user by ID', async () => {
        const user = {
            ID_Usuario: 1,
            nome: 'user teste',
            email: 'user@test.com',
            senha: 'senha123',
            foto: null,
            admin: false,
            musicas: [],
        };
        prismaMock.usuario.findUnique.mockResolvedValue(user);
        await expect(userServices.getUserById(1)).resolves.toEqual(
            expect.objectContaining({
                ID_Usuario: 1,
                email: 'user@test.com',
            })
        );
    });
    test('should return an error if user cant be found by ID', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null);
        await expect(userServices.getUserById(123)).rejects.toThrow(QueryError);
    });
});

describe('getAllUsers', () => {
    test('should retrieve all users', async () => {
        const users = [{
            ID_Usuario: 1,
            nome: 'user teste',
            email: 'user@test.com',
            senha: 'teste123',
            foto: null,
            admin: false,
        }];
        prismaMock.usuario.findMany.mockResolvedValue(users);
        await expect(userServices.getAllUsers()).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: 'user@test.com' 
                }),
            ])
        );
    });
});

describe('updateUser', () => {
    test('should update user successfully', async () => {
        const user = {
            ID_Usuario: 1,
            nome: 'Will B. Updated',
            email: 'user@update.com',
            senha: 'senha123',
            foto: null,
            admin: false,
        };
        const updatedUser = {
            ...user,
            nome: 'Updated',
        };
        prismaMock.usuario.findUnique.mockResolvedValue(user);
        prismaMock.usuario.update.mockResolvedValue(updatedUser);
        await expect(userServices.updateUser(1, { nome: 'Updated'},
            {
                ID_Usuario: 999,
                nome: 'admin',
                email: 'admin@update.com',
                senha: 'senha123',
                foto: null,
                admin: true,
            }
        )).resolves.toEqual(expect.objectContaining({
            nome: 'Updated'
        }));
    });
    test('should not allow changing user ID', async () => {
        const user = {
            ID_Usuario: 1,
            nome: 'user',
            email: 'user@test.com',
            senha: 'senha123',
            foto: null,
            admin: false,
        };
        prismaMock.usuario.findUnique.mockResolvedValue(user);
        await expect(userServices.updateUser(1, {
            ID_Usuario: 99
        }, {
            ID_Usuario: 1,
            nome: 'user',
            email: 'user@test.com',
            senha: 'senha123',
            foto: null,
            admin: false,
        })).rejects.toThrow(NotAuthorizedError);
    });
    test('should not allow non-admin to change admin status', async () => {
        const user = {
            ID_Usuario: 1,
            nome: 'user',
            email: 'user@test.com',
            senha: 'senha123',
            foto: null,
            admin: false,
        }
        prismaMock.usuario.findUnique.mockResolvedValue(user);
        await expect(userServices.updateUser(1, { admin: true }, {
            ID_Usuario: 1,
            nome: 'user',
            email: 'user@test.com',
            senha: 'senha123',
            foto: null,
            admin: false,
        })).rejects.toThrow(NotAuthorizedError);
    });
    test('should throw error if user not found', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null);
        await expect(userServices.updateUser(212, { nome: 'not found'}, {
            ID_Usuario: 999,
            nome: 'admin',
            email: 'admin@test.com',
            senha: 'admin123',
            foto: null,
            admin: true,
        })).rejects.toThrow(QueryError);
    });
});