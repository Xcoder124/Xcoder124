/*CMD
  command: /discount2
  help: 
  need_reply: false
  auto_retry_time: 
  folder: GIFTCARDS

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Generate a random alphanumeric string
function generateString(length) {
  const characters = "1234567890ABCDEFGHIJKLUVWXYZ"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// Generate and store a discount code
const discountPrefix = "D-"
const discountCode = discountPrefix + generateString(11)
Bot.setProperty("discountCode", discountCode, "string")

// Execute the next step (e.g., run the discount command)
Bot.runCommand("/discount3")

