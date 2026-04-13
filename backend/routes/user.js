//write all user related matter in here
const bcrypt = require("bcrypt");
const express = require("express");
const zod = require("zod");
const { User, Accounts } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

//this User is from our mongoDb instance !
const router = express.Router();

//the thing below is a completely different thing. ki aisa-aisa likkhoo
const signupSchema = zod.object({
  userName: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinSchema = zod.object({
  userName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async function (req, res) {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "Incorrect Inputs",
    });
  }
  const user = await User.findOne({
    userName: body.userName,
  });
  if (user) {
    return res.json({
      message: "Username already taken",
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const dbUser = await User.create({
    ...body,
    password: hashedPassword,
  });
  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET,
  );

  //Creating an account as soon as they signup
  const account = await Accounts.create({
    userId: dbUser._id,
    balance: Math.floor(Math.random() * 4001) + 1000,
  });

  res.json({
    message: "User has been successfull Created",
    token: token,
    accountCreated: {
      accountNumber: account._id,
      userId: account.userId,
      balance: account.balance,
    },
  });
});

router.post("/signin", async function (req, res) {
  const body = req.body;
  const { success } = signinSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "Incorrect Inputs",
    });
  }
  console.log(" body parsing was a Success");

  try {
    const body = req.body;
    const preExistingUser = await User.findOne({
      userName: body.userName,
    });
    console.log("Check 1,checking whether user exists or not");

    if (!preExistingUser) {
      return res.status(400).json({ message: "Cant find anything" });
    }
    console.log("Check 2, user exists");
    console.log(body.password);
    console.log(preExistingUser.password);
    console.log("=== DEBUG bcrypt inputs ===");
    console.log(
      "body.password type:",
      typeof body.password,
      "value:",
      body.password,
    );
    console.log(
      "preExistingUser.password type:",
      typeof preExistingUser.password,
      "value:",
      !!preExistingUser.password,
    );
    console.log("preExistingUser full:", preExistingUser);

    if (!body.password) {
      return res.status(400).json({ message: "No password in request" });
    }
    if (!preExistingUser.password) {
      return res.status(400).json({ message: "No password in database" });
    }

    const validPassword = await bcrypt.compare(
      body.password,
      preExistingUser.password,
    );
    console.log("Check 3");

    if (!validPassword) {
      return res.status(400).json({ message: "Not a valid Password" });
    }
    console.log("Check 5");
    const _token = jwt.sign(
      {
        userId: preExistingUser._id,
      },
      JWT_SECRET,
    );
    console.log("Check 4");

    res.json({
      message: "User has been successfull logged in",
      token: _token,
      userId: preExistingUser._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//enter the username whos password we want to know.
router.get("/seePass", async function (req, res) {
  const matter = req.body;
  const person = User.findOne({ userName: matter.userName });
  const password = bcrypt.compare();
});
router.get("/bulk", async function (req, res) {
  //from header hum bhejenge
  const filter = req.query.filter;
  console.log("bulk check 1 ");
  const user = await User.find({
    $or: [
      { userName: { $regex: filter, $options: "i" } },
      { firstName: { $regex: filter, $options: "i" } },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });
  console.log(" bulk check 3 ,returning matter  ");

  //we are returning the user now
  res.json({
    user: user.map((user) => ({
      id: user._id,
      Username: user.userName,
      Firstname: user.firstName,
      LastName: user.lastName,
    })),
  });
  console.log("bulk check 4,checking done  ");
});

//what are my endpoints ? -> post, put , get , delete
module.exports = router;

//write a getting endpoint
// router.get("/bulk", async function (req, res) {
//   User.map((user) => {
//     res.json({
//       userName: user.userName,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     });
//   });
// });
//wwhy bother with the syntax
