import React from 'react'

export default function Player({ title, videoUrl }) {
  return (
    <div>
      <h3>{title}</h3>
      <video controls>
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    </div>
  )
}
