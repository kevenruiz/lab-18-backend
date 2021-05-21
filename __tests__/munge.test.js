import movieData from '../data/movies-data.js';
import { formatMovies } from '../lib/munge-utils.js';

describe('API Data Munging', () => {

  const expectedMovies = [
    {
      movieId: 550,
      title: 'Fight Club',
      year: '1999-10-15',
      rating: 8.4,
      img: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'
    },
    {
      movieId: 151912,
      title: 'Jurassic Fight Club',
      year: '2008-10-22',
      rating: 6.7,
      img: null
    },
    {
      movieId: 347807,
      title: 'Fight Club: Members Only',
      year: '2006-02-17',
      rating: 3.4,
      img: '/aXFmWfWYCCxQTkCn7K86RvDiMHZ.jpg'
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