const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("Hello from the server side!"));

const port = 9000;
app.listen(port, () => console.log(`App running on port ${port}...`));
