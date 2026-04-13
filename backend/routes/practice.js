const { startSession, default: mongoose } = require("mongoose");
const { authMiddleware } = require("../middleware");
const { startTransition } = require("react");
const { User } = require("../db");

//this is basic sliding window problem
function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLength = 0;

  // The Map stores the character as the key, and its LAST SEEN INDEX as the value.
  let charIndexMap = new Map();

  for (let right = 0; right < s.length; right++) {
    const currentChar = s[right];

    // 1. Check if we have seen this character before
    // 2. AND check if its last seen position is INSIDE our current active window
    if (
      charIndexMap.has(currentChar) &&
      charIndexMap.get(currentChar) >= left
    ) {
      // JUMP the left pointer directly to the right of the old duplicate
      left = charIndexMap.get(currentChar) + 1;
    }

    // Add or update the character's most recent index in our map
    charIndexMap.set(currentChar, right);

    // Calculate the window size and update the maximum length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Let's test it with the strings we discussed:
console.log(lengthOfLongestSubstring("tytyusrty")); // Output: 3
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3

router.post("/transfer", authMiddleware, async function (req, res) {
  const session = await mongoose.startSession();
  session.startTrasaction();
  const account = await User.findOne(
    {
        userId : req.userId
    }
  );
  const { amount, to } = req.body;
  //   from acount -> to account me paisa dalo
  //chota chota check dalo, ki account nai hai, kam paisa hai.
  if (!account || account.balance < amount) {
    res
      .status(403)
      .json({ message: "insufficient balance / Account Does not exists" });
  }
  const toAccount = await User.findOne(to);
  if (!toAccount) {
    res.status(403).json({ message: "The to account does not exists" });
  }
  await Accounts.updateOne({
  account.balance = -amount});

});
