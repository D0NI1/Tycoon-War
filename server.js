const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔴 Directly define the Discord webhook URL
const discordWebhookURL = 'https://discord.com/api/webhooks/1340725278187716718/RBrvI6U4KAtkpWCue1J6nw9RYav79rK9z54_tkMYurx1AstidGuMWVoUTtwrH5PvRLgx';

app.use(cors()); 
app.use(bodyParser.json());

app.post('/checkout', async (req, res) => {
  const { items, total, robloxUsername, robloxDisplayName } = req.body;

  if (!items || !total || !robloxUsername || !robloxDisplayName) {
    return res.status(400).json({ success: false, error: 'Missing order details' });
  }

  const discordEmbed = {
    embeds: [
      {
        title: '> 💸 **New Order Received**',
        color: 0xff0000, 
        description: 'A new order has been placed!',
        thumbnail: { url: 'https://static.thenounproject.com/png/890166-200.png' },
        fields: [
          { name: '> **Roblox Username**', value: `> ${robloxUsername}`, inline: true },
          { name: '> **Roblox Display Name**', value: `> ${robloxDisplayName}`, inline: true },
          { name: '> **Total Amount**', value: `> **$${total.toFixed(2)}**`, inline: false },
          { name: '> **Items Purchased**', value: `> ${items.map(item => `- ${item.name} ($${item.price.toFixed(2)})`).join('\n> ')}`, inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Tycoon Wars Shop', icon_url: 'https://assets.tycoonwars.com/assets/icons/tycoon-wars-logo.svg' }
      }
    ]
  };

  try {
    await axios.post(discordWebhookURL, discordEmbed);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending to Discord:', error);
    res.status(500).json({ success: false, error: 'Discord webhook failed' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
