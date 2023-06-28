import React, { useState } from 'react';

export default function AnimeForm() {
    const [animeId, setAnimeId] = useState('');
    const [animeData, setAnimeData] = useState(null);
    const [error, setError] = useState(null);
    const [isAnimeRegistered, setIsAnimeRegistered] = useState(false);

    const handleChange = (e) => {
        setAnimeId(e.target.value);
    };

    const fetchAnimeData = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
            if (response.ok) {
                const data = await response.json();
                setAnimeData(data);
                setError(null);
              } else {
                setError('ID do anime não encontrado.');
                setAnimeData(null);
            } 
        } catch (error) {
            console.error('Erro ao obter dados do anime:', error);
            setError('Ocorreu um erro ao obter os dados do anime.');
            setAnimeData(null);
        }
    };


    const handleRegister = async () => {
        if (!animeData) {
            setError('Nenhum anime selecionado para cadastrar.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/animes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(animeData),
            });

            if (response.ok) {
                setIsAnimeRegistered(true);
                console.log('Anime cadastrado com sucesso!');
                setAnimeId('');
                setAnimeData(null);
                setError(null);
            } else {
                console.error('Erro ao cadastrar o anime:', response.status);
                setError('Ocorreu um erro ao cadastrar o anime.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar o anime:', error);
            setError('Ocorreu um erro ao cadastrar o anime.');
        }
    };
    console.log(animeData)
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Detalhes do Anime</h1>
            <div className="flex mb-4 justify-center">
                <input
                    type="text"
                    placeholder="Informe o ID do anime"
                    className="border rounded-l px-4 py-2 w-64"
                    value={animeId}
                    onChange={handleChange}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                    onClick={fetchAnimeData}
                >
                    Gerar
                </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {animeData && (
               
                <div className="flex justify-center my-2 flex-col items-center">
                 <p className="text-md font-bold text-rose-500 text-center">Anime:
                 </p><h2 className="text-lg font-bold mb-2 text-center">{animeData.data.title}</h2>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 w-40 rounded-md"
                        onClick={handleRegister}
                    >
                       Cadastrar
                    </button>
                </div>
            )}
            {isAnimeRegistered && (
                <p className="text-green-500 mt-4 text-center">Anime cadastrado com sucesso!</p>
            )}
        </div>
    );
}
