// backend/routes/account.js
const express = require("express");
const { authMiddleware } = require("../middleware");
const { Accounts } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Accounts.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.post("/addBalance", authMiddleware, async function (req, res) {
  const session = mongoose.startSession();
  const user = req.userId;
  const { amount } = req.body;
  session.startTransaction();

  const account = await Accounts.findOne({ userId: user }).session(session);
  await account
    .updateOne({ userId: req.userId }, { $inc: { balance: amount } })
    .session(session);
  session.endSession();
  res.json({
    message: "Amount Successfully added to the Account",
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  console.log("Inside Session !");
  session.startTransaction();
  const { amount, to } = req.body;

  // Fetch the accounts within the transaction
  //only reading stuff
  const account = await Accounts.findOne({ userId: req.userId }).session(
    session,
  );
  console.log("Account Found , checking balance");

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Accounts.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer
  await Accounts.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } },
  ).session(session);
  await Accounts.updateOne(
    { userId: to },
    { $inc: { balance: +amount } },
  ).session(session);
  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

module.exports = router;
