import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importe o estilo do carrossel
import { Carousel } from 'react-responsive-carousel'; // Importe o componente do carrossel

export default function Banner() {
    const carouselImages = [
      {
        id: 1,
        title: 'One Piece',
        genero: 'Ação',
        genero2: 'Super Poder',
        text: 'Era uma vez um grande pirata, conhecido como o maior pirata de todos os tempos, Gol D. Roger. Ele conseguiu fama, poder, dinheiro. Só que um dia ele foi capturado pelas forças da Marinha. ',
        image: 'https://cdn2.tfx.company/images/clickwallpapers-OnePiece-4k-img1.jpg',
      },
      {
        id: 2,
        title: 'Megami no Café Terrace',
        genero: 'Ação',
        genero2: 'Super Poder',
        text: 'A história acompanha Kasukabe Hayato, um jovem universitário que decide voltar para sua cidade natal ao descobrir que sua avó morreu. ',
        image: 'https://www.themoviedb.org/t/p/original/n01pg5coiHIVt9zdlPK6trBfBHv.jpg',
      },
      {
        id: 3,
        title: 'Kimetsu no Yaiba',
        genero: 'Ação',
        genero2: 'Super Poder',
        text: 'Desde os tempos antigos, abundam os rumores sobre demônios devoradores de homens à espreita na floresta. Por causa disso, os moradores locais nunca se aventuram externamente durante a noite.',
        image: 'https://www.themoviedb.org/t/p/original/5iilESGDr44JUO5as6KzejxkvJd.jpg',
      },
      ];

  return (

     <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          stopOnHover={false}
          showStatus={false}
          showArrows={true}
          arrowSize={74}   
        
        >
          {carouselImages.map((capa, index) => (
            <div key={index} className="relative">
              <div
            className="bg-cover bg-center w-full" style={{ backgroundImage: `url(${capa.image})`, height: '500px' }}
          >
        <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <h2 className="text-4xl font-bold mb-4">{capa.title}</h2>
            <p className="text-xl text-justify mb-2 p-4">{capa.text}</p>
            <button className="bg-emerald-400 text-black px-4 py-2 rounded-lg hover:bg-emerald-600 ">Assistir Agora</button>
          </div>
        </div>
      </div>
    ))}
  </Carousel>
  )
}
