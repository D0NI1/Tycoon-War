const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({
  origin: 'https://d0ni1.github.io/Tycoon-War', // Replace with your frontend domain
  credentials: true, // Allow cookies and credentials
}));
// Discord Webhook URL (replace with your actual webhook URL)
const discordWebhookURL = 'https://discord.com/api/webhooks/1340725278187716718/RBrvI6U4KAtkpWCue1J6nw9RYav79rK9z54_tkMYurx1AstidGuMWVoUTtwrH5PvRLgx';

// Handle checkout API
app.post('/checkout', async (req, res) => {
  const { items, total, robloxUsername, robloxDisplayName } = req.body;

  // Simulate successful payment (for testing)
  const paymentSuccessful = true;

  if (paymentSuccessful) {
    // Create a Discord embed message with order details
    const discordEmbed = {
      embeds: [
        {
          title: '> 💸 **New Order Received**',
          color: 0xff0000, // Red color
          description: 'A new order has been placed!',
          thumbnail: {
            url: 'https://static.thenounproject.com/png/890166-200.png', // Thumbnail image URL
          },
          fields: [
            {
              name: '> **Roblox Username**',
              value: `> ${robloxUsername}`,
              inline: true,
            },
            {
              name: '> **Roblox Display Name**',
              value: `> ${robloxDisplayName}`,
              inline: true,
            },
            {
              name: '> **Total Amount**',
              value: `> **$${total.toFixed(2)}**`,
              inline: false,
            },
            {
              name: '> **Items Purchased**',
              value: `> ${items.map(item => `- ${item.name} ($${item.price.toFixed(2)})`).join('\n> ')}`,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Tycoon Wars Shop',
            icon_url: 'https://assets.tycoonwars.com/assets/icons/tycoon-wars-logo.svg', // Replace with your logo URL
          },
        },
      ],
    };

    try {
      // Send the embed message to Discord
      await axios.post(discordWebhookURL, discordEmbed);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending message to Discord:', error);
      res.status(500).json({ success: false, error: 'Discord message failed' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Payment failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
