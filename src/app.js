const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cookieParser = require("cookie-parser");

app = express();

// Mongoose configuration
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/anojs";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Setting JSON parsing methods for POST request data
app.use(express.urlencoded()); // HTML forms
app.use(express.json()); // API clients
app.use(cookieParser());

// Setting view rendering engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'))
app.engine('html', require('ejs').renderFile);

const client_id = "hidden";
const client_secret = "hidden";

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/login", (req, res) => {
  const slackCode = req.query.code;

  if (slackCode) {
    axios.get(`https://slack.com/api/oauth.v2.access?client_id=${client_id}&client_secret=${client_secret}&code=${slackCode}`).then((response) => {
      res.cookie("slack_access_token", response.data.authed_user.access_token);
      res.redirect("/console");
    });
  } else {
    res.render("login.html");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

app.get("/console", async (req, res) => {
  const slackAccessToken = req.cookies.slack_access_token;

  if (slackAccessToken) {
    let slackUser = undefined;

    // SLACK INFO GRABBING
    await axios.get(`https://slack.com/api/users.identity?token=${slackAccessToken}`).then((response) => {
      slackUser = {
        name: response.data.user.name,
        email: response.data.user.email,
        img: response.data.user.image_1024
      }
    });

    res.render("console.html", context={
      slackUser,
    });
  } else {
    res.send("You aren't logged in.")
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[+] GlobalStatus server running on port ${port}...`)
});
