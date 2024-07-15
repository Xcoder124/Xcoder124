/*CMD
  command: /discount4
  help: 
  need_reply: false
  auto_retry_time: 
  folder: GIFTCARDS

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// /discount5: Retrieve and display the discount code details
const discountValue = Bot.getProperty("discountValue_");
const discountCode = Bot.getProperty("discountCode");
const redeemDLimit = Bot.getProperty("redeemDLimit_");
const minPurchaseAmount = Bot.getProperty("minPurchaseAmount");
const maxPurchaseAmount = Bot.getProperty("maxPurchaseAmount");

// Check if the properties exist
if (!discountValue || !discountCode || redeemDLimit === null || !minPurchaseAmount || !maxPurchaseAmount) {
  Bot.sendMessage("Error: Missing discount code information.");
} else {
  Bot.sendMessage(
    "🎁 Claim your *" + discountValue + "%* discount inside!!\n\n" +
    "Our promotion team has sent you a promotional code for you to test!\n\n" +
    "`" + discountCode + "`\n" +
    "Redeem Limit: " + redeemDLimit + "\n" +
    "Minimum Purchase Amount: $" + minPurchaseAmount.toFixed(2) + "\n" +
    "Maximum Purchase Amount: $" + maxPurchaseAmount.toFixed(2) + "\n" +
    "*Note:* _This discount code is subject to a minimum purchase amount, a maximum purchase amount, and a limited number of redemptions._"
  );
}

