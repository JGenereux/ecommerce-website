const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      //Array of current items is passed in so iterate through it returning a object
      //with the info about the item on the checkout page.
      line_items: req.body.cartItems.map((item) => {
        return {
          price_data: {
            currency: "cad",
            product_data: {
              name: item.name,
              images: [item.url],
            },
            unit_amount: item.price * 100, //converts to cents
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      //add success and cancel url
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
