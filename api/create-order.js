const crypto = require("crypto");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const response = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 19900,
          currency: "INR",
          receipt: `receipt_${Date.now()}`
        })
      }
    );

    const order = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(order);
    }

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
      error: "Order creation failed"
    });
  }
};
