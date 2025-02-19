-- CreateTable
CREATE TABLE "Usuario" (
    "ID_Usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "foto" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Artista" (
    "ID_Artista" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "foto" TEXT,
    "numero_streams" INTEGER
);

-- CreateTable
CREATE TABLE "Musica" (
    "ID_Musica" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "album" TEXT,
    "ID_Artista" INTEGER NOT NULL,
    CONSTRAINT "Musica_ID_Artista_fkey" FOREIGN KEY ("ID_Artista") REFERENCES "Artista" ("ID_Artista") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Usuarios_Musicas" (
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Musica" INTEGER NOT NULL,

    PRIMARY KEY ("ID_Usuario", "ID_Musica"),
    CONSTRAINT "Usuarios_Musicas_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Usuarios_Musicas_ID_Musica_fkey" FOREIGN KEY ("ID_Musica") REFERENCES "Musica" ("ID_Musica") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
