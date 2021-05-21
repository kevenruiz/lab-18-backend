export function formatMovies(data) {
  return data.results.map(movie => {

    return {
      movieId: movie.id,
      title: movie.title,
      year: movie.release_date,
      rating: movie.vote_average,
      img: movie.poster_path
    };
  });
}
