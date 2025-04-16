'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../Components/MovieCard';
import Background3D from '../Components/Background3D';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Récupération des favoris depuis le localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    setIsLoading(false);
  }, []);
  
  // Animation variants pour les éléments
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Arrière-plan 3D */}
      <Background3D />
      
      <div className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-8 relative inline-block">
            Mes Coups de Cœur
            <span className="absolute -bottom-2 left-0 w-32 h-1 bg-red-600"></span>
          </h1>
          
          <p className="text-gray-300 text-xl max-w-3xl mb-12">
            Retrouvez ici tous les films que vous avez aimés et ajoutés à vos favoris.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 px-4 glassmorphism rounded-xl"
          >
            <div className="text-red-500 text-6xl mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Vous n'avez pas encore de coups de cœur</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Explorez notre collection de films et cliquez sur le cœur pour ajouter des films à vos favoris.
            </p>
            <a 
              href="/" 
              className="inline-block px-8 py-3 bg-red-600 text-white rounded-md text-lg font-medium transition-all duration-300 hover:bg-red-700 transform hover:scale-105"
            >
              Découvrir des films
            </a>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
          >
            {favorites.map(movie => (
              <motion.div key={movie.id} variants={item}>
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
} 