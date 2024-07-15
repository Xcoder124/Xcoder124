/*CMD
  command: /date
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var now = new Date();
var gmtPlus8 = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // Adjust for GMT+8

// Format the date
var formattedDate = Date(gmtPlus8, "dddd, mmmm dS, yyyy, h:MM:ss TT 'GMT+8'");
Bot.sendMessage(formattedDate);

