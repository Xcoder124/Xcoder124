/*CMD
  command: /gift5
  help: 
  need_reply: true
  auto_retry_time: 
  folder: GIFTCARDS
  answer: Expiration Date

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Function to check if a value is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Function to validate the expiration date format
function validateAndParseExpiration(expiration) {
  const regex = /^(\d+y)?\s*(\d+m)?\s*(\d+d)?\s*(\d+h)?\s*(\d+m)?\s*(\d+s)?$/;
  if (!regex.test(expiration)) {
    return false;
  }
  
  let [_, y, mon, d, h, min, s] = expiration.match(regex);
  y = y ? parseInt(y) : 0;
  mon = mon ? parseInt(mon) : 0;
  d = d ? parseInt(d) : 0;
  h = h ? parseInt(h) : 0;
  min = min ? parseInt(min) : 0;
  s = s ? parseInt(s) : 0;

  if (y > 10 || mon > 12 || d > 30 || h > 24 || min > 60 || s > 60) {
    return false;
  }

  return { y, mon, d, h, min, s };
}

// Example message: "1y 30d 24h 60m 60s"
var expiration = message.trim();

var parsedExpiration = validateAndParseExpiration(expiration);

if (!parsedExpiration) {
  Bot.sendMessage("*❌ INVALID INPUT*\n_Expiration format must be valid and within specified limits: 10y, 12m, 30d, 24h, 60m, 60s._");
} else {
  const currentDate = new Date();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + parsedExpiration.y);
  expirationDate.setMonth(expirationDate.getMonth() + parsedExpiration.mon);
  expirationDate.setDate(expirationDate.getDate() + parsedExpiration.d);
  expirationDate.setHours(expirationDate.getHours() + parsedExpiration.h);
  expirationDate.setMinutes(expirationDate.getMinutes() + parsedExpiration.min);
  expirationDate.setSeconds(expirationDate.getSeconds() + parsedExpiration.s);

  const giftCardInfo = {
    value: Bot.getProperty("giftCardValue"),
    code: Bot.getProperty("giftCardCode"),
    redeemLimit: Bot.getProperty("redeemLimit"),
    dateCreated: currentDate,
    expirationDate: expirationDate
  };

  Bot.setProperty("giftCardInfo", giftCardInfo, "json");
  Bot.runCommand("/gift0");
}
