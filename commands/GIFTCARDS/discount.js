/*CMD
  command: discount
  help: 
  need_reply: true
  auto_retry_time: 
  folder: GIFTCARDS
  answer: Enter Amount

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

if (message < 1) {
  Bot.sendMessage(
    "*❌ INVALID INPUT*\n_The minimum amount of gift card value is 0.05._"
  )
} else {
  var value = message

  if (!isNumeric(value)) {
    Bot.sendMessage(
      "*❌ INVALID INPUT*\n_Invalid value, the value must be numeric/numerical._*"
    )
  } else {
    Bot.setProperty("discountValue_", value, "string") // Save the value correctly
    Bot.runCommand("/discount2")
  }
}

