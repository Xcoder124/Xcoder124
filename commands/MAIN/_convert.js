/*CMD
  command: /convert
  help: 
  need_reply: true
  auto_retry_time: 
  folder: MAIN

  <<ANSWER
*💎 CONVERT*
Convert your *Diamonds* into a *Withdrawable* balance.
_Enter the amount of diamonds you need to convert._

*❗ ONLY FOR FREELANCERS*
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Function to convert USD to withdrawableBalance
function convertUsdToWithdrawableBalance(message) {
  var amountInUsd = parseFloat(message);
  
  // Define the conversion rate
  var conversionRate = 1000; // 1000 USD = 1 withdrawableBalance

  // Calculate the amount in withdrawableBalance
  var amountInWithdrawableBalance = amountInUsd / conversionRate;
  
  // Get the user's resources
  var withdrawableBalance = Libs.ResourcesLib.userRes("withdrawableBalance");
  var usd = Libs.ResourcesLib.userRes("usd");
  
  // Check if the user has enough USD to convert
  if (usd.value() >= amountInUsd) {
    // Deduct the USD amount and add the converted amount to withdrawableBalance
    usd.add(-amountInUsd);
    withdrawableBalance.add(amountInWithdrawableBalance);
    
    // Inform the user about the successful conversion
    Bot.sendMessage("*✅ Conversion Successful!*\nYou have converted: *💎" + amountInUsd + "* to *$" + amountInWithdrawableBalance + "*.");
  } else {
    // Inform the user they don't have enough USD
    Bot.sendMessage("*❌ Insufficient 💎 Balance.*\nYou tried to convert 💎 *" + amountInUsd + "* but your current 💎 balance is 💎*" + usd.value() + "*.\nPlease check your balance and try again.");
  }
}

// Assume the message contains the user input in USD
convertUsdToWithdrawableBalance(message);
