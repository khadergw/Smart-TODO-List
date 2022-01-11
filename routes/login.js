const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      userId: null,
      errorMessage: false,
    };
    const userId = req.session.userId;
    console.log("userid: ", userId);
    if (userId) {
      res.redirect(
        "/todo"
      ); /* Redirect the user to todo page if user is logged in */
    } else {
      res.render("index", templateVars);
      /* Redirect the user to /login if user is not logged in */
    }
  });

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
      if (!user) {
        return null;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      }
    });
  };
  exports.login = login;

  // Login if the user exist
  // email and password compare
  router.post("/", (req, res) => {
    const { email, password } = req.body;
    const templateVars = {
      userId: null,
      errorMessage: false,
    };
    login(email, password)
      .then((user) => {
        if (!user) {
          templateVars.errorMessage = true;
          res.render("index", templateVars);
          return;
        }
        req.session.userId = user.id;

        res.redirect("/todo");
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
