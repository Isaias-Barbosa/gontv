
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Episodio from 'components/Episodio';


import { usePublicAnimes } from 'context/AnimeCatalogContext';

export default function SinglePlayPage() {
  const animeData = usePublicAnimes();
  const { slug, titleSlug, languageEpisode } = useParams();
  const anime = animeData.find((anime) => anime.slug === slug);

  if (!anime || !anime.episodes || anime.episodes.length === 0) {
    return <div>Anime não encontrado ou sem episódios</div>;
  }

  const episode = anime.episodes.find(
    (episode) => episode.titleSlug === titleSlug && episode.languageEpisode === languageEpisode
  );

  if (!episode) {
    return <div>Episódio não encontrado</div>;
  }

  const pageTitle = ` Gon.TV - Assistir ${anime.title} - ${anime.language} - ${episode.titleEpisodio} - Online em FHD `;
  

  return <>
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet><Episodio
      anime={anime}
      episodio={episode}
      slug={slug}
      titleSlug={titleSlug}
      languageEpisode={languageEpisode} />
  </>
}


  /*

  const { animeSlug, titleSlug, languageEpisode } = useParams();
  const [episode, setEpisode] = useState(null);
  const navigate = useNavigate();
  const episodeId = useSelector((state) => state.episodeId);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        console.log('Iniciando busca por detalhes do anime');

        const response = await fetch(`https://animes.vision/api/v2/search?ordenar=adicionado_recentemente`);
        if (!response.ok) {
          throw new Error('Erro ao buscar a lista de releases');
        }

        const data = await response.json();
        console.log('Dados recebidos da API:', data);

        const allAnimes = Object.values(data).flat();
        console.log('Todos os animes:', allAnimes);

        const anime = allAnimes.find((item) => generateSlug(item.title) === animeSlug);

        if (!anime) {
          console.error('Anime não encontrado');
          return;
        }

        const animeId = anime.id;

        // Agora, buscamos os detalhes do episódio com base no ID do anime
        const animeDetailsResponse = await fetch(`https://animes.vision/api/v2/post/${animeId}`);
        if (!animeDetailsResponse.ok) {
          console.error(`Erro ao obter dados do anime: ${animeDetailsResponse.status} ${animeDetailsResponse.statusText}`);
          return;
        }

        const animeDetailsData = await animeDetailsResponse.json();

        if (!animeDetailsData || !animeDetailsData.data) {
          console.error('Dados do anime não encontrados');
          return;
        }

        console.log(animeDetailsData)
        // Aqui, você precisará ajustar a lógica para encontrar o episódio desejado no array de episódios
        const foundEpisode = animeDetailsData.data.episodes.find((ep) =>
          ep.title.toLowerCase().includes(titleSlug.replace('episodio-', '').toLowerCase())
        );



        if (!foundEpisode) {
          console.error('Episódio não encontrado');
          return;
        }

        // Agora, buscamos os detalhes do episódio com base no ID do episódio
        const episodeId = foundEpisode.id;

        const episodeResponse = await fetch(`https://animes.vision/api/v2/episode/${episodeId}`);

        if (!episodeResponse.ok) {
          console.error(`Erro ao obter dados do episódio: ${episodeResponse.status} ${episodeResponse.statusText}`);
          return;
        }

        const episodeData = await episodeResponse.json();

        if (!episodeData || !episodeData.data) {
          console.error('Dados do episódio não encontrados');
          return;
        }

        // Certifique-se de que há episódios antes de tentar encontrar
        if (episodeData.data.length === 0) {
          console.error('Nenhum episódio encontrado para o anime especificado');
          return;
        }

        // Aqui, você pode adicionar a lógica necessária para manipular os detalhes do episódio (episodeData.data)
            // por exemplo, você pode definir o episódio no estado ou executar outras operações com esses dados.
      setEpisode(episodeData.data);

        
      } catch (error) {
        console.error('Erro ao obter dados do episódio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisode();
  }, [animeSlug, titleSlug, languageEpisode, episodeId]);

  console.log(animeSlug)


  console.log('Episódio:', episode);

  const handleNextClick = async () => {
    // Verificar se o episódio atual é carregado
    if (!episode) {
      console.error('Episódio atual não carregado');
      return;
    }

    // Verificar se há informações de controle
    if (!episode.control || !episode.control.next) {
      console.error('Informações de controle do próximo episódio não encontradas');
      return;
    }

    // Navegar para o próximo episódio
    navigate(`/animes/${animeSlug}/${episode.control.next.title.replace(/\s+/g, '-').toLowerCase()}/${languageEpisode}`, { state: { episodeId: episode.control.next.id } });
  };

  const handlePrevClick = async () => {
    // Verificar se o episódio atual é carregado
    if (!episode) {
      console.error('Episódio atual não carregado');
      return;
    }

    // Verificar se há informações de controle
    if (!episode.control || !episode.control.prev) {
      console.error('Informações de controle do episódio anterior não encontradas');
      return;
    }

    // Navegar para o episódio anterior
    navigate(`/animes/${animeSlug}/${episode.control.prev.title.replace(/\s+/g, '-').toLowerCase()}/${languageEpisode}`, { state: { episodeId: episode.control.prev.id } });

  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black-dark flex justify-start flex-col">
        <LinearProgress />
      </div>
    );
  }

  if (!episode) {
    return <div>Carregando...</div>;
  }

  const pageTitle = ` Gon.TV - Assistir ${animeSlug.toUpperCase()} - ${episode?.title.toUpperCase()} - Online em FHD `;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Episodio
        anime={episode}
        episodio={episode}
        animeSlug={animeSlug}
        titleSlug={titleSlug}
        languageEpisode={languageEpisode}
        onNextClick={handleNextClick}
        onPrevClick={handlePrevClick} />
    </>
  );
}

function generateSlug(title) {
  if (!title) {
    return '';
  }

  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

*/