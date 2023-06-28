import AnimeForm from 'components/AnimeForm.js'
import React from 'react'

export default function AnimePage() {
  return (
    <div className="container h-min mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Pagina para pegar os animes da API</h1>
      <AnimeForm/>
    </div>
  )
}
