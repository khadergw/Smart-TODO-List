const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUserWithId = (id) => {
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
        const templateVars = {
          userId: user.id,
          first_name: user.first_name,
        };
        res.render("edit_profile_page", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  /**
   * Update a single user's profile from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const editUserProfile = (
    id,
    Edit_first_name,
    Edit_last_name,
    Edit_password
  ) => {
    let queryParams = [];
    let command = `UPDATE users `;

    if (Edit_first_name) {
      queryParams.push(Edit_first_name);
      command += `SET first_name = $${queryParams.length}`;
    }

    if (Edit_last_name) {
      queryParams.push(Edit_last_name);
      if (queryParams.length === 1) {
        command += `SET last_name = $${queryParams.length}`;
      } else {
        command += `, last_name = $${queryParams.length}`;
      }
    }

    if (Edit_password) {
      queryParams.push(Edit_password);
      if (queryParams.length === 1) {
        command += `SET password = $${queryParams.length}`;
      } else {
        command += `, password = $${queryParams.length}`;
      }
    }

    queryParams.push(id);
    command += ` WHERE id = $${queryParams.length} RETURNING *;`;

    return db
      .query(command, queryParams)
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  router.post("/", (req, res) => {
    const { firstName, lastName, password } = req.body;
    const userId = req.session.userId;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (!password) {
          editUserProfile(userId, firstName, lastName, null)
            .then((user) => {
              if (!user) {
                res.send({ error: "no user with that id" });
                return;
              }
              res.redirect("/todo");
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        } else if (password) {
          editUserProfile(userId, firstName, lastName, hash)
            .then((user) => {
              if (!user) {
                res.send({ error: "no user with that id" });
                return;
              }
              res.redirect("/todo");
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        }
      });
    });
  });

  return router;
};
