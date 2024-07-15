/*CMD
  command: /deleteCoderListing
  help: 
  need_reply: true
  auto_retry_time: 
  folder: CODERS
  answer: Enter coder id

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Function to gather and delete coder listing
function deleteCoderListing(coderId) {
  var supportList = Bot.getProperty("supportListing")
  if (!supportList) {
    Bot.sendMessage("You have no coders listed.")
    return
  }

  var coderName = Bot.getProperty("coderName" + coderId)
  var coderPrice = Bot.getProperty("coderPrice" + coderId)
  var coderDescription = Bot.getProperty("coderDescription" + coderId)
  var coderStatus = Bot.getProperty("coderStatus" + coderId)
  var coderLevel = Bot.getProperty("coder_level" + coderId)

  // Ensure that the coder exists before attempting to delete it
  if (
    coderName === null ||
    coderPrice === null ||
    coderDescription === null ||
    coderStatus === null ||
    coderLevel === null
  ) {
    Bot.sendMessage("❌ Coder with ID " + coderId + " not found.")
    return
  }

  // Display the coder information before deletion
  Bot.sendMessage(
    "🔍 *Coder Information*\n\n" +
      "*Name:* " +
      coderName +
      "\n" +
      "*Price:* $" +
      coderPrice +
      "\n" +
      "*Description:* " +
      coderDescription +
      "\n" +
      "*Status:* " +
      coderStatus +
      "\n" +
      "*Level:* " +
      coderLevel +
      "\n\n" +
      "_The coder with ID " +
      coderId +
      " will now be deleted.\nThis cannot be undone._"
  )

  // Delete the coder properties
  Bot.setProperty("coderName" + coderId, null)
  Bot.setProperty("coderPrice" + coderId, null)
  Bot.setProperty("coderDescription" + coderId, null)
  Bot.setProperty("coderStatus" + coderId, null)
  Bot.setProperty("coder_level" + coderId, null)

  // Remove the coder from the support listing
  var supportListingArray = supportList.split("\n")
  var updatedSupportListArray = supportListingArray.filter(
    item => !item.startsWith(coderId + ".")
  )
  Bot.setProperty(
    "supportListing",
    updatedSupportListArray.join("\n"),
    "string"
  )

  // Update coder counters
  var coderUniqueIDs = Libs.ResourcesLib.anotherChatRes(
    "coderUniqueIDs",
    "global"
  )
  coderUniqueIDs.add(-1)

  // Reassign coder numbers to fill the gap left by the deleted coder
  var updatedSupportList = []
  for (var i = 0; i < updatedSupportListArray.length; i++) {
    var item = updatedSupportListArray[i]
    var currentCoderId = parseInt(item.split(".")[0])
    var newCoderId = i + 1

    // Update the properties with the new coder ID
    Bot.setProperty(
      "coderName" + newCoderId,
      Bot.getProperty("coderName" + currentCoderId)
    )
    Bot.setProperty(
      "coderPrice" + newCoderId,
      Bot.getProperty("coderPrice" + currentCoderId)
    )
    Bot.setProperty(
      "coderDescription" + newCoderId,
      Bot.getProperty("coderDescription" + currentCoderId)
    )
    Bot.setProperty(
      "coderStatus" + newCoderId,
      Bot.getProperty("coderStatus" + currentCoderId)
    )
    Bot.setProperty(
      "coder_level" + newCoderId,
      Bot.getProperty("coder_level" + currentCoderId)
    )

    // Clear the old properties
    Bot.setProperty("coderName" + currentCoderId, null)
    Bot.setProperty("coderPrice" + currentCoderId, null)
    Bot.setProperty("coderDescription" + currentCoderId, null)

    Bot.setProperty("coderStatus" + currentCoderId, null)
    Bot.setProperty("coder_level" + currentCoderId, null)

    updatedSupportList.push(newCoderId + ". " + item.split(". ")[1])
  }

  Bot.setProperty("supportListing", updatedSupportList.join("\n"), "string")

  if (updatedSupportList.length === 0) {
    Bot.sendMessage("You have no coders listed.")
  } else {
    Bot.sendMessage(
      "*ℹ️ INFO*\nYour coder with ID " +
        coderId +
        " has been permanently deleted."
    )
  }
}

// Example usage
var coderId = message // Assuming the coder ID to delete is provided as the message
deleteCoderListing(coderId)

