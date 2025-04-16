'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function HeroBanner({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const featuredMovies = movies?.slice(0, 5) || [];
  
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [featuredMovies.length]);
  
  if (featuredMovies.length === 0) return null;
  
  const currentMovie = featuredMovies[currentIndex];
  
  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Arrière-plan 3D */}
      <div className="absolute inset-0 bg-black">
        <Canvas>
          <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>
      
      {/* Image de film */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentMovie.backdrop_path && (
          <div className="relative h-full w-full">
            <Image
              src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
              alt={currentMovie.title}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
          </div>
        )}
      </div>
      
      {/* Contenu */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 pt-20">
          <h1 
            className={`text-5xl md:text-7xl font-bold mb-4 text-white max-w-3xl transition-all duration-700 ${
              isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentMovie.title}
          </h1>
          <p 
            className={`text-xl text-gray-300 max-w-2xl mb-8 transition-all duration-700 delay-200 ${
              isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentMovie.overview?.substring(0, 200)}
            {currentMovie.overview?.length > 200 ? '...' : ''}
          </p>
          <button 
            className={`px-8 py-3 bg-red-600 text-white rounded-md text-lg font-medium transition-all duration-300 hover:bg-red-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
              isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0 delay-300'
            }`}
          >
            Voir le film
          </button>
        </div>
      </div>
      
      {/* Indicateurs */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-red-600 w-10' : 'bg-gray-500 bg-opacity-50 hover:bg-gray-400'
            }`}
            aria-label={`Voir le film ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 