"use client";

import { useState, useEffect } from "react";
import MovieCard from "./Components/MovieCard";
import CategoryFilter from "./Components/CategoryFilter";
import HeroBanner from "./Components/HeroBanner";
import Background3D from "./Components/Background3D";

const categories = [
  { id: 28, name: "Action" },
  { id: 12, name: "Aventure" },
  { id: 10749, name: "Romance" },
  { id: 35, name: "Comédie" },
  { id: 18, name: "Drame" },
  { id: 27, name: "Horreur" },
  { id: 878, name: "Science-Fiction" },
  { id: 9648, name: "Mystère" },
];

const API_KEY = "ed82f4c18f2964e75117c2dc65e2161d";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=a&language=fr-FR&page=1`
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Format de données invalide");
        }

        setMovies(
          data.results.filter(
            (movie) => movie.poster_path && movie.backdrop_path
          )
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = activeCategory
    ? movies.filter((movie) => movie.genre_ids?.includes(activeCategory))
    : movies;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Arrière-plan 3D */}
      <Background3D />

      {/* Bannière héros */}
      <HeroBanner movies={movies} />

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 pt-10">
          <h2 className="text-4xl font-bold mb-8 inline-block relative">
            Explorez notre collection
            <span className="absolute -bottom-2 left-0 w-24 h-1 bg-red-600"></span>
          </h2>

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-100/10 backdrop-blur-sm rounded-lg">
            <p className="text-lg font-semibold">Une erreur est survenue</p>
            <p className="mt-2">{error}</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center text-gray-400 p-4">
            <p className="text-lg">Aucun film trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
