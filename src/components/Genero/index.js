import React from 'react'
import { Link } from 'react-router-dom'

export default function Genero({genero}) {
  return (
    <Link to={`/search-genero/${genero}`} className="genre-tag hover:text-slate-900">
        {genero}
    </Link>
  )
}
