import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {
  afterAll(async () => {
    return client.end();
  });

  describe('favorites', () => {
    let user;
    //  let user2;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Merlin',
          email: 'merlin@aol.com',
          password: 'magicshit'
        });

      expect(response.status).toBe(200);

      user = response.body;

      const response2 = await request
        .post('/api/auth/signup')
        .send({
          name: 'Arthur',
          email: 'Arthur@msn.com',
          password: 'kingshit'
        });

      expect(response2.status).toBe(200);

      user2 = response2.body;
    });

    let favorite = {
      id: expect.any(Number),
      movieId: 550,
      title: 'Fight Club',
      year: '1999-10-15',
      genre: 'Drama',
      rating: 8.4,
      img: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'
    };

    it('POST fave to /api/favorites', async () => {

      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        userId: user.id,
        ...favorite
      });

      favorite = response.body;
    
    });
    it('GET my /api/me/favorites only returns my favorites', async () => {
      const response = await request.get(`/api/movies/${user.id}/favorites`)
        .set('Authorization', user.token);

      // expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...favorite, userName: 'Merlin' });


      // // this is setup so that there is a favorite belong to someone else in the db
      // const otherResponse = await request
      //   .get('/api/movies/:id/favorites')
      //   .set('Authorization', user2.token)
      //   .send(
      //     {
      //       id: expect.any(Number),
      //       movieId: 550,
      //       title: 'Fight Club',
      //       year: '1999-10-15',
      //       genre: 'Drama',
      //       rating: 8.4,
      //       img: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'
      //     }

      //   );

      // expect(otherResponse.status).toBe(200);
      // const otherFavorite = otherResponse.body;

      // we are testing this

    });

  });
});
