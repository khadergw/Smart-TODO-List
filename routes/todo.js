const express = require("express");
const router = express.Router();
const { fetchData } = require("./fetchData");

module.exports = (db) => {
  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUser_TodosWithId = (id) => {
    const command = `
    SELECT
    users.id, users.first_name, todos.name AS todoItem, categories.name AS category
    FROM todos
    LEFT JOIN categories ON todos.category_id = categories.id
    JOIN users ON todos.user_id = users.id
    WHERE users.id = $1;`;
    const values = [id];

    return db
      .query(command, values)
      .then((result) => result.rows)
      .catch((err) => console.log(err.message));
  };

  router.get("/", (req, res) => {
    const userId = req.session.userId;

    if (userId) {
      getUser_TodosWithId(userId)
        .then((users) => {
          const templateVars = {
            userId,
            first_name: users[0].first_name,
            users,
          };
          console.log(templateVars);
          res.render(
            "todo",
            templateVars
          ); /* Reder to todo page if user is logged in */
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    } else {
      res.redirect("/login");
      /* Redirect the user to /login if user is not logged in */
    }
  });

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
  // const todo = (todoId) => {
  //   return getTodoByTodoId(todoId, userId).then((data) => {
  //     const templateVars = {
  //       user_id: req.session.user_id,
  //       todo_id: req.params.todo_id,
  //       index: false,
  //       todo: data.rows[0],
  //     };
  //     res.render("todo", templateVars);
  //   });
  // };
  // router.get("/:todo_id", (req, res) => {
  //   const userId = req.session.user_id;
  //   todo(userId).then((data) => {
  //     const templateVars = {
  //       userId: req.session.user_id,
  //       todo_id: req.params.todo_id,
  //       index: false,
  //       todo: data.rows[0],
  //     };
  //     res.render("todo", templateVars);
  //   });
  // });
  // // function to delete or edit todo item
  // const updateTodoList = (userId, todoId, columnName, attribute) => {
  //   let queryParams = [userId, todoId, attribute];
  //   let queryString = "";
  //   if (columnName === "delete") {
  //     queryString = `DELETE
  //   FROM todos`;
  //   } else if (columnName === "edit") {
  //     queryString = `UPDATE todos
  //   SET name = $3`;
  //   }
  //   queryString += ` WHERE user_id = $1 AND id = $2`;
  //   return pool.query(queryString, queryParams);
  // };
  // //update todo item
  // router.post("/:todo_id/column_name", (req, res) => {
  //   const userId = req.session.useId;
  //   const todoId = req.params.todo_id;
  //   const columnName = req.params.column_name;
  //   const attribute = req.body.dbIndex;
  //   updateTodoList(userId, todoId, columnName, attribute)
  //     .then(() => {
  //       res.redirect("/todo");
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  // ------Add a new item to the todo List --------//
  const addNewTodo = (userId, userInput, category) => {
    const command = `
    INSERT INTO todos (user_id, name, category_id)
    VALUES ($1,$2,$3)
    RETURNING *;`;
    const queryParams = [userId, userInput];

    if (userInput.includes("eat") || category === "eat") {
      queryParams.push(1);
    } else if (userInput.includes("read") || category === "read") {
      queryParams.push(2);
    } else if (userInput.includes("watch") || category === "watch") {
      queryParams.push(3);
    } else if (userInput.includes("buy") || category === "buy") {
      queryParams.push(4);
    } else if (!category) {
      queryParams.push(null);
    }

    console.log(command, queryParams);
    return db
      .query(command, queryParams)
      .then((result) => console.log(result.rows[0]))
      .catch((err) => console.log(err.message));
  };

  //add new todo item
  router.post("/add", (req, res) => {
    const userId = req.session.userId;
    const todoInput = req.body.item;

    if (todoInput) {
      fetchData(todoInput, (err, data) => {
        addNewTodo(userId, todoInput, data)
          .then((todoItem) => {
            res.redirect("/todo");
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      });
    }
  });
  // --------------------------------------------------//

  return router;
};
