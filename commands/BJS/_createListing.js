/*CMD
  command: /createListing
  help: 
  need_reply: true
  auto_retry_time: 
  folder: BJS

  <<ANSWER
*ℹ️ Create a new Listing*
_Set a new title for your listing_
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 💈 new listing
  group: 
CMD*/

// Regular expression to match only letters, numbers, spaces, and currency signs
let regex = /^[A-Za-z0-9 $€£¥₹]+$/

// Check if the message contains any special characters
if (!regex.test(message)) {
  Bot.sendMessage(
    "*ℹ️ INFO*\nThe listing title contains special characters. Please use only letters, numbers, spaces, and currency signs.\n*Please try again /createListing*"
  )
} else {
  User.setProperty("listingTitle", message, "string")
  Bot.runCommand("/createListingSetPrice")
}

