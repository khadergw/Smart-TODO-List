const express = require("express");
const router = express.Router();
const request = require("request");

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
  // ------Get data from researchAPI_URL -----------//
  const fetchData = (userInput, callback) => {
    const researchAPI_URL = `http://api.wolframalpha.com/v2/query?input=${userInput}&appid=AYXW5J-GKEW2LV46W&format=plaintext`;
    request(researchAPI_URL, (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        if (body) {
          callback(null, body);
        } else {
          callback("Data not Found", null);
        }
      }
    });
  };
  // ------Get category_id by given categroy name --------//
  const getCategoryId = (name) => {
    const command = `SELECT id from categories WHERE name = $1`;
    const queryParams = [name];

    return db
      .query(command, queryParams)
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  // ------Add a new item to the todo List --------//
  const addNewTodo = (userId, userInput) => {
    const command = `
    INSERT INTO todos (user_id, name, category_id)
    WITH VALUES ($1,$2,$3)
    RETURNING *;`;
    const queryParams = [userId, userInput];

    // if (
    //   userInput.includes("eat") ||
    //   fetchData(userInput).includes("eat") ||
    //   fetchData(userInput).includes("food") ||
    //   fetchData(userInput).includes("restaurant")
    // ) {
    //   queryParams.push(getCategoryId(eat));
    // } else if (
    //   userInput.includes("buy") ||
    //   fetchData(userInput).includes("buy") ||
    //   fetchData(userInput).includes("store") ||
    //   fetchData(userInput).includes("market") ||
    //   fetchData(userInput).includes("mall") ||
    //   fetchData(userInput).includes("grocery")
    // ) {
    //   queryParams.push(getCategoryId(buy));
    // } else if (
    //   userInput.includes("read") ||
    //   fetchData(userInput).includes("read") ||
    //   fetchData(userInput).includes("book") ||
    //   fetchData(userInput).includes("novel") ||
    //   fetchData(userInput).includes("magazine") ||
    //   fetchData(userInput).includes("store")
    // ) {
    //   queryParams.push(getCategoryId(read));
    // } else if (
    //   userInput.includes("watch") ||
    //   fetchData(userInput).includes("watch") ||
    //   fetchData(userInput).includes("show") ||
    //   fetchData(userInput).includes("tv") ||
    //   fetchData(userInput).includes("movie") ||
    //   fetchData(userInput).includes("theater")
    // ) {
    //   queryParams.push(getCategoryId(watch));
    // }

    return db
      .query(command, queryParams)
      .then((result) => console.log(result.rows[0]))
      .catch((err) => console.log(err.message));
  };

  //add new todo item
  router.post("/new", (req, res) => {
    const userId = req.session.userId;
    const todoInput = req.body.item;

    if (todoInput) {
      addNewTodo(userId, todoInput)
        .then((todoItem) => {
          res.send(todoItem);
          res.render("todo");
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    }
  });
  // --------------------------------------------------//

  return router;
};
