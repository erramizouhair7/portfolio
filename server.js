const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO],
      subject: `New Message from ${name}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    console.log('RESEND SUCCESS:', data);
    res.status(200).json({ msg: 'Message sent successfully!' });
  } catch (error) {
    console.error('RESEND ERROR FULL:', error);
    console.error('RESEND ERROR MESSAGE:', error.message);
    res.status(500).json({ msg: 'Failed to send message.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));