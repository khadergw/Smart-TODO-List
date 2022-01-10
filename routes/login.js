const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then((data) => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  const login = (email, password) => {
    return db.getUserWithEmail(email).then((user) => {
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
          res.send({ error: "no user found, please register first" });
          return;
        }
        req.session.userId = user.id;
        res.send({ user: { name: user.name, email: user.email, id: user.id } });
      })
      .catch((e) => res.send(e));
  });

  return router;
};
