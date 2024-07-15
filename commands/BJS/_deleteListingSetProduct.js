/*CMD
  command: /deleteListingSetProduct
  help: 
  need_reply: true
  auto_retry_time: 
  folder: BJS

  <<ANSWER
*ℹ️ Delete Your Listing*
Identify what is the unique number of your listing and send it here.
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Function to gather and delete product listing
function deleteProductListing(productId) {
  var productListing = Bot.getProperty("productListing")
  if (!productListing) {
    Bot.sendMessage("You have no products listed.")
    return
  }

  var seller = Bot.getProperty("Seller" + productId)
  var name = Bot.getProperty("Name" + productId)
  var price = Bot.getProperty("Price" + productId)
  var description = Bot.getProperty("Description" + productId)
  var info = Bot.getProperty("Info" + productId)
  var status = Bot.getProperty("Status" + productId)
  var Rating = Bot.getProperty("Rating" + ProductId)

  // Ensure that the product exists before attempting to delete it
  if (!seller || !name || !price || !description || !info || !status) {
    Bot.sendMessage("❌ Product with ID " + productId + " not found.")
    return
  }

  // Display the product information before deletion
  Bot.sendMessage(
    "🔍 *Product Information*\n\n" +
      "*Seller:* " +
      seller +
      "\n" +
      "*Name:* " +
      name +
      "\n" +
      "*Rating*" +
      Rating +
      "\n" +
      "*Price:* " +
      price +
      "💎\n" +
      "*Description:* " +
      description +
      "\n" +
      "*Info:* " +
      info +
      "\n" +
      "*Status:* " +
      status +
      "\n\n" +
      "_The product with " +
      productId +
      " will now be deleted.\nThis cannot be undone._"
  )

  // Delete the product properties
  Bot.setProperty("Seller" + productId, null)
  Bot.setProperty("Name" + productId, null)
  Bot.setProperty("Price" + productId, null)
  Bot.setProperty("Description" + productId, null)
  Bot.setProperty("Info" + productId, null)
  Bot.setProperty("Status" + productId, null)
  Bot.setProperty("Rating" + productId, null, {
    totalRatings: 0,
    numberOfRatings: 0,
    averageRating: 0
  })

  // Remove the product from the product listing
  var productListArray = productListing.split("\n")
  productListArray = productListArray.filter(
    item => !item.startsWith(productId + ".")
  )
  Bot.setProperty("productListing", productListArray.join("\n"), "string")

  // Update product counters
  var productUniqueIDs = Libs.ResourcesLib.anotherChatRes(
    "productUniqueIDs",
    "global"
  )
  var totalProducts = Libs.ResourcesLib.anotherChatRes(
    "totalProducts",
    "global"
  )
  productUniqueIDs.add(-1)
  totalProducts.add(-1)

  // Reassign product numbers to fill the gap left by the deleted product
  var updatedProductList = []
  for (var i = 0; i < productListArray.length; i++) {
    var item = productListArray[i]
    var currentProductId = parseInt(item.split(".")[0])
    var newProductId = i + 1

    // Update the properties with the new product ID
    Bot.setProperty(
      "Seller" + newProductId,
      Bot.getProperty("Seller" + currentProductId)
    )
    Bot.setProperty(
      "Name" + newProductId,
      Bot.getProperty("Name" + currentProductId)
    )
    Bot.setProperty(
      "Price" + newProductId,
      Bot.getProperty("Price" + currentProductId)
    )
    Bot.setProperty(
      "Description" + newProductId,
      Bot.getProperty("Description" + currentProductId)
    )
    Bot.setProperty(
      "Info" + newProductId,
      Bot.getProperty("Info" + currentProductId)
    )
    Bot.setProperty(
      "Status" + newProductId,
      Bot.getProperty("Status" + currentProductId)
    )
    Bot.setProperty(
      "Rating" + newProductId,
      Bot.getProperty("Rating" + currentProductId)
    )

    // Clear the old properties
    Bot.setProperty("Seller" + currentProductId, null)
    Bot.setProperty("Name" + currentProductId, null)
    Bot.setProperty("Price" + currentProductId, null)
    Bot.setProperty("Description" + currentProductId, null)
    Bot.setProperty("Info" + currentProductId, null)
    Bot.setProperty("Status" + currentProductId, null)
        Bot.setProperty("Rating" + currentProductId, null)

    updatedProductList.push(newProductId + ". " + item.split(". ")[1])
  }

  Bot.setProperty("productListing", updatedProductList.join("\n"), "string")

  if (updatedProductList.length === 0) {
    Bot.sendMessage("You have no products listed.")
  } else {
    Bot.sendMessage(
      "*ℹ️ INFO*\nYou're (*" +
        productId +
        "*) product has been permanently deleted."
    )
  }
}

// Example usage
var productId = parseInt(message) // Assuming the product ID to delete is provided as the message
deleteProductListing(productId)

