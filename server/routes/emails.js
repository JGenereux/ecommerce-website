const router = require("express").Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SECRET,
  },
});

//just need a post request from the frontend
router.route("/").post(async (req, res) => {
  try {
    const newEmail = await req.body;
    const mailOptions = {
      from: process.env.EMAIL,
      to: newEmail.email,
      subject: newEmail.subject,
      text: newEmail.text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
      res.json("Email sent successfully");
    });
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
