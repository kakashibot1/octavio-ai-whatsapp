const { askAI } = require("../ai/aiClient");

module.exports = async (sock, m) => {
  const msg = m.messages[0];

  if (!msg.message || msg.key.fromMe) return;

  const text = msg.message.conversation || "";

  console.log("📩 Message:", text);

  const reply = await askAI(text);

  await sock.sendMessage(msg.key.remoteJid, { text: reply });
};
