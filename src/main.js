const express = require("express");
const app = express();

const { appRouter } = require("./routes");

const port = 4000;

app.use(appRouter);

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
