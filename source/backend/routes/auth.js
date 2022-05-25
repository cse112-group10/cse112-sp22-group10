const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const tokenUtil = require('../auth/tokenUtil');
const usersModel = require('../database/models/usersModel');

const router = express.Router();

/* GET /auth */
router.get('/', (req, res) => res.status(200).json({ msg: 'passed' }));

/*
  Find username and password (hashed by bcrypt or some other hash functions)
  Check if the above combo exists:
   Yes:
       Return a JWT Token (with the userId, and username)
   No:
       Return 404 (not found)
*/
router.post('/login', async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    // ensure user info is entered
    if (!username || !password) {
      return res.status(400)
        .json({ message: 'Username and password are requried.' });
    }

    // find user
    const rows = await usersModel.getByUsername(username);
    const foundPassword = rows[0].password;
    // evaluate passwords
    const isPasswordMatched = bcrypt.compareSync(password, foundPassword);

    // determine if user exists in database
    if (rows.length === 0 || !isPasswordMatched) {
      return res.status(404)
        .json({ message: 'User information not found' });
    }

    // get userId and password
    const user = {
      userId: rows[0].userId,
      password: rows[0].password,
    };

    // return JWT token
    const accessToken = await tokenUtil.generateToken(user);
    return res.status(200)
      .json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(503).json({
      message: 'Failed to login due to internal error',
      err,
    });
  }
});

module.exports = router;
