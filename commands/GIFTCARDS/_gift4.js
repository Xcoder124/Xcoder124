/*CMD
  command: /gift4
  help: 
  need_reply: true
  auto_retry_time: 
  folder: GIFTCARDS
  answer: Enter your message

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// GIFT4: Retrieve and display the gift card details
const giftCardInfo = Bot.getProperty("giftCardInfo")
const recipientChatId = Bot.getProperty("TgId")
const teamMessage = message

// Check if the properties exist
if (!giftCardInfo) {
  Bot.sendMessage("Error: Missing gift card information.")
} else {
  Bot.sendMessageToChatWithId(
    recipientChatId,
    "🎁 Claim your *💎" +
      giftCardInfo.value +
      "* inside!\n\n" +
      teamMessage +
      "\n\n`" +
      giftCardInfo.code +
      "` - Redeem this code in the redemption command\nor\n[REDEEM](https://t.me/BJSMasterSyntaxJavaBot?start=redeem_" +
      giftCardInfo.code +
      ")\n\n*Expiration Date:* " +
      new Date(giftCardInfo.expirationDate).toLocaleString()
  )
}

