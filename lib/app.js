/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import { formatMovies, formatMovieDetail } from './muge-utils.js';
import request from 'superagent';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('MOVIE API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

app.get('/api/me/favorites', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
    SELECT  id,
            title,
            image,
            genre,
            rating,
            img,
            user_id as "userId"
    FROM    favorites
    WHERE   user_id = $1;
`, [req.userId]);

    // send back the data
    res.json(data.rows); //rows[0] || null
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/movies/:id/favorites', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
       SELECT  id,
               title,
               image,
               genre,
               rating,
               img,
               user_id as "userId",
               u.name as "userName"
      FROM     favorites f,
      JOIN     users u
      ON       f.user_id = u.id
      WHERE    movie_id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const favorite = req.body;


    const data = await client.query(`
      INSERT INTO favorites (id, title, year, genre, rating, img, user_id)
      VALUES      ($1, $2, $3, $4, $5, $6, $7)
      RETURNING   id, title, year, genre, rating, img, user_id;
    `, [favorite.movieId, favorite.title, favorite.image, req.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM  favorites 
      WHERE        id = $1
      AND          user_id = $2
      RETURNING    id,
                   title,
                   year,
                   genre,
                   rating,
                   img,
                   user_id;   
    `, [req.params.id, req.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/movies', async (req, res) => {
  try {
    // use our API Key

    // use superagent
    // call the real api
    const response = await request.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_DB_API_KEY}&query=${req.query.search}`)

      .set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`)
      .set('Content-Type', 'application/json;charset=utf-8');

    // munge the data
    const movies = formatMovies(response.body);

    // send it back
    res.json(movies);
  }
  catch(err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
});


app.get('/api/movies/:id', async (req, res) => {
  try {

    const response = await request.get(`https://api.themoviedb.org/3/movies/${req.params.id}`)
      .query({ api_key: process.env.MOVIE_DB_API_KEY });

    // munge the data
    const movies = formatMovieDetail(response.body);

    // send it back
    res.json(movies);
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
});






export default app;


// What the movie data looks like in the FRONT END

/* {
  title: 'movie 3',
  year: '1997',
  genre: 'horror',
  rating: 'PG',
  img: 'url'
}

*/


//ask about the app.get( we got here with Jena but dont see it anywhere on the demo code. )
/*
app.get('/api/movies', async (req, res) => {
  try {
    // use our API Key

    // use superagent
    // call the real api
    const response = await request.get('https://api.themoviedb.org/3/search/movie')
      .query({ api_key: process.env.MOVIE_DB_API_KEY })
      .query({ query: req.query.search });

    // munge the data
    const movies = formatMovies(response.body);

    // send it back
    res.json(movies);
  }
  catch(err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
});
*/






