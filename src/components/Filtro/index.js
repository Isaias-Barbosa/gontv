import React, { useState } from 'react'

export default function Filtro({ options, filtro, setFiltro, onFiltroChange }) {
  try {
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      onFiltroChange({ ...filtro, [name]: value });
    };

    const handleGeneroClick = (genero) => {
      setFiltro((prevState) => {
        const { generos = [] } = prevState;
        const generosSelecionados = [...generos];

        if (generosSelecionados.includes(genero)) {
          const index = generosSelecionados.indexOf(genero);
          generosSelecionados.splice(index, 1);
        } else {
          generosSelecionados.push(genero);
        }

        return {
          ...prevState,
          generos: generosSelecionados,
        };
      });
    };


    return (
      <div className="p-8">
        <div className="flex flex-wrap justify-center mb-4">
          <div className="flex flex-col items-center mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-2/2">
            <label className="text-white mb-2 font-bold" htmlFor="tipo">
              Tipo:
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filtro.tipo}
              onChange={handleInputChange}
              className="rounded border p-1 text-gray-800 bg-white"
            >
              <option value="">Todos</option>
              {options.tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center  mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-2/2">
            <label className="block text-white mb-2 font-bold" htmlFor="language">
              Tipo do Anime:
            </label>
            <select
              id="language"
              name="language"
              value={filtro.language}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white"
            >
              <option value="">Todos</option>
              {options.language.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>


          <div className="flex flex-col items-center  mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-2/2">
            <label className="block text-white mb-2  font-bold" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filtro.status}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white "
            >
              <option value="">Todos</option>
              {options.status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>


          <div className="flex flex-col items-center  mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-3/2">
            <label className="block text-white mb-2 font-bold" htmlFor="estudio">
              Estúdios
            </label>
            <select
              id="estudio"
              name="estudio"
              value={filtro.estudio}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white w-36"
            >
              <option value="">Todos</option>
              {options.estudios.map((estudio) => (
                <option key={estudio} value={estudio}>
                  {estudio}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center  mx-1 my-2 sm:w-auto md:w-2/2 lg:w-2/2 ">
            <label className="block text-white mb-2 font-bold" htmlFor="diretor">
              Diretores
            </label>
            <select
              id="diretor"
              name="diretor"
              value={filtro.diretor}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white w-40"
            >
              <option value="">Todos</option>
              {options.diretores.map((diretor) => (
                <option key={diretor} value={diretor}>
                  {diretor}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center  mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-3/2">
            <label className="block text-white mb-2 font-bold" htmlFor="ano">
              Ano do Anime:
            </label>
            <select
              id="ano"
              name="ano"
              value={filtro.ano}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white"
            >
              <option value="">Todos</option>
              {options.anos.sort((a, b) => b - a).map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center  mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-3/2">
            <label className="block text-white mb-2 font-bold" htmlFor="temporada">
              Temporada:
            </label>
            <select
              id="temporada"
              name="temporada"
              value={filtro.temporada}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white"
            >
              <option value="">Todos</option>
              {options.temporadas.sort((a, b) => {
                const [seasonA, yearA] = a.split(" ");
                const [seasonB, yearB] = b.split(" ");

                const seasonsOrder = ["Winter", "Spring", "Summer", "Fall"];
                const seasonIndexA = seasonsOrder.indexOf(seasonA);
                const seasonIndexB = seasonsOrder.indexOf(seasonB);

                if (yearA !== yearB) {
                  return parseInt(yearB) - parseInt(yearA);
                } else {
                  return seasonIndexB - seasonIndexA;
                }
              }).map((temporada) => (
                <option key={temporada} value={temporada}>
                  {temporada}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center mb-6  mx-4 my-2 sm:w-auto md:w-2/2 lg:w-2/2 xl:w-3/2">
            <label className="block text-white mb-2 font-bold" htmlFor="fansub">
              Fansubs:
            </label>
            <select
              id="fansub"
              name="fansub"
              value={filtro.fansub}
              onChange={handleInputChange}
              className="border p-1 rounded text-gray-800 bg-white"
            >
              <option value="">Todos</option>
              {options.fansubs.map((fansub) => (
                <option key={fansub} value={fansub}>
                  {fansub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center mx-4 justify-center" >
            {options.generos.sort().map((genero) => (
              <button
                key={genero}
                className={`border p-1 rounded-sm mr-2 mb-2 ${filtro.generos ? filtro.generos.includes(genero) ? 'bg-gray-700 text-white' : 'bg-white text-gray-800' : 'bg-white text-gray-800'
                  } hover:text-blue-700`}
                onClick={() => handleGeneroClick(genero)}
              >
                {genero}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro no componente Filtro:', error);
    // Renderize uma mensagem de erro ou outra forma de lidar com o erro

    return (
      <div className="text-white text-center my-6">
        Ocorreu um erro ao exibir o componente Filtro. Atualize a página e os filtros voltam.
      </div>
    );
  }
}
