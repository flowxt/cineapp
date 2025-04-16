'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const router = useRouter();
  
  // Vérifier si le film est déjà dans les favoris au chargement
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === movie.id));
  }, [movie.id]);
  
  // Effet 3D au survol
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    setIsHovered(false);
  };
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Retirer des favoris
      const newFavorites = favorites.filter(fav => fav.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      // Ajouter aux favoris
      favorites.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };
  
  const navigateToDetails = () => {
    router.push(`/film/${movie.id}`);
  };
  
  return (
    <div 
      ref={cardRef}
      className="relative h-[400px] bg-gray-900 rounded-lg overflow-hidden shadow-xl transition-all duration-300 ease-out cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={navigateToDetails}
    >
      {/* Bouton favori */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 transition-transform duration-300 hover:scale-110"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isFavorite ? "currentColor" : "none"} 
          stroke="currentColor"
          className={`w-6 h-6 ${isFavorite ? 'text-red-600' : 'text-white'}`}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isFavorite ? 0 : 2} 
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
          />
        </svg>
      </button>

      {/* Image du film */}
      <div className="relative w-full h-full">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Contenu au survol */}
        <div 
          className="absolute inset-0 p-4 flex flex-col justify-end transition-all duration-500 ease-out"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
          
          <div className="flex items-center mb-3">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-white text-sm">{movie.vote_average?.toFixed(1)}</span>
            <span className="text-gray-400 text-sm ml-2">({movie.release_date?.split('-')[0]})</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre_ids?.slice(0, 3).map((genreId) => (
              <span 
                key={genreId} 
                className="text-xs text-white bg-red-600/70 px-2 py-1 rounded-full"
              >
                {getGenreName(genreId)}
              </span>
            ))}
          </div>
          
          <button className="py-2 mt-auto bg-red-600 hover:bg-red-700 transition-colors rounded text-white font-medium">
            Voir détails
          </button>
        </div>
      </div>
      
      {/* Effet de brillance */}
      <div 
        className="absolute inset-0 opacity-0 mix-blend-overlay"
        style={{ 
          opacity: isHovered ? 0.3 : 0,
          background: 'radial-gradient(circle at center, white 0%, transparent 70%)',
          transform: isHovered ? 'scale(1)' : 'scale(0.5)'
        }}
      />
    </div>
  );
}

function getGenreName(genreId) {
  const genres = {
    28: 'Action',
    12: 'Aventure',
    16: 'Animation',
    35: 'Comédie',
    80: 'Crime',
    99: 'Documentaire',
    18: 'Drame',
    10751: 'Famille',
    14: 'Fantastique',
    36: 'Histoire',
    27: 'Horreur',
    10402: 'Musique',
    9648: 'Mystère',
    10749: 'Romance',
    878: 'Science-Fiction',
    10770: 'Téléfilm',
    53: 'Thriller',
    10752: 'Guerre',
    37: 'Western'
  };
  
  return genres[genreId] || 'Genre';
} 