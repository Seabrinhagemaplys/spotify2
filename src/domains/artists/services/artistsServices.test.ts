import artistsServices from "./artistsServices";
import { prismaMock } from "../../../../config/singleton";
import { QueryError } from "../../../../errors/errors/QueryError";

describe('createArtist', () => {
    test('should create a new artist', async () => {  
      const artista = {  
        ID_Artista: 1,  
        nome: 'Novo Artista',  
        foto: 'url_da_foto',  
        numero_streams: 100,  
      };  
  
      prismaMock.artista.create.mockResolvedValue(artista);  
  
      const result = await artistsServices.createArtist(  
        'Novo Artista',  
        'url_da_foto',  
        100  
      );  
  
      expect(result).toEqual(artista);  
    });
    
    test('should throw an error if the artist creation fails', async () => {
        prismaMock.artista.create.mockRejectedValue(new Error('Erro no Banco de Dados'));
      
        await expect(artistsServices.createArtist('Novo Artista', 'url_da_foto', 100)).rejects.toThrow('Não foi possível criar o artista!');
      });
  });

describe('getArtistById', () => {
    test('should get an artist by ID', async () => {
        const artista = {
          ID_Artista: 1,
          nome: 'Artista Teste',
          foto: 'url_da_foto',
          numero_streams: 100,
        };
      
        prismaMock.artista.findUnique.mockResolvedValue(artista);
      
        const result = await artistsServices.getArtistById(1);
      
        expect(result).toEqual(artista);
      });
      
      test('should throw an error if id artist is not found', async () => {
        prismaMock.artista.findUnique.mockResolvedValue(null);
      
        await expect(artistsServices.getArtistById(999)).rejects.toThrow(QueryError);
      });    
});

describe('getAllArtists', () => {
    test('should return all artists', async () => {
        const artistas = [
          {
            ID_Artista: 1,
            nome: 'Artista 1',
            foto: 'url_foto_1',
            numero_streams: 42,
          },
          {
            ID_Artista: 2,
            nome: 'Artista 2',
            foto: 'url_foto_2',
            numero_streams: 21,
          },
        ];
      
        prismaMock.artista.findMany.mockResolvedValue(artistas);
      
        const result = await artistsServices.getAllArtists();
      
        expect(result).toEqual(artistas);
      });

      test('should return artists in alphabetical order', async () => {
        const mockArtists = [
            { ID_Artista: 1, nome: 'Antonio', foto: 'url_foto_1', numero_streams: 50 },
            { ID_Artista: 2, nome: 'Bianca', foto: 'url_foto_2', numero_streams: 30 },
            { ID_Artista: 3, nome: 'Carlos', foto: 'url_foto_3', numero_streams: 10 },
        ];
    
        prismaMock.artista.findMany.mockResolvedValue([...mockArtists].sort((a, b) => a.nome.localeCompare(b.nome)));
    
        const result = await artistsServices.getAllArtists();
    
        const nomes = result.map((artista) => artista.nome);
    
        expect(nomes).toEqual(['Antonio', 'Bianca', 'Carlos']);
    });
    
    
      
      test('should throw an error if artist search fails', async () => {
        prismaMock.artista.findMany.mockRejectedValue(new Error('Erro no Banco de Dados'));
      
        await expect(artistsServices.getAllArtists()).rejects.toThrow('Não foi possível buscar os artistas!');
      });
});

describe('deleteArtista', () => {
    test('should delete an artist successfully', async () => {
        const artista = {
          ID_Artista: 1,
          nome: 'Artista Teste',
          foto: 'url_foto',
          numero_streams: 66,
        };
      
        prismaMock.artista.findUnique.mockResolvedValue(artista);
        prismaMock.artista.delete.mockResolvedValue(artista);
      
        await expect(artistsServices.deleteArtista(1)).resolves.toBeUndefined();

      });
      
      test('should throw an error if ID artist does not exist in database', async () => {
        prismaMock.artista.findUnique.mockResolvedValue(null);
      
        await expect(artistsServices.deleteArtista(1)).rejects.toThrow(QueryError);
      });
      
      
      test('should throw an error if artist deletion fails', async () => {
        const artista = {
          ID_Artista: 1,
          nome: 'Artista de Teste',
          foto: 'url_foto',
          numero_streams: 100,
        };
      
        prismaMock.artista.findUnique.mockResolvedValue(artista);
        prismaMock.artista.delete.mockRejectedValue(new Error('Database Error'));
      
        await expect(artistsServices.deleteArtista(1)).rejects.toThrow('Não foi possível deletar o artista.');
      });
});

describe('updateArtista', () =>{
    test('should throw an error if artist not found', async () => {
        prismaMock.artista.findUnique.mockResolvedValue(null);
      
        const updatedArtista = {
          nome: 'Novo Nome',
          foto: 'nova_url_foto',
          numero_streams: 200,
        };
      
        await expect(artistsServices.updateArtista(1, updatedArtista)).rejects.toThrow(QueryError);
      });
      
      test('should update an artist successfully', async () => {
        const artista = {
          ID_Artista: 1,
          nome: 'Artista Teste',
          foto: 'url_foto_antiga',
          numero_streams: 10,
        };
      
        const updatedArtista = {
          ID_Artista: 1,
          nome: 'Artista Teste 2',
          foto: 'url_foto_atualizado',
          numero_streams: 12,
        };
      
        prismaMock.artista.findUnique.mockResolvedValue(artista);
        prismaMock.artista.update.mockResolvedValue(updatedArtista);
      
        const result = await artistsServices.updateArtista(1, updatedArtista);
      
        expect(result).toEqual({
          ID_Artista: 1,
          nome: 'Artista Teste 2',
          foto: 'url_foto_atualizado',
          numero_streams: 12,
        });
      });  
});