import movieData from '../data/movies-data.js';
import { formatMovies } from '../lib/munge-utils.js';

describe('API Data Munging', () => {

  const expectedMovies = [
    {
      movieId: 11,
      title: 'Star Wars',
      image: '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
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