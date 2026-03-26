const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO],
      subject: `Message from ${name}`,
      html: `
        <h3>New message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("EMAIL SENT:", data);
    res.json({ success: true });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});