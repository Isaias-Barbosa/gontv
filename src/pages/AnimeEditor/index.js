import SlugEditor from 'components/SlugEditor';
import React from 'react'
import axios from 'axios';


export default function AnimesEditor() {

    // Função para obter o ID do anime com base no título
  const getAnimeId = (title) => {
    return axios
      .get(`http://localhost:3001/animes?title=${encodeURIComponent(title)}`)
      .then((response) => {
        if (response.data.length > 0) {
          return response.data[0].id; // Retorna o ID do primeiro anime encontrado
        } else {
          throw new Error('Anime não encontrado');
        }
      })
      .catch((error) => {
        console.error('Ocorreu um erro ao obter o ID do anime', error);
      });
  };


  // Função para atualizar o campo "slug" no JSON Server
  const updateSlug = (animeId, slug) => {
    axios
      .patch(`http://localhost:3001/animes/${animeId}`, { slug })
      .then((response) => {
        console.log(`Campo "slug" atualizado para "${slug}" no anime ${animeId}`);
      })
      .catch((error) => {
        console.error('Ocorreu um erro ao atualizar o campo "slug"', error);
      });
  };

  const handleUpdateSlug = (animeId, title) => {
    getAnimeId(title)
      .then(() => {
        console.log('ID do anime:', animeId);
        updateSlug(animeId, title.toLowerCase().replace(/[^a-z0-9]+/g, '-')); // Atualiza o slug com base no título
      })
      .catch((error) => {
        console.error('Ocorreu um erro', error);
      });
  };

  return (
    <div className="text-lg text-center">
      <h2>Editor de Anime</h2>
      <SlugEditor onUpdateSlug={handleUpdateSlug} />
    </div>
  )
}
