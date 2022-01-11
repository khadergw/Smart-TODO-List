const express = require("express");
const router = express.Router();


module.exports = (db) => {

  // function to fetch todo item by id
  const getTodoByTodoId = (todoId, userId) => {
    const query = `SELECT todos.name,
    categories.name as category
    FROM todos
    JOIN categories ON categories.id = todos.category_id
    WHERE todos.user_id = $1 AND todos.id = $2;`;
    const queryParams = [userId, todoId];
    return pool.query(query, queryParams);
  };

  const todo = (todoId) => {
    return getTodoByTodoId(todoId, userId).then((data) => {
      const templateVars = {
        user_id: req.session.user_id,
        todo_id: req.params.todo_id,
        index: false,
        todo: data.rows[0]
      };
      res.render("todo", templateVars);
    });
  };
  exports.todo = todo;

// function to fetch todo item by id
// const getTodoByTodoId = (todoId, userId) => {
//   const query = `SELECT todos.name,
//   categories.name as category
//   FROM todos
//   JOIN categories ON categories.id = todos.category_id
//   WHERE todos.user_id = $1 AND todos.id = $2;`;
//   const queryParams = [userId, todoId];
//   return pool.query(query, queryParams);
// };



// // getting todo item by id
// router.get("/:todo_id", (req, res) => {
//   getTodoByTodoId(req.params.todo_id, req.session.user_id)
//     .then((data) => {
//       const templateVars = {
//         user_id: req.session.user_id,
//         todo_id: req.params.todo_id,
//         index: false,
//         todo: data.rows[0]
//       };
//       res.render("todo", templateVars);
//     });
// });

// function to delete or edit todo item
const updateTodoList = (userId, todoId, columnName, attribute) => {
  let queryParams = [userId, todoId];
  let queryString = "";
  if (columnName === "delete") {
    queryString = `DELETE
    FROM todos`;
  } else if (columnName === "edit") {
    queryString = `UPDATE todos
    SET name = ${attribute}`;
  }
  queryString += ` WHERE user_id = $1 AND id = $2`;
  return pool.query(queryString, queryParams);
};

//update todo item
router.post("/:todo_id/column_name", (req, res) => {
  const userId = req.session.user_id;
  const todoId = req.params.todo_id;
  const columnName = req.params.column_name;
  const attribute = req.body.dbIndex
  updateTodoList(userId, todoId, columnName, attribute)
    .then(() => {
      res.redirect("/todo");
    })
    .catch(err => {
      res.status(500)
        .json({ error: err.message });
    });
});
return router;

};



