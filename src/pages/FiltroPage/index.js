import Filtro from 'components/Filtro';
import React, { useEffect, useState } from 'react';
import animesData from 'json/animes.json';

export default function FiltroPage() {
    const [animes, setAnimes] = useState([]);
    const [filtro, setFiltro] = useState({
        tipo: '',
        tipoAnime: '',
        genero: '',
        estudio: '',
        diretor: '',
        ano: '',
        temporada: '',
        fansub: '',
        status: '',
    });

    const handleFiltroChange = (event) => {
        const { name, value } = event.target;
        setFiltro((prevFiltro) => ({ ...prevFiltro, [name]: value }));
    };

    // Aplicar os filtros e retornar os animes filtrados
    const filtrarAnimes = () => {
        let animesFiltrados = [...animes];

        // Aplicar filtros
        if (filtro.tipo) {
            animesFiltrados = animesFiltrados.filter((anime) => anime.Type === filtro.tipo);
        }
        if (filtro.tipoAnime) {
            animesFiltrados = animesFiltrados.filter((anime) => anime.title === filtro.tipoAnime);
        }
        if (filtro.genero) {
            animesFiltrados = animesFiltrados.filter((anime) => anime.genres.includes(filtro.genero));
        }
        // Adicionar mais filtros aqui...

        return animesFiltrados;
    };


    const animesFiltrados = filtrarAnimes();

    useEffect(() => {
        // Carregar os dados do arquivo animes.json
        const fetchData = async () => {
            try {
                setAnimes(animesData);
            } catch (error) {
                console.error('Erro ao carregar os dados dos animes:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Página de Filtro</h1>
            <Filtro
        tipos={animesData.tipos}
        tipoAnimes={animesData.tipoAnimes}
        generos={animesData.generos}
        estudios={animesData.estudios}
        diretores={animesData.diretores}
        anos={animesData.anos}
        temporadas={animesData.temporadas}
        fansubs={animesData.fansubs}
        status={animesData.status}
        filtro={filtro}
        onFiltroChange={handleFiltroChange}
      />
            <div>
                {animesFiltrados.length > 0 ? (
                    animesFiltrados.map((anime) => (
                        <div key={anime.id}>
                            <h2>{anime.title}</h2>
                            {/* Exibir outras informações do anime aqui */}
                        </div>
                    ))
                ) : (
                    <p>Nenhum anime encontrado com os filtros selecionados.</p>
                )}
            </div>
        </div>
 
  );
};
