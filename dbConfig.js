const {Pool} = require("pg");

const pool = new Pool({
  database: "midterm",
  user: "vagrant",
  password: "123",
  host: "localhost"
});

module.exports = {pool}