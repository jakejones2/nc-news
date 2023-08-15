const db = require("../db/connection");
const format = require("pg-format");

function selectUsernames() {
  return db.query("SELECT username FROM users").then(({ rows }) => {
    return rows;
  });
}

module.exports = { selectUsernames };