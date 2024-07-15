/*CMD
  command: viewProduct
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

var userId = user.telegramid
function isBanned(userId) {
  let banUntilStr = User.getProperty("banUntil_" + userId)
  if (!banUntilStr) return false
  Bot.runCommand("@")
  return
}
var productUniqueIDs = Libs.ResourcesLib.anotherChatRes(
  "productUniqueIDs",
  "global"
)
var selectedProductId = User.getProperty("selectedProductId")
var seller,
  name,
  price,
  description,
  status,
  listingName,
  rating,
  purchases,
  noRated,
  error

// Function to check if a value is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

// Function to convert diamonds to dollars
function convertDiamondsToDollars(diamonds) {
  var dollars = diamonds / 1000
  return dollars.toFixed(2) // Returns the dollar amount formatted to two decimal places
}

// Function to display product information
function displayProductInfo(value) {
  var seller = Bot.getProperty("Seller" + value)
  var name = Bot.getProperty("Name" + value)
  var price = Bot.getProperty("Price" + value)
  var description = Bot.getProperty("Description" + value)
  var status = Bot.getProperty("Status" + value)
  var ratingData = Bot.getProperty("Rating" + value, {
    totalRatings: 0,
    numberOfRatings: 0,
    averageRating: 0
  })

  // Check if purchases and noRated are objects and set to 0 if true
  var purchases = Libs.ResourcesLib.anotherChatRes(
    "purchases" + value,
    "global"
  ).value()
  var noRated = Libs.ResourcesLib.anotherChatRes(
    "sumRated" + value,
    "global"
  ).value()
  purchases = isNaN(purchases) ? 0 : purchases
  noRated = isNaN(noRated) ? 0 : noRated

  var error = Bot.getProperty("error" + value) || "No reported errors"

  var availabilityKey = "OnOff" + value
  var available = Bot.getProperty("Sello" + Bot.getProperty(availabilityKey))

  var userId = user.telegramid // Assuming you are using Telegram user ID
  var purchaseHistory = Bot.getProperty("obtainedItems" + userId, [])
  var productName = name ? name.split(" (")[0].trim() : "Unknown Product"

  if (available == "Off") {
    Bot.sendMessage("Not Available")
  } else {
    // Check if the product is in the purchase history
    if (purchaseHistory.some(item => item.itemId === value)) {
      price =
        "*✅ OBTAINED:\nYou have already obtained this product.*\n_Please check your purchase history to review your order._"
    } else {
      price = "*💎 " + price + "* ~ $" + convertDiamondsToDollars(price)
    }

    var Lmessage =
      "📚 *" +
      name +
      "*\nby *" +
      seller +
      "*\n" +
      "==================================\n" +
      description +
      "\n" +
      "==================================\n" +
      "" +
      price +
      "\n" +
      "==================================\n" +
      "⭐ *Rating*: " +
      ratingData.averageRating.toFixed(2) +
      "/5.00 ~ " +
      noRated +
      " users rated this\n" +
      "🛒 *Purchases*: " +
      purchases +
      "\n" +
      "==================================\n" +
      "⚠️ *Recent Errors*: " +
      error +
      "\n" +
      "⌛ *Status*: " +
      status +
      "\n" +
      "==================================\n"

    if (!purchaseHistory.some(item => item.itemId === value)) {
      Lmessage +=
        "To purchase input the number (" +
        value +
        ") you want to purchase if you have made a decision."
    }

    var userDiscount = Bot.getProperty("userDiscount_" + userId)
    if (userDiscount) {
      Lmessage +=
        "\n\nNote: _Your purchase amount must meet the minimum: 💎" +
        userDiscount.minPurchaseAmount.toFixed(2) +
        " and maximum 💎" +
        userDiscount.maxPurchaseAmount.toFixed(2) +
        " amount of purchase to apply your active discount._"
    }

    Bot.sendMessage(Lmessage)
  }
}

// Check if the message is a number and within the range of product IDs
if (!isNumeric(data.message)) {
  Bot.sendMessage("*📛 Invalid value. Enter only numeric value. Try again*")
} else if (data.message > productUniqueIDs.value()) {
  Bot.sendMessage("❓ No product was found (*" + data.message + "*)")
} else {
  displayProductInfo(data.message)
  Bot.runCommand("Codes_2")
}

