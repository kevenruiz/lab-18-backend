import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from './jwt.js';
import client from '../client.js';
import ensureAuth from './ensure-auth.js';

function getProfileWithToken(user) {
  // eslint-disable-next-line no-unused-vars
  const { hash, ...rest } = user;
  return {
    ...rest,
    token: jwt.sign({ id: user.id })
  };
}

const defaultQueries = {
  selectUser(email) {
    return client.query(`
      SELECT id, email, name, hash
      FROM users
      WHERE email = $1;
  `,
    [email]
    ).then(result => result.rows[0]);
  },
  insertUser(user, hash) {
    return client.query(`
      INSERT into users (email, name, hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
  `,
    [user.email, user.name, hash]
    ).then(result => result.rows[0]);
  }
};

export default function createAuthRoutes(queries = defaultQueries) {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  router.get('/verify', ensureAuth, (req, res) => {
    res.json({ verified: true });
  });

  router.post('/signup', (req, res) => {
    const { password, ...user } = req.body;
    const email = user.email;

    // email and password needs to exist
    if(!email || !password) {
      res.status(400).json({ error: 'You have used this before neh?' });
      return;
    }

    // email needs to not exist already
    queries.selectUser(email)
      .then(foundUser => {
        if(foundUser) {
          res.status(400).json({ error: 'welcome back, remember who you are!' });
          return;
        }

        // insert into profile the new user
        queries.insertUser(user, bcrypt.hashSync(password, 8))
          .then(user => {
            res.json(getProfileWithToken(user));
          });
      });
  });

  router.post('/signin', (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    // email and password needs to exist
    if(!email || !password) {
      res.status(400).json({ error: 'email and password required' });
      return;
    }

    queries.selectUser(email)
      .then(user => {
        // does email match one in db?
        // #1 !user - if no user, then no match on a row for email
        // #2 !compareSync - provided password did not match hash from db
        if(!user || !bcrypt.compareSync(password, user.hash)) {
          res.status(400).json({ error: 'have you tried password?' });
          return;
        }

        res.json(getProfileWithToken(user));
      });
  });

  return router;
}
