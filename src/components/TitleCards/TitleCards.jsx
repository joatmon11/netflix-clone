import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/Cards_data";
import { Link } from "react-router-dom";

const TitleCards = ({ title, catagory }) => {

  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const cardsRef = useRef();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzEzMTFlYjA3MDVlZjc1YWZjZThjOWI1NmYwNzQxYyIsIm5iZiI6MTc3NTUwOTQ5Ny45NzIsInN1YiI6IjY5ZDQxZmY5NjZkNmQ5ODRmY2NhN2RlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IYJR8sLz6mwGlN-uwCZnF3bTuFYbc4mUUtzVG6qquyA",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault;
    cardsRef.current.scrollLeft += event.deltaY; //  SCROLLING //
  };

  useEffect(() => {

    // Fix category name for TMDB API (convert hyphens to underscores)
    const tmdbCategory = catagory ? catagory.replace(/-/g, "_") : "now_playing";
    fetch(
      `https://api.themoviedb.org/3/movie/${tmdbCategory}?language=en-US&page=1`,
      options,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        if (res && Array.isArray(res.results)) {
          setApiData(res.results);
        } else {
          setApiData([]);
          setError("No results found.");
        }
      })
      .catch((err) => {
        setApiData([]);
        setError(err.message || "Failed to fetch data.");
        console.error(err);
      });

    // FOR HORIZONTAL CARD SCROLLING //
    cardsRef.current.addEventListener("wheel", handleWheel);
  }, []);
  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      {error ? (
        <div className="error-message" style={{ color: 'red', margin: '1em 0' }}>{error}</div>
      ) : null}
      <div className="card-list" ref={cardsRef}>
        {apiData.length > 0 ? (
          apiData.map((card, index) => (
            <Link to={`player/${card.id}`} className="card" key={index}>
              <img src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} alt="" />
              <p>{card.original_title}</p>
            </Link>
          ))
        ) : !error ? (
          <div style={{ color: '#888', padding: '1em' }}>No movies to display.</div>
        ) : null}
      </div>
    </div>
  );
};

export default TitleCards;
