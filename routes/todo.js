const express = require("express");
const router = express.Router();

module.exports = (db) => {
  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUserWithId = function (id) {
    const command = `SELECT * FROM users WHERE id = $1`;
    const values = [id];

    return db
      .query(command, values)
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  router.get("/", (req, res) => {
    const userId = req.session.userId;
    console.log("user_id at todo:", userId);
    if (userId) {
      getUserWithId(userId)
        .then((user) => {
          console.log(user);
          const templateVars = {
            userId,
            first_name: user.first_name,
          };
          res.render(
            "todo",
            templateVars
          ); /* Render to todo page if user is logged in */
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    } else {
      res.redirect("/login");
      /* Redirect the user to /login if user is not logged in */
    }
  });

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


  router.get("/:todo_id", (req, res) => {
    const userId = req.session.user_id;
    todo(userId)
      .then((data) => {
        const templateVars = {
          userId: req.session.user_id,
          todo_id: req.params.todo_id,
          index: false,
          todo: data.rows[0]
        };
        res.render("todo", templateVars);
      });
  });

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




  //add new todo
  router.post("/new", (req, res) => {
    const inputObj = {
      user_id: req.session.user_id,
      todoInput: req.body.todo,
      };
     if (inputObj.todoInput) {
      addNewTodo(inputObj).then((returnObj) => {
        pool.query(returnObj.str, returnObj.arr)
          .then((data) => {
            res.redirect(
              `/todo/${data.rows[0].id}`
            );
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      });
    }
  });

  return router;
};

