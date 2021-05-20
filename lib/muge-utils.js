export function formatMovies(data) {

  return data.results.map(movie => {

    return {
      movieId: movie.id,
      title: movie.title,
      image: movie.poster_path,
    };
  });
}