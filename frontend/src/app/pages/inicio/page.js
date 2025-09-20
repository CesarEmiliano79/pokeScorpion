import Navbar from '@/components/Navbar';
import React from 'react';
import "@/app/css/Inicio.css";

export default function Inicio() {
  const images = [
    '/pokemones/1.jpg',
    '/pokemones/2.avif',
    '/pokemones/3.jpg',
    '/pokemones/4.jpg',
    '/pokemones/5.webp',
    '/pokemones/6.jpg',
    '/pokemones/7.jpg',
    '/pokemones/8.webp',
    '/pokemones/9.png',
  ];

  // Función para mezclar aleatoriamente un array
  const shuffleArray = (arr) => {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // Creacion del array de imagenes
  const loopImages = [];
  for (let i = 0; i < 10; i++) loopImages.push(...images);

  const track1 = shuffleArray(loopImages);
  const track2 = shuffleArray(loopImages);
  const track3 = shuffleArray(loopImages);
  const track4 = shuffleArray(loopImages);
  const track5 = shuffleArray(loopImages);
  return (
    <>
      <Navbar />
      <div className="inicio-container">
        <div className="masonry-slider">
          <div className="masonry-track">
            {track1.map((img, index) => (
              <div className="masonry-item" key={index}>
                <img src={img} alt={`Imagen ${index}`} />
              </div>
            ))}
          </div>
          <div className="masonry-track2">
            {track2.map((img, index) => (
              <div className="masonry-item" key={index}>
                <img src={img} alt={`Imagen ${index}`} />
              </div>
            ))}
          </div>
          <div className="masonry-track3">
            {track3.map((img, index) => (
              <div className="masonry-item" key={index}>
                <img src={img} alt={`Imagen ${index}`} />
              </div>
            ))}
          </div>
          <div className="masonry-track4">
            {track4.map((img, index) => (
              <div className="masonry-item" key={index}>
                <img src={img} alt={`Imagen ${index}`} />
              </div>
            ))}
          </div>
          <div className="masonry-track5">
            {track5.map((img, index) => (
              <div className="masonry-item" key={index}>
                <img src={img} alt={`Imagen ${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="inicio-text text-white">
          <h1>Descubre lo que pokeScorpion tiene para ti!</h1>
        </div>
      </div>
    </>
  );
}
