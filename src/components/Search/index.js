import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';


export default function Search() {

  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchValue.trim() !== '') {
      // Redirecionar para a página de resultados
      navigate(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSendClick = () => {
    if (searchValue.trim() !== '') {
      // Redirecionar para a página de resultados
      navigate(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };



  const [searchSize, setSearchSize] = useState('64');

  return (
    <div className="flex items-center ms-7 border-b-2 bg-black-light rounded-lg justify-center">
      <input
        type="search"
        placeholder="Pesquisar"
        className={`bg-transparent items-center text-white px-1 py-1 rounded-lg focus:outline-none w-${searchSize} sm:w-32 md:w-48 lg:w-56 xl:w-80 2xl:w-96`}
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
      <a className="text-white border bg-gray-900 rounded-md w-12 text-center mx-3" href="#">
        Filtro
      </a>

    </div>
  );
};
