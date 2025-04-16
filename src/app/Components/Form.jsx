"use client"
import { useEffect, useState } from "react";
import axios from "axios";


export default function Form() {

    const [moviesData, setMoviesData] = useState([])

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=ed82f4c18f2964e75117c2dc65e2161d&query=code&language=fr-FR`).then((res) => setMoviesData(res.data.results))
    }, [])
  return (
    <div>
      <div>
        <form>
            <input type="text" placeholder="Rechercher un film" id='search input' />
            <input type="submit" value="Rechercher" />
        </form>
        <div className="flex">
            <div id="goodToBad">Top<span>-+</span></div>
            <div id="badToGood">Top<span>+-</span></div>
        </div>
        </div>
        <div>
            {moviesData.slice(0, 12)
            .map((movie) => (
                <div key={movie.id}>
                    <h3>{movie.title}</h3>
                </div>
            ))}
        </div>
    </div>  
  );
}