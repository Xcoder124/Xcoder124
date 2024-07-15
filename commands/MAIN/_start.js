/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: MAIN

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Define the startCommand function
function startCommand() {
  var params = message.split(" ")
  var isNewUser = checkIfNewUser(user.telegramid)

  if (params.length > 1) {
    var action = params[1].split("_")

    if (action[0] === "redeem") {
      var code = action[1] // Changed action[2] to action[1] for code index
      redeemGiftCode(code)
    } else {
      Bot.sendMessage("Invalid action or parameters.")
    }
  } else {
    if (isNewUser) {
      Bot.sendMessage(
        "*BJSMasterSyntaxJavaBot*\nWelcome " +
          user.first_name +
          " to our bot!\nAn ultimate source of BJS resources to use in your bot!\nWe are here to provide BJS Sources and Templates for your custom bot.\n\n*Such as the:\n👨‍💻 CODES\n🤖 TEMPLATE BOTS*\n_📌 All of these are free and paid sources of BJS code from our Bots.Business Community!_\n\n*Explore now and create your multi-functional bot!*\n\n_Our bot [Contains ADS]_"
      )

      Bot.run({
        command: "main_hallway",
        run_after: 7 // seconds
      })
    } else {
      Bot.runCommand("main_hallway")
    }
  }
}

var userId = user.telegramid

function isBanned(userId) {
  let banUntilStr = User.getProperty("banUntil_" + userId)
  if (!banUntilStr) return false

  let banUntil = new Date(banUntilStr)
  return new Date() < banUntil
}

if (isBanned(user.telegramid)) {
  let banUntilStr = User.getProperty("banUntil_" + userId)
  Bot.sendMessage(
    "*⛔ RESTRICTED*\nYou're account has been restricted until *" +
      banUntilStr +
      "*.\n\nIf you think this was a mistake, contact our admin through DM."
  )
  return
}

// Function to check if the user is new
function checkIfNewUser(userId) {
  var userRecord = Bot.getProperty("user_" + userId)
  if (!userRecord) {
    // Mark the user as new and store the record
    Bot.setProperty("user_" + userId, { isNew: false }, "json")
    let stats = Libs.ResourcesLib.anotherChatRes("activeUsers", "global")
    stats.add(1)
    return true
  }
  return false
}

// Define the redemption logic within the startCommand function
function redeemGiftCode(code) {
  // Redemption logic here
  var giftCardValue = Bot.getProperty("giftCardValue")
  var giftCardCode = Bot.getProperty("giftCardCode")
  var redeemLimit = Bot.getProperty("redeemLimit")

  // Retrieve the value associated with the gift code
  var codeInfo = Bot.getProperty("giftCardCode_" + code)

  // Initialize codeInfo if it doesn't exist
  if (!codeInfo) {
    codeInfo = {
      value: giftCardValue,
      redeemed: false,
      redeemedCount: 0,
      redeemedBy: [] // Track user IDs who have redeemed the code
    }
  } else {
    // Parse the JSON string to an object
    codeInfo = JSON.parse(codeInfo)
  }

  // Check if the code is valid
  if (code !== giftCardCode) {
    Bot.sendMessage("*Invalid code*")
    return
  }

  // Check if the user has already redeemed the code
  var userId = user.telegramid
  if (codeInfo.redeemedBy.includes(userId)) {
    Bot.sendMessage("*You have already redeemed this code*")
    return
  }

  // Check if redemption limit is reached
  if (redeemLimit !== null && codeInfo.redeemedCount >= redeemLimit) {
    Bot.sendMessage("*Redemption limit reached for this code*")
    return
  }

  // Redeem the code and update the user's balance
  var balance = Libs.ResourcesLib.userRes("balance")
  balance.add(parseInt(codeInfo.value))
  codeInfo.redeemedCount += 1
  codeInfo.redeemedBy.push(userId) // Add user ID to the redeemed list

  // Set redeemed to true if the redeemLimit is reached
  if (redeemLimit !== null && codeInfo.redeemedCount >= redeemLimit) {
    codeInfo.redeemed = true
  }

  // Store the updated codeInfo as a JSON string
  Bot.setProperty("giftCardCode_" + code, JSON.stringify(codeInfo), "string")

  // Update transaction history
  var transactions = Bot.getProperty("transactions", [])
  transactions.unshift({
    date: new Date().toISOString().split("T")[0],
    type: "Gift Card Deposit",
    amount: codeInfo.value
  })
  Bot.setProperty("transactions", transactions, "json")

  // Notify the user about the successful redemption
  Bot.sendMessage(
    "*Congratulations!*\nYour redeem code has been successfully redeemed.\nYou now have an additional *💎" +
      codeInfo.value +
      "* in your account balance.\nHappy Goodies!"
  )
}

// Call startCommand function
startCommand()


