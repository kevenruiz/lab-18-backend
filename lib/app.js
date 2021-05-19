/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import { formatMovies } from './muge-utils.js';
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
    SELECT  id, movie_id as "movieId",
    title, image,
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





export default app;