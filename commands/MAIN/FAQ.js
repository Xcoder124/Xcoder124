/*CMD
  command: FAQ
  help: 
  need_reply: false
  auto_retry_time: 
  folder: MAIN

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

function isBanned(userId) {
    let banUntilStr = User.getProperty("banUntil_" + sellerId)
    if (!banUntilStr) return false
    Bot.runCommand("@")
    return
  }
  Bot.sendMessage("*BJSMasterSyntaxJavaBot*\nHave questions? \n_Read our article about frequently asked questions, and if you need a support click the support button._")
  Bot.sendKeyboard("❓ ARTICLE, 📞 SUPPORT\nBack")
Api.deleteMessage({ message_id: request.message.message_id })

