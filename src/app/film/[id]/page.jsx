'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Background3D from '../../Components/Background3D';
import { motion } from 'framer-motion';

const API_KEY = 'ed82f4c18f2964e75117c2dc65e2161d';

export default function FilmDetails() {
  const params = useParams();
  const filmId = params.id;
  
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchFilmDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${filmId}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,videos,similar`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setFilm(data);
        
        // Vérifier si le film est dans les favoris
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.id === parseInt(filmId)));
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (filmId) {
      fetchFilmDetails();
    }
  }, [filmId]);
  
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Retirer des favoris
      const newFavorites = favorites.filter(fav => fav.id !== film.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      // Ajouter aux favoris
      const filmToAdd = {
        id: film.id,
        title: film.title,
        poster_path: film.poster_path,
        backdrop_path: film.backdrop_path,
        vote_average: film.vote_average,
        release_date: film.release_date,
        genre_ids: film.genres.map(genre => genre.id)
      };
      favorites.push(filmToAdd);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (error || !film) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Film non trouvé</h1>
        <p className="text-gray-400 mb-8">{error || "Ce film n'est pas disponible"}</p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-red-600 text-white rounded-md text-lg font-medium transition-all duration-300 hover:bg-red-700"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-black text-white">
      <Background3D />
      
      {/* Hero backdrop */}
      <div className="relative w-full h-[90vh]">
        {film.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${film.backdrop_path}`}
              alt={film.title}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster et info rapide */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-1"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl aspect-[2/3] max-w-[300px] mx-auto">
                {film.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                    alt={film.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">Image non disponible</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Informations du film */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2 flex flex-col justify-center"
            >
              <div className="flex items-center mb-4">
                {film.genres?.map((genre) => (
                  <span 
                    key={genre.id} 
                    className="text-xs text-white bg-red-600/70 px-2 py-1 rounded-full mr-2"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white text-shadow">
                {film.title}
              </h1>
              
              <div className="text-xl text-gray-300 mb-4">
                {film.release_date && (
                  <span>{new Date(film.release_date).getFullYear()}</span>
                )}
                {film.runtime && (
                  <span className="mx-2">•</span>
                )}
                {film.runtime && (
                  <span>{Math.floor(film.runtime / 60)}h {film.runtime % 60}min</span>
                )}
              </div>
              
              <div className="flex items-center mb-8">
                <div className="flex items-center bg-black/50 px-3 py-2 rounded-full mr-4">
                  <span className="text-yellow-400 mr-1 text-lg">★</span>
                  <span className="text-white">
                    {film.vote_average?.toFixed(1)}<span className="text-gray-400 text-sm">/10</span>
                  </span>
                </div>
                
                <button 
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke="currentColor"
                    className="w-5 h-5"
                    strokeWidth={isFavorite ? 0 : 2} 
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                    />
                  </svg>
                  {isFavorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
                </button>
              </div>
              
              <p className="text-lg text-gray-300">
                {film.overview || "Aucune description disponible."}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Section des détails */}
      <div className="container mx-auto px-6 py-16">
        {/* Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 relative inline-block">
            Distribution
            <span className="absolute -bottom-2 left-0 w-20 h-1 bg-red-600"></span>
          </h2>
          
          <div className="flex overflow-x-auto pb-4 space-x-4 no-scrollbar">
            {film.credits?.cast?.slice(0, 10).map((person) => (
              <div key={person.id} className="flex-shrink-0 w-[160px]">
                <div className="relative rounded-lg overflow-hidden w-full aspect-[2/3] bg-gray-800 mb-2">
                  {person.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Photo non disponible</span>
                    </div>
                  )}
                </div>
                <p className="font-medium text-white">{person.name}</p>
                <p className="text-sm text-gray-400">{person.character}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Films similaires */}
        {film.similar?.results?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 relative inline-block">
              Films similaires
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-red-600"></span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {film.similar.results.slice(0, 5).map((similarFilm) => (
                <Link 
                  href={`/film/${similarFilm.id}`} 
                  key={similarFilm.id}
                  className="block transition-transform hover:scale-105"
                >
                  <div className="relative rounded-lg overflow-hidden w-full aspect-[2/3] bg-gray-800 mb-2">
                    {similarFilm.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${similarFilm.poster_path}`}
                        alt={similarFilm.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Image non disponible</span>
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-white">{similarFilm.title}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1 text-xs">★</span>
                    <span className="text-gray-400 text-sm">{similarFilm.vote_average?.toFixed(1)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
} 