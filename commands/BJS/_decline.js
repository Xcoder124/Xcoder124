/*CMD
  command: /decline
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

// Command to decline the listing
  var params = message.split(" ");
  var productUniqueId = params[1];

  // Retrieve temporary product information
  var tempProductInfo = Bot.getProperty("tempProductInfo" + productUniqueId);

  if (!tempProductInfo) {
    Bot.sendMessage("Error: Product information not found.");
    return;
  }

  // Check if the product status is LISTED
  if (Status === "LISTED") {
    Bot.sendMessage("Unable to decline an already listed product.");
    return;
  }

  // Update product status to DECLINED
  tempProductInfo.status = "DECLINED";
  Bot.setProperty("Status" + productUniqueId, "DECLINED", "string");
  
  // Notify the seller
  var sellerId = tempProductInfo.sellerId;
  Api.sendMessage({
    chat_id: sellerId,
    text: "```json\n" +
      "{\n" +
      "  \"title\": \"❌ Listing Declined\",\n" +
      "  \"description\": \"Your item, " + tempProductInfo.itemName + ", listed for " + tempProductInfo.finalPrice.toFixed(2) + "💎 has been declined. Read the message below for reasons.\",\n" +
      "  \"message\": \"Your listing has been declined, if you have received a message from our admins about the reason that will be it.\"\n" +
      "}\n" +
      "```",
    parse_mode: "Markdown"
  });

  Bot.sendMessage("The product with ID " + productUniqueId + " has been declined.");



