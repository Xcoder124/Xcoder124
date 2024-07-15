/*CMD
  command: Codes_2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: BJS

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var productUniqueIDs = Libs.ResourcesLib.anotherChatRes(
  "productUniqueIDs",
  "global"
)
var userId = user.telegramid
var message = data.message // Assuming data.message contains the input value

function sendMessageAndExit(msg) {
  Bot.sendMessage(msg)
  return
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

if (!isNumeric(message)) {
  sendMessageAndExit("*📛 Invalid value. Enter only numeric value. Try again*")
  return
}

if (message > productUniqueIDs.value()) {
  sendMessageAndExit(
    "*❌ NO PRODUCT ID WAS FOUND*\nNo Product ID was found with the number of (*" +
      message +
      "*)."
  )
  return
}

function isBanned(userId) {
  let banUntilStr = User.getProperty("banUntil_" + userId)
  if (!banUntilStr) return false
  Bot.runCommand("@")
  return
}

var prodStatus = Bot.getProperty("prodStatus" + message)
var available = Bot.getProperty("available" + message)

if (available === "No") {
  var seller = Bot.getProperty("Seller" + message)
  sendMessageAndExit(
    "*❌ Not Available*\nThis product is not available.\n_Contact *" +
      seller +
      "* for valid reasons._"
  )
  return
}

var info = Bot.getProperty("Info" + message)
var usd = Libs.ResourcesLib.userRes("usd")
var seller = Bot.getProperty("Seller" + message)
var name = Bot.getProperty("Name" + message)
var usd2 = Libs.ResourcesLib.anotherUserRes("pendingBalance", seller)
var price = parseFloat(Bot.getProperty("Price" + message))
var purchaseHistory = Bot.getProperty("obtainedItems" + userId, [])

// Check if the item is already in the purchase history
if (purchaseHistory.some(item => item.itemId === message)) {
  sendMessageAndExit("You have already purchased this item.")
  return
}

// Check if the user has a discount available
var userDiscount = Bot.getProperty("userDiscount_" + userId)
if (userDiscount && userDiscount.applyDiscount && userDiscount.noOfUsage > 0) {
  if (
    price >= userDiscount.minPurchaseAmount &&
    price <= userDiscount.maxPurchaseAmount
  ) {
    var discountAmount = (price * userDiscount.discountPercentage) / 100
    price -= discountAmount

    // Update discount usage
    userDiscount.noOfUsage -= 1
    if (userDiscount.noOfUsage <= 0) {
      userDiscount.applyDiscount = false
    }
    Bot.setProperty("userDiscount_" + userId, userDiscount, "json")

    Bot.sendMessage(
      "*🏷️ Discount applied!*\nOriginal price: *💎" +
        (price + discountAmount).toFixed(2) +
        "*\nDiscount: *" +
        userDiscount.discountPercentage +
        "%*\nCost: *💎" +
        price.toFixed(2) +
        "*\n\n*Note:* _" +
        userDiscount.discountPercentage +
        "% discount applied._"
    )
  }
}
if (usd.value() < price) {
  sendMessageAndExit(
    "*❌ Insufficient Balance*\n_No balance is available, to purchase this product._"
  )
  return
}

usd.add(-price)
usd2.add(price) // Corrected to add positive value to seller's balance
var purchases = Libs.ResourcesLib.anotherChatRes(
  "purchases" + message,
  "global"
)
var profit = Libs.ResourcesLib.anotherChatRes("profit" + message, "global")
purchases.add(1)
profit.add(price)

// Update purchase history
purchaseHistory.push({
  itemId: message,
  purchasedBy: userId,
  name: name,
  price: price,
  date: new Date().toISOString()
})
Bot.setProperty("obtainedItems" + userId, purchaseHistory, "json")
// Update transaction history
var transactions = Bot.getProperty("transactions", [])
transactions.unshift({
  date: new Date().toISOString().split("T")[0],
  type: "Purchase",
  amount: price
})
Bot.setProperty("transactions", transactions, "json")

// Send confirmation message
Bot.sendMessage(
  "*📚 " +
    name +
    "*\nby: " +
    seller +
    "\n\n`" +
    info +
    "`\n\n_If you have any issues please contact the seller, if the seller has not responded for 48 hours, report to us immediately._"
)

