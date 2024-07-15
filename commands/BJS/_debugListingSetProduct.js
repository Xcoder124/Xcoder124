/*CMD
  command: /debugListingSetProduct
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

// Function to debug and fix product listings
function debugProductListings() {
  var productListing = Bot.getProperty("productListing");
  if (!productListing) {
    Bot.sendMessage("You have no products listed.");
    return;
  }

  var productListArray = productListing.split("\n");
  var updatedProductList = [];
  var productUniqueIDs = Libs.ResourcesLib.anotherChatRes("productUniqueIDs", "global");
  productUniqueIDs.set(0); // Reset the productUniqueIDs

  // Reassign product numbers to be sequential
  for (var i = 0; i < productListArray.length; i++) {
    var item = productListArray[i];
    var currentProductId = parseInt(item.split(".")[0]);
    var newProductId = i + 1;

    // Update the properties with the new product ID if necessary
    if (currentProductId !== newProductId) {
      Bot.setProperty(
        "Seller" + newProductId,
        Bot.getProperty("Seller" + currentProductId)
      );
      Bot.setProperty(
        "Name" + newProductId,
        Bot.getProperty("Name" + currentProductId)
      );
      Bot.setProperty(
        "Price" + newProductId,
        Bot.getProperty("Price" + currentProductId)
      );
      Bot.setProperty(
        "Description" + newProductId,
        Bot.getProperty("Description" + currentProductId)
      );
      Bot.setProperty(
        "Info" + newProductId,
        Bot.getProperty("Info" + currentProductId)
      );
      Bot.setProperty(
        "Status" + newProductId,
        Bot.getProperty("Status" + currentProductId)
      );

      // Clear the old properties
      Bot.setProperty("Seller" + currentProductId, null);
      Bot.setProperty("Name" + currentProductId, null);
      Bot.setProperty("Price" + currentProductId, null);
      Bot.setProperty("Description" + currentProductId, null);
      Bot.setProperty("Info" + currentProductId, null);
      Bot.setProperty("Status" + currentProductId, null);
    }

    updatedProductList.push(newProductId + ". " + item.split(". ")[1]);
    productUniqueIDs.add(1); // Add a unique ID for each product
  }

  Bot.setProperty("productListing", updatedProductList.join("\n"), "string");

  Bot.sendMessage("Product listings have been debugged and corrected.");
}

// Example usage
debugProductListings();

