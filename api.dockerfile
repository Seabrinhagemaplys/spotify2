# Usar a imagem base do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Definir a porta que a aplicação utilizará
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start"]
