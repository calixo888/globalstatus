const express = require("express");
const mongoose = require("mongoose");

app = express();

// Mongoose configuration
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/anojs";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Setting JSON parsing methods for POST request data
app.use(express.urlencoded()); // HTML forms
app.use(express.json()); // API clients

// Setting view rendering engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'))
app.engine('html', require('ejs').renderFile);


app.get("/", (req, res) => {
  res.send("Hello World!");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[+] GlobalStatus server running on port ${port}...`)
});
