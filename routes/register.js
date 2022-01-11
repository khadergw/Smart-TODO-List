const { query } = require("express");
const express = require("express");
const router = express.Router();
const { pool } = require("../dbConfig");

// module.exports = (db) => {
//   router.get("/register", (req, res) => {
//     db.query(`SELECT * FROM users;`)
//       .then((data) => {
//         const users = data.rows;
//         res.json({ users });
//       })
      // .catch((err) => {
      //   res.status(500).json({ error: err.message });
      // });
//   });
//   return router;
// };

  router.post("/register", async (req, res) => {
    let {name, email, password} = req.body;
    console.log({name, email, password});
    const queryAddNewUser = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, password`

    pool.query(queryAddNewUser, [name, email, password])
    .then(data => {
      console.log(data.rows);
      res.redirect("/login");
    }).catch((err) => {
     console.log("this is the err", err)
    });
  });

  module.exports = router;