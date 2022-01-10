const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then((data) => {
  //       const users = data.rows;
  //       console.log(users);
  //       res.json({ users });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });
  const getUserWithEmail = function (email) {
    const command = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    return db
      .query(command, values)
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  const login = (email, password) => {
    return getUserWithEmail(email).then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  };
  exports.login = login;

  router.post("/login", (req, res) => {
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
        // res.send({ user: { name: user.name, email: user.email, id: user.id } });
        res.redirect("edit_profile_page");
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
