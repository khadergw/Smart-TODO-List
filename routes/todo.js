const express = require("express");
const router = express.Router();

module.exports = (db) => {
  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUserWithId = function (id) {
    const command = `SELECT * FROM users WHERE id = $1`;
    const values = [id];

    return db
      .query(command, values)
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  router.get("/", (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      getUserWithId(userId)
        .then((user) => {
          console.log(user);
          const templateVars = {
            userId,
            first_name: user.first_name,
          };
          res.render(
            "todo",
            templateVars
          ); /* Reder to todo page if user is logged in */
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    } else {
      res.redirect("/login");
      /* Redirect the user to /login if user is not logged in */
    }
  });

  return router;
};
