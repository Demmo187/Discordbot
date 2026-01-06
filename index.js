require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const HEART = "❤️";

async function ensureHeart(thread) {
  try {
    const messages = await thread.messages.fetch({ limit: 1 });
    const firstMessage = messages.first();
    if (!firstMessage) return;

    const hasHeart = firstMessage.reactions.cache.some(r => r.emoji.name === HEART);
    if (!hasHeart) await firstMessage.react(HEART);

    console.log(`❤️ Herz gesetzt in Thread: ${thread.name}`);
  } catch (err) {
    console.error(`Fehler in Thread ${thread.name}:`, err.message);
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online als ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    const activeThreads = await guild.channels.fetchActiveThreads();
    for (const thread of activeThreads.threads.values()) {
      await ensureHeart(thread);
    }
  }
});

client.on(Events.ThreadCreate, thread => {
  setTimeout(() => ensureHeart(thread), 1000);
});

client.login(process.env.DISCORD_TOKEN);
