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
    if (!userId) {
      res.send({ message: "not logged in" });
      return;
    }

    getUserWithId(userId)
      .then((user) => {
        if (!user) {
          res.send({ error: "no user with that id" });
          return;
        }
        console.log(user);
        const templateVars = {
          userId: user.id,
          first_name: user.first_name,
        };
        res.render("edit_profile_page", templateVars);
        // res.send({ user: { name: user.name, email: user.email, id: userId } });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
