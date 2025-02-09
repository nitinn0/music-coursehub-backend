const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/talktous", async (req, res) => {
  const { name, email, phone, enquiry } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nitinkapoor117@gmail.com",
      pass: "vwsu fyyk stta qslx", 
    },
  });

  const mailOptions = {
    from: email,
    to: "nitinkapoor117@gmail.com", 
    subject: "New Enquiry from Contact Form",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Enquiry: ${enquiry}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ msg: "Your enquiry has been sent successfully." });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = router;
