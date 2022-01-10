const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  /**
   * Get a single user from the database given their email.
   * @param {String} email The email of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUserWithEmail = function (email) {
    const command = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    return db
      .query(command, values)
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */
  const login = (email, password) => {
    return getUserWithEmail(email).then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  };
  exports.login = login;

  // Login if the user exist
  // email and password compare
  router.post("/", (req, res) => {
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          res.send({
            error: "no user found/wrong password, please register first",
          });
          return;
        }
        req.session.userId = user.id;
        res.redirect("todo");
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
