import makeWASocket from "@whiskeysockets/baileys";
import { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { handleMessage } from "./handler.js";

let sock = null;

export async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("sessions/whatsapp");

  sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { qr, connection } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("📱 Scan le QR code");
    }

    if (connection === "open") {
      console.log("✅ Bot WhatsApp connecté !");
    }

    if (connection === "close") {
      console.log("❌ Bot WhatsApp déconnecté !");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    await handleMessage(sock, m);
  });

  return sock;
}

export function getSocket() {
  return sock;
}
