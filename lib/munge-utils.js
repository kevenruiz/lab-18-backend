export function formatMovies(data) {

  return data.results.map(movie => {

    return [{
      movieId: movie.id,
      title: movie.title,
      image: movie.poster_path

    }];
  });
}


export function formatMovieDetail(data) {
  // TODO: Munge Detail

  return data.results.map(movie => {

    return {
      // What details are going to be in the format detail? 
      //ask team
      movieId: movie.id,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      rating: movie.rating,
      img: movie.poster_path

    };
  });
}