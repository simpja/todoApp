const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
// In order to keep credentials safe from public repo I gitignored my secrets.js file
// Write your own secret.js file with a function secrets.reveal() and export it to save credentials in your connection string
const secrets = require("./secrets.js");

var db;
MongoClient.connect(secrets.reveal(), (err, client) => {
  if (err) return console.log(err);
  db = client.db("todo");
  app.listen(4000, () => {
    console.log("listening on 4000");
  });
});

app.set("view engine", "ejs"); // EJS renders our templates when using app.render!

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  db.collection("todo")
    .find()
    .toArray(function (err, results) {
      // send HTML file populated with quotes here
      res.render("index.ejs", { todo: results });
    });
});

app.post("/todos", (req, res) => {
  console.log(req.body);
  db.collection("todo").insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
  });
  console.log("Saved to database!");
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("listening on 4000");
});
