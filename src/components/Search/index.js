import React, { useState } from 'react';

export default function Search({ handleSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value); // Chama a função de pesquisa passando o termo de busca
  };

  return (
    <div className="flex items-center ms-7 border-b-2 bg-black-light rounded-lg justify-center">
      <input
        type="search"
        placeholder="Pesquisar"
        className="bg-transparent items-center text-white px-1 py-1 rounded-lg focus:outline-none w-searchSize sm:w-32 md:w-48 lg:w-56 xl:w-80 2xl:w-96"
        value={searchTerm}
        onChange={handleChange}
      />
      <a className="text-white border bg-gray-900 rounded-md w-12 text-center mx-3" href="#">
        Filtro
      </a>
    </div>
  );
};
