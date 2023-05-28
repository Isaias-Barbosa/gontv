import ReactPlayer from 'react-player';

export default function SinglePlay({ episode }) {

    const { title, duration, videoUrl } = episode;

  return (
    <div className="bg-gray-900">
      <main className="container mx-auto py-8">
        <div className="my-8">
          <h3 className="text-2xl text-white font-bold mb-4">Episódio: {title}</h3>
          <div className="flex justify-center">
            <ReactPlayer url={videoUrl} controls width="800px" height="450px" />
          </div>
          <p className="text-white">Duração: {duration}</p>
        </div>
      </main>
    </div>
  )
}
