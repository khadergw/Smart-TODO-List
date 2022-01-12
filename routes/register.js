const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// this is the register routes with will store in the database
module.exports = (db) => {
  router.post("/", async (req, res) => {
    let { name1, name2, email, password } = req.body;
    console.log({ name1, name2, email, password });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const queryAddNewUser = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

    db.query(queryAddNewUser, [name1, name2, email, hashedPassword])
      .then((user) => {
        console.log(user.rows[0]);
        const userId = user.rows[0].id;
        req.session.userId = userId;
        res.redirect("/todo");
      })
      .catch((err) => {
        console.log("this is the err", err);
      });
  });

  return router;
};
