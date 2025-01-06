require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { appRouter } = require("./routes");

const port = 4000;

app.use(bodyParser.json());
app.use(appRouter);

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
