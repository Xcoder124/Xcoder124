/*CMD
  command: 🎁 REDEEM
  help: 
  need_reply: true
  auto_retry_time: 
  folder: MAIN

  <<ANSWER
*BJSMasterSyntaxJavaBot*
Send your obtained gift pin.
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /redeem, redeem
  group: 
CMD*/

function isExpired(dateCreated, expirationDate) {
  const currentDate = new Date();
  return currentDate > expirationDate;
}

function redeemGiftCode(message) {
  // Retrieve gift card information, code, expiration, and redemption limit
  var giftCardInfo = Bot.getProperty("giftCardInfo");

  if (!giftCardInfo) {
    Bot.sendMessage("*Invalid code*");
    return;
  }

  // Check if the code is valid
  if (message !== giftCardInfo.code) {
    Bot.sendMessage("*Invalid code*");
    return;
  }

  // Check if the code is expired
  if (isExpired(giftCardInfo.dateCreated, giftCardInfo.expirationDate)) {
    Bot.sendMessage("*This code has expired*");
    return;
  }

  // Retrieve the value associated with the gift code
  var codeInfo = Bot.getProperty("giftCardCode_" + message);

  // Initialize codeInfo if it doesn't exist
  if (!codeInfo) {
    codeInfo = {
      value: giftCardInfo.value,
      redeemed: false,
      redeemedCount: 0,
      redeemedBy: [] // Track user IDs who have redeemed the code
    };
  } else {
    // Parse the JSON string to an object
    codeInfo = JSON.parse(codeInfo);
  }

  // Check if the user has already redeemed the code
  var userId = user.telegramid;
  if (codeInfo.redeemedBy.includes(userId)) {
    Bot.sendMessage("*You have already redeemed this code*");
    return;
  }

  // Check if redemption limit is reached
  if (giftCardInfo.redeemLimit !== null && codeInfo.redeemedCount >= giftCardInfo.redeemLimit) {
    Bot.sendMessage("*Redemption limit reached for this code*");
    return;
  }

  // Redeem the code and update the user's balance
  var balance = Libs.ResourcesLib.userRes("balance");
  balance.add(parseInt(codeInfo.value));
  codeInfo.redeemedCount += 1;
  codeInfo.redeemedBy.push(userId); // Add user ID to the redeemed list

  // Set redeemed to true if the redeemLimit is reached
  if (giftCardInfo.redeemLimit !== null && codeInfo.redeemedCount >= giftCardInfo.redeemLimit) {
    codeInfo.redeemed = true;
  }

  // Update transaction history
  var transactions = Bot.getProperty("transactions", []);
  transactions.unshift({
    date: new Date().toISOString().split("T")[0],
    type: "Gift Card Deposit",
    amount: codeInfo.value
  });
  Bot.setProperty("transactions", transactions, "json");

  // Store the updated codeInfo as a JSON string
  Bot.setProperty("giftCardCode_" + message, JSON.stringify(codeInfo), "string");

  // Notify the user about the successful redemption
  Bot.sendMessage(
    "*Congratulations!*\nYour redeem code has been successfully redeemed.\nYou now have an additional *💎" +
      codeInfo.value +
      "* in your account balance.\nHappy Goodies!"
  );
}

function redeemDiscountCode(message) {
  var prefix = "D-";
  var discountCode = message.startsWith(prefix) ? message.slice(prefix.length) : null;

  if (!discountCode) {
    Bot.sendMessage("*Invalid discount code format*");
    return;
  }

  var discountValue = Bot.getProperty("discountValue_");
  var redeemDLimit = Bot.getProperty("redeemDLimit_");
  var minPurchaseAmount = Bot.getProperty("minPurchaseAmount");
  var maxPurchaseAmount = Bot.getProperty("maxPurchaseAmount");
  var discountInfo = Bot.getProperty("discountInfo_");

  if (!discountInfo) {
    discountInfo = {
      value: discountValue,
      redeemedCount: 0,
      redeemedBy: []
    };
  } else {
    discountInfo = JSON.parse(discountInfo);
  }

  if (!discountValue) {
    Bot.sendMessage("*Invalid discount code*");
    return;
  }

  var userId = user.telegramid;
  if (discountInfo.redeemedBy.includes(userId)) {
    Bot.sendMessage("*You have already redeemed this discount code*");
    return;
  }

  if (redeemDLimit !== null && discountInfo.redeemedCount >= redeemDLimit) {
    Bot.sendMessage("*Redemption limit reached for this discount code*");
    return;
  }

  discountInfo.redeemedCount += 1;
  discountInfo.redeemedBy.push(userId);

  Bot.setProperty("discountInfo_" + discountCode, JSON.stringify(discountInfo), "string");

  // Set the discount property for the user
  Bot.setProperty(
    "userDiscount_" + userId,
    {
      applyDiscount: true,
      discountPercentage: discountValue,
      noOfUsage: 1,
      minPurchaseAmount: minPurchaseAmount,
      maxPurchaseAmount: maxPurchaseAmount
    },
    "json"
  );

  Bot.sendMessage(
    "*Congratulations!*\nYour discount code has been successfully redeemed.\nYou can now enjoy a *" +
      discountValue +
      "%* discount on your next purchase.\n\n*Note:* _Ensure your purchase amount is between $" +
      minPurchaseAmount.toFixed(2) +
      " and $" +
      maxPurchaseAmount.toFixed(2) +
      " to apply the discount._\n\nHappy shopping!"
  );
}

function redeemCode(message) {
  if (message.startsWith("D-")) {
    redeemDiscountCode(message);
  } else {
    redeemGiftCode(message);
  }
}

// Example usage
redeemCode(message);
