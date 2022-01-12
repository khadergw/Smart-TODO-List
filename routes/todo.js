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
    users.id, users.first_name, todos.name AS todoItem, todos.id AS todoId, categories.name AS category
    FROM todos
    LEFT JOIN categories ON todos.category_id = categories.id
    RIGHT JOIN users ON todos.user_id = users.id
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
            users
          };
          console.log(templateVars);
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
      queryParams.push(5);
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

  //delete todo item function
  const deleteTodo = function(userId, todoId, db) {
    let query = `DELETE FROM todos WHERE user_id = $1 AND id = $2`;
    const values = [userId, todoId];
    return db.query(query,values)
      .then(res => res.rows[0])
      .catch(err => {
        console.error('query error', err.stack);
      });
  };

  //delete todo item route
  router.post("/:todoId/delete", (req,res) => {
    const userId = req.session.userId;
    const todoId = req.params.todoId;
    deleteTodo(userId, todoId, db)
      .then(todo => {
        //res.send(todo);
        res.redirect("/todo");
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  return router;
};
