/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import movies from './movie-model.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );
    
    const user = data[0].rows[0];

    await Promise.all(
      movies.map(movie => {
        return client.query(`
        INSERT INTO favorites (movie_id, title, year, genre, rating, img, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [movie.movieId, movie.title, movie.year, movie.genre, movie.rating, movie.img, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}