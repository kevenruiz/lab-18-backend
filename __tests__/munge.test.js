import movieData from '../data/movies-data.js';
import { formatMovies } from '../lib/munge-utils.js';

describe('API Data Munging', () => {

  const expectedMovies = [
    {
      movieId: 550,
      title: 'Fight Club',
      year: '1999-10-15',
      genre: 'Drama',
      rating: 8.4,
      img: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'

    }

  ];

  it('munges movie data', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = formatMovies(movieData);


    // assert
    expect(output).toEqual(expectedMovies);
  });

});