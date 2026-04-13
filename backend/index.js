//index se hi chalu hota hai.
const express = require("express");

const cors = require("cors");

const mainRouter = require("./routes/index");

//express k instance ko "app" k andar le liya
const app = express();
app.use(cors());
app.use(express.json());
//now we have defined a simple route here for the main route

app.use("/api/v1", mainRouter);
app.listen(3000, console.log("server running at port 3000"));
