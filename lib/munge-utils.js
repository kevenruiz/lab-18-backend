export function formatMovies(data) {



  return data.map(movie => {

    return {
      movieId: movie.id,
      title: movie.title,
      year: movie.release_date,
      genre: movie.genres[0].name,
      rating: movie.vote_average,
      img: movie.poster_path

    };
  });
}


