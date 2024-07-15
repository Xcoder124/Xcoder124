/*CMD
  command: /buyCode
  help: 
  need_reply: false
  auto_retry_time: 
  folder: BJS

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🛒 buy codes
  group: 
CMD*/

var productList = Bot.getProperty("productListing")
var storeStatus = Bot.getProperty("storeStatus")

if (storeStatus === "maintenance") {
  Bot.sendMessage(
    "🛠️ The store is currently under maintenance. Please check back later."
  )
} else if (storeStatus === "offline") {
  Bot.sendMessage("🛍️ The store is offline. Please check back later.")
} else if (!productList || productList.trim() === "") {
  Bot.sendMessage(
    "*📚 RESOURCES*\n_Find a BJS code you need._\n\n*No products are live right now.*\n\nStay tuned for new products..."
  )
} else {
  // Count the number of products by counting the occurrences of "1. "
  var productCount = (productList.match(/\d+\.\s/g) || []).length
  Bot.sendMessage(
    "*📚 RESOURCES (" +
    productCount +
    ")*\n_Find a BJS code you need._\n\n" +
    productList + // This will display your products as they are
      "\n\nEnter a corresponding number to choose an item to view."
  )
  Bot.runCommand("viewProduct")
}

