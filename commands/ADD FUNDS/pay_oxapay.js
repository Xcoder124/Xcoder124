/*CMD
  command: pay_oxapay
  help: 
  need_reply: false
  auto_retry_time: 
  folder: ADD FUNDS

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Delete the last message
Api.deleteMessage({
  chat_id: user.telegramid,
  message_id: request.message.message_id
})
let depositAmount = User.getProperty("depositAmount")
  var conversionRate = 1000; 
  var totalDepositAmount = depositAmount / conversionRate;
if (depositAmount < 100) {
  Bot.sendMessage("*💱 OxaPay*\nThe minimum deposit are *$0.10*")
} else {
  // Generate a new order ID
  let newOrderId = Math.floor(Math.random() * 1000000)
  let OrderId = User.setProperty("OrderId", newOrderId, "string")
  // Make the API call to OxaPay
  Libs.OxaPayLib.apiCall({
    url: "merchants/request",
    fields: {
      merchant: "sandbox",
      amount: totalDepositAmount,
      onCallback: "/onCallbackPayment",
      orderId: OrderId
    },
    onSuccess: "/onCreatePaymentWithUSD"
  })
}

