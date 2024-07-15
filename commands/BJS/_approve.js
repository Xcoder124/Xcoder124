/*CMD
  command: /approve
  help: 
  need_reply: false
  auto_retry_time: 
  folder: BJS

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Command to approve the listing
var params = message.split(" ")
var productUniqueId = params[1]

// Retrieve temporary product information
var tempProductInfo = Bot.getProperty("tempProductInfo" + productUniqueId)

if (!tempProductInfo) {
  Bot.sendMessage("Error: Product information not found.")
  return
}

// Check if the product status is DECLINED
if (tempProductInfo.status === "DECLINED") {
  Bot.sendMessage("Unable to approve a product that has been declined.")
  return
}

// Function to set multiple properties
function setProperties(prefix, properties) {
  for (const key in properties) {
    Bot.setProperty(prefix + key, properties[key], "string")
  }
}

tempProductInfo.status = "LISTED"
Bot.setProperty("Seller" + productUniqueId, tempProductInfo.seller, "string")
Bot.setProperty("Name" + productUniqueId, tempProductInfo.itemName, "string")
Bot.setProperty(
  "sellerId" + productUniqueId,
  tempProductInfo.sellerId,
  "string"
)
Bot.setProperty(
  "Price" + productUniqueId,
  tempProductInfo.finalPrice.toString(),
  "string"
)
Bot.setProperty(
  "Description" + productUniqueId,
  tempProductInfo.itemDescription,
  "string"
)
Bot.setProperty("Info" + productUniqueId, tempProductInfo.itemInfo, "string")
Bot.setProperty("Status" + productUniqueId, "LISTED", "string")

// Update the product listing
var productListing = Bot.getProperty("productListing")
if (productListing === undefined) {
  Bot.setProperty(
    "productListing",
    productUniqueId +
      ". " +
      tempProductInfo.itemName +
      " (" +
      tempProductInfo.finalPrice.toFixed(2) +
      "💎)",
    "string"
  )
} else {
  Bot.setProperty(
    "productListing",
    productListing +
      "\n" +
      productUniqueId +
      ". " +
      tempProductInfo.itemName +
      " (" +
      tempProductInfo.finalPrice.toFixed(2) +
      "💎)",
    "string"
  )
}

// Notify the seller
var sellerId = tempProductInfo.sellerId
Api.sendMessage({
  chat_id: sellerId,
  text:
    "```json\n" +
    "{\n" +
    '  "title": "✅ Listing Added Successfully",\n' +
    '  "description": "Your item, ' +
    tempProductInfo.itemName +
    ", has been listed for " +
    tempProductInfo.finalPrice.toFixed(2) +
    '💎. This is the amount you will receive after someone purchased your code.",\n' +
    '  "message": "Your listing has been reviewed and approved. Check it out!"\n' +
    "}\n" +
    "```",
  parse_mode: "Markdown"
})

Bot.sendMessage(
  "The product with ID " + productUniqueId + " has been approved and listed."
)

