import movieData from '../data/movies-data.js';
import { formatMovies } from '../lib/muge-utils.js';

describe('API Data Munging', () => {

  const expectedMovies = [
    {
      movieId: 508,
      title: 'Star Wars',
      image: '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    },
    {
      movieId: 181812,
      title: 'Star Wars: The Rise of Skywalker',
      image: '/db32LaOibwEliAmSL2jjDF6oDdj.jpg',
    },
    {
      movieId: 181808,
      title: 'Star Wars: The Last Jedi',
      image: '/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg',
    }
  ];

  it('munges movie data', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = formatMovies(movieData);

    // assert
    expect(output[0]).toEqual(expectedMovies);
  });

});