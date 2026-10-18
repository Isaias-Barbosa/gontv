import React from 'react'
import { MdPlayCircleFilled } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function CardAnime({ anime }) {


    function generateSlug(title) {
        return title
        .toLowerCase()
        .replace(/[^a-z0-9.+\s-]+/g, '')  // Remove caracteres especiais, mas mantém ponto e +
        .replace(/\+/g, '-')              // Substitui + por hífen
        .replace(/\s+/g, '-')              // Substitui espaços por hífen
        .replace(/-+/g, '-')               // Remove hífens consecutivos
        .trim();                         // Remove espaços no início e fim
    }



    const MAX_TITLE_LENGTH = 15; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title?.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };
    return (
        <div className="aspect-ratio-box" >
            <div className="relative">
                <Link
                    to={`/animes/${anime.slug || generateSlug(anime.title)}`}
                    state={{ animeId: anime.id }}
                >


                    <div className="anime-cover">
                        <img
                            src={anime.coverImage}
                            alt={anime.title}
                            className="object-cover custom-height"
                        />
                        <div className="overlay"></div>
                        <button className="play-button">
                            <MdPlayCircleFilled className="text-white text-5xl" />
                        </button>
                    </div>
                </Link>
                <h3 className="text-lg text-white text-center mb-3 px-2 font-semibold">{truncateTitle(anime.title)}</h3>
            </div>
        </div>
    )
}
