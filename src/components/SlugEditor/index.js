import React, { useState } from 'react';

export default function SlugEditor({ onUpdateSlug }) {
    const [title, setTitle] = useState('');
    const [animeId, setAnimeId] = useState('');
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };
  
    const handleAnimeIdChange = (event) => {
      setAnimeId(event.target.value);
    };
  
    const handleUpdateSlug = () => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      onUpdateSlug(animeId, slug); // Atualiza o slug e o ID do anime
      setTitle('');
      setAnimeId('');
    };

  return (
    <div className="h-screen text-lg text-center py-5 ">
        <input
        type="text"
        placeholder="Digite o ID do anime"
        value={animeId}
        onChange={handleAnimeIdChange}
        className="border border-gray-900 rounded-lg text-emerald-400"
      />
       <input
        type="text"
        placeholder="Digite o título do anime"
        value={title}
        onChange={handleTitleChange}
        className="border border-gray-900 rounded-lg text-emerald-400"
      />
      <button className="text-emerald-400" onClick={handleUpdateSlug}>Adicionar Slug</button>
    </div>
  )
}
