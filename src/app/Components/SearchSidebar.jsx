'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_KEY = 'ed82f4c18f2964e75117c2dc65e2161d';

export default function SearchSidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Gérer le déclenchement du menu
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = (e) => {
    // Ne pas fermer si on survole le contenu du menu
    if (contentRef.current && contentRef.current.contains(e.relatedTarget)) {
      return;
    }
    if (!isSearchFocus) {
      setIsVisible(false);
    }
  };

  const handleContentMouseLeave = (e) => {
    // Ne pas fermer si on survole le déclencheur
    if (triggerRef.current && triggerRef.current.contains(e.relatedTarget)) {
      return;
    }
    if (!isSearchFocus) {
      setIsVisible(false);
    }
  };

  // Navigation vers les détails du film
  const navigateToFilm = (filmId) => {
    router.push(`/film/${filmId}`);
    setIsVisible(false);
  };

  // Recherche de films
  useEffect(() => {
    const searchMovies = async () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=fr-FR`
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la recherche');
        }

        const data = await response.json();
        setResults(data.results.filter(movie => movie.poster_path).slice(0, 5));
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      searchMovies();
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <>
      {/* Zone de déclenchement */}
      <div
        ref={triggerRef}
        className="fixed top-0 left-0 bottom-0 w-5 z-40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Menu latéral */}
      <motion.div
        ref={contentRef}
        className="fixed top-0 left-0 h-full w-[400px] bg-gradient-to-r from-black to-gray-900/90 backdrop-blur-sm z-50 shadow-2xl"
        initial={{ x: -400 }}
        animate={{ x: isVisible ? 0 : -400 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onMouseLeave={handleContentMouseLeave}
      >
        <div className="p-8 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Recherche de Films
          </h2>

          <div className="mb-6 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocus(true)}
              onBlur={() => setIsSearchFocus(false)}
              placeholder="Rechercher un film..."
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 pl-10"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((movie) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => navigateToFilm(movie.id)}
                  >
                    <div className="w-16 h-24 relative flex-shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 flex-grow">
                      <h3 className="text-white font-medium">{movie.title}</h3>
                      <p className="text-sm text-gray-400">{movie.release_date?.split('-')[0]}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 mr-1 text-xs">★</span>
                        <span className="text-gray-300 text-xs">{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center pr-3">
                      <span className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="text-center py-8 text-gray-400">
                Aucun résultat trouvé pour "{query}"
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Recherchez des films par titre</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-gray-400 text-sm mb-3">Suggestions populaires</div>
            <div className="flex flex-wrap gap-2">
              {['Action', 'Comédie', 'Science-Fiction', 'Romance', 'Thriller'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
} 