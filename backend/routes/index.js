const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accountRouter = require("./account");


//we are only routing it to go use a different file!

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
