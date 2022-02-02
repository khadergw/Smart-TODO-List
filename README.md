# Smart TODO List

When you are recommended something it's not always easy to jot it down for later in an organized fashion. Adding the item to your phone or computer ends up taking time and opening up the right app is only part of the problem. You then have to locate the right list ("Movies to watch", "Books to read", etc.) to add to. And if you do get it in to the right list, you don't have much more context about it. This delay and lack of additional information acts as a huge deterrent.

The solution? A smart, auto-categorizing todo list app. The user simply has to add the name of the thing, and it gets put into the correct list.

## Final Project

Final Smart TODO List Project

!["Home Page1"](./public/images/finalProject1.gif)
!["Home Page2"](./public/images/finalProject2.gif)

## App Demo

!["App Demo - Todos Page"](https://github.com/khadergw/Smart-TODO-List/blob/master/docs/todos%20page.png)
!["App Demo - Edit Todos Page"](https://github.com/khadergw/Smart-TODO-List/blob/master/docs/edit%20todo%20page.png)
!["App Demo - Edit Profile Page"](https://github.com/khadergw/Smart-TODO-List/blob/master/docs/edit%20profile%20page.png)

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- ejs
- express
- cookie-session
- bcrypt

## Requirements

Each todo created should be categorized as one of:

1. Film / Series (To watch)
2. Restaurants, cafes, etc. (To eat)
3. Books (To read)
4. Products (To buy)

- In order to determine the category the app will probably need to use various API services such as those offered by Google, Wolfram Alpha, Rotten Tomatoes, Amazon, Yelp and others.

- API services mentioned above are only suggestions. You will have to investigate how to balance the accurate categorization of items with having to deal with multiple API endpoints.

- Users should be able to change a category of an item in case it was mis-categorized or could not be categorized at all.

- Users should be able to register, log in, log out and update their profile.

## Project Setup

The following steps are only for _one_ of the group members to perform.

1. Create your own copy of this repo using the `Use This Template` button, ideally using the name of your project. The repo should be marked Public
2. Verify that the skeleton code now shows up in your repo on GitHub, you should be automatically redirected
3. Clone your copy of the repo to your dev machine
4. Add your team members as collaborators to the project so that they can push to this repo
5. Let your team members know the repo URL so that they use the same repo (they should _not_ create a copy/fork of this repo since that will add additional workflow complexity to the project)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information

- username: `labber`
- password: `labber`
- database: `midterm`

3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`

- Check the db folder to see what gets created and seeded in the SDB

7. Run the server: `npm run local`

- Note: nodemon is used, so you should not have to restart your server

8. Visit `http://localhost:8080/`

## Warnings & Tips

- Do not edit the `layout.css` file directly, it is auto-generated by `layout.scss`
- Split routes into their own resource-based file names, as demonstrated with `users.js` and `widgets.js`
- Split database schema (table definitions) and seeds (inserts) into separate files, one per table. See `db` folder for pre-populated examples.
- Use the `npm run db:reset` command each time there is a change to the database schema or seeds.
  - It runs through each of the files, in order, and executes them against the database.
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.
