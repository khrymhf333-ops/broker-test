const express = require('express');
const app = express();
app.use(express.json());

let users = {
  "user123": { balance: 0, name: "کاربر تستی" }
};

let deposits = {};

app.post('/api/deposit-request', (req, res) => {
  const { userId, amount } = req.body;
  const invoiceId = "INV-" + Date.now();
  deposits[invoiceId] = { userId, amount, status: "pending" };
  res.json({ success: true, invoiceId: invoiceId });
});

app.post('/api/payment-callback', (req, res) => {
  const { invoiceId, status, amount } = req.body;
  if (status === "success") {
    const deposit = deposits[invoiceId];
    if (deposit) {
      users[deposit.userId].balance += parseFloat(amount);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invoice not found" });
    }
  }
});

app.get('/api/balance/:userId', (req, res) => {
  res.json(users[req.params.userId]);
});

app.get('/', (req, res) => {
  res.send('سرور تستی فعال است');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
