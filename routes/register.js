const { query } = require("express");
const express = require("express");
const router = express.Router();
const { pool } = require("../dbConfig");
const bcrypt = require("bcryptjs");

// this is the register routes with will store in the database
  router.post("/register", async (req, res) => {
    let {name, email, password} = req.body;
    //console.log({name, email, password});

    const hashedPassword = bcrypt.hashSync(password, 10);
    const queryAddNewUser = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *`

    pool.query(queryAddNewUser, [name, email, hashedPassword])
    .then(data => {
      /console.log(data.rows[0]);
      const userId = data.rows[0].id;
      req.session.user_id = userId;
      res.redirect("/login");
    }).catch((err) => {
     console.log("this is the err", err)
    });
  });

  module.exports = router;