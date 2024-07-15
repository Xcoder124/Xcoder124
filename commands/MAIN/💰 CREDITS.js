/*CMD
  command: 💰 CREDITS
  help: 
  need_reply: false
  auto_retry_time: 
  folder: MAIN

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /partnerportfolio
  group: 
CMD*/

const balance = Libs.ResourcesLib.userRes("usd");
const conversionRate = 1;

// Function to convert balance to USD
function convertBalanceToUSD(balanceAmount) {
  return balanceAmount * conversionRate;
}

// Get the user's balance
const balanceAmount = balance.value();
const balanceInUSD = convertBalanceToUSD(balanceAmount);

// Format the amounts to 2 decimal places and add commas
const formattedBalance = balanceAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
const formattedBalanceInUSD = balanceInUSD.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

// Function to format transaction history
function formatTransactionHistory(transactions) {
  if (transactions.length === 0) {
    return "No transactions made.";
  }
  return transactions.slice(0, 10).map(transaction => {
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount)) {
      return `Invalid amount for transaction: ${transaction.type}`;
    }
    return `+💎${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ${transaction.type}`;
  }).join("\n");
}

// Retrieve combined transaction histories
function getCombinedTransactionHistory() {
  var transactions = User.getProperty("transactions", []);
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get transaction histories
const combinedHistory = getCombinedTransactionHistory();

// Format combined transaction histories
const formattedTransactionHistory = formatTransactionHistory(combinedHistory);

// Send a formatted message with balance and transaction details
const uploaderId = User.getProperty("freelancer");
// Check if the current user is the uploader
// Define the buttons array
const message1 = (
  "*BJSMasterSyntaxJavaBot*\n" +
  "👤 Profile Portfolio:\n" +
  "*💰Balance:* 💎" + formattedBalance + "\n\n" +
  "*📥 LATEST TRANSACTIONS:*\n" +
  formattedTransactionHistory + "\n\n_Old transactions may get deleted after reaching 10 max. transactions._"
);
var buttons = [
    { title: "Add Funds", command: "/addfunds" },
    { title: "Withdraw", command: "/withdraw" }
];
// Add the Convert button only if the user is the uploader
if (uploaderId) {
  buttons.push({ title: "Convert 💎", command: "/convert" });
}
Bot.sendInlineKeyboard(buttons, message1);
