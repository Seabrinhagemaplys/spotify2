import MusicServices from "./musicServices";
import { prismaMock } from "../../../../config/singleton";
import { QueryError } from "../../../../errors/errors/QueryError";
import { InvalidParamError } from "../../../../errors/errors/InvalidParamError";

describe("MusicServices", () => {
  test("should create a new music", async () => {
    const mockMusic = {
      ID_Musica: 1,
      nome: "Song Name",
      genero: "Rock",
      ID_Artista: 10,
      album: "Album Name",
    };

    prismaMock.musica.create.mockResolvedValue(mockMusic);

    await expect(
      MusicServices.createMusic("Song Name", "Rock", 10, "Album Name")
    ).resolves.toEqual(mockMusic);
  });

  test("should fail to create a music without required fields", async () => {
    await expect(MusicServices.createMusic("", "Rock", 10, "Album Name"))
      .rejects.toThrow(InvalidParamError);
    await expect(MusicServices.createMusic("Song Name", "", 10, "Album Name"))
      .rejects.toThrow(InvalidParamError);
    await expect(MusicServices.createMusic("Song Name", "Rock", null as any, "Album Name"))
      .rejects.toThrow(InvalidParamError);
  });

  test("should get a music by ID", async () => {
    const mockMusic = {
      ID_Musica: 1,
      nome: "Song Name",
      genero: "Rock",
      ID_Artista: 10,
      album: "Album Name",
      artista: { ID_Artista: 10, nome: "Artist Name" },
    };

    prismaMock.musica.findUnique.mockResolvedValue(mockMusic);

    await expect(MusicServices.getMusicById(1)).resolves.toEqual(mockMusic);
  });

  test("should return an error if music ID is invalid", async () => {
    await expect(
      MusicServices.getMusicById("invalid_id" as unknown as number)
    ).rejects.toThrow(InvalidParamError);
  });

  test("should return all music", async () => {
    const mockMusicas = [
      { ID_Musica: 1, nome: "Song 1", genero: "Pop", ID_Artista: 5, album: "Album 1" },
      { ID_Musica: 2, nome: "Song 2", genero: "Rock", ID_Artista: 6, album: "Album 2" },
    ];

    prismaMock.musica.findMany.mockResolvedValue(mockMusicas);

    await expect(MusicServices.getAllMusic()).resolves.toEqual(mockMusicas);
  });

  test("should return empty array if no music is found", async () => {
    prismaMock.musica.findMany.mockResolvedValue([]);

    await expect(MusicServices.getAllMusic()).resolves.toEqual([]);
  });

  test("should update a music", async () => {
    const updatedMusic = {
      ID_Musica: 1,
      nome: "New Song Name",
      genero: "Rock",
      ID_Artista: 10,
      album: "New Album Name",
    };

    prismaMock.musica.findUnique.mockResolvedValue(updatedMusic);
    prismaMock.musica.update.mockResolvedValue(updatedMusic);

    await expect(
      MusicServices.updateMusica(1, {
        nome: "New Song Name",
        album: "New Album Name",
      })
    ).resolves.toEqual(updatedMusic);
  });

  test("should return an error when updating a non-existing music", async () => {
    prismaMock.musica.findUnique.mockResolvedValue(null);
    prismaMock.musica.update.mockRejectedValue(new QueryError("Music not found"));

    await expect(
      MusicServices.updateMusica(999, { nome: "Non-existent Song", album: "Unknown Album" })
    ).rejects.toThrow(QueryError);
  });

  test("should delete a music", async () => {
    prismaMock.musica.findUnique.mockResolvedValue({ 
      ID_Musica: 1, 
      nome: "Song Name", 
      genero: "Rock", 
      ID_Artista: 10, 
      album: "Album Name" 
    });
    prismaMock.musica.delete.mockResolvedValue({ 
      ID_Musica: 1, 
      nome: "Song Name", 
      genero: "Rock", 
      ID_Artista: 10, 
      album: "Album Name" 
    });

    await expect(MusicServices.deleteMusica(1)).resolves.toBeUndefined();
  });

  test("should return an error when deleting a non-existing music", async () => {
    prismaMock.musica.findUnique.mockResolvedValue(null);
    prismaMock.musica.delete.mockRejectedValue(new QueryError("Music not found"));

    await expect(MusicServices.deleteMusica(999)).rejects.toThrow(QueryError);
  });
});
