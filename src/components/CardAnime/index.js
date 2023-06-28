import React from 'react'
import { MdPlayCircleFilled } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function CardAnime({anime}) {
    
    const MAX_TITLE_LENGTH = 15; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title ?.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };
    return (
        <div className="aspect-ratio-box" >
            <div className="relative">
                <Link to={`/animes/${anime.slug}`} key={anime.id}>
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
