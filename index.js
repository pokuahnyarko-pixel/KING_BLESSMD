const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require("readline");
const config = require("./config");
const { sendWithTyping, react } = require("./lib/functions");
const { loadCommands } = require("./lib/commandHandler");
const { initAntiDelete } = require("./lib/antidelete");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,   // we'll use pairing code
    });

    // save credentials
    sock.ev.on('creds.update', saveCreds);

    // initialise anti‑delete (message cache)
    initAntiDelete(sock);

    // pairing code if not registered
    if (!state.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question("Enter your WhatsApp number (with country code, no +): ", async (number) => {
            rl.close();
            const phoneNumber = number.trim();
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(`🔑 Your pairing code is: ${code}`);
                console.log("Enter this code on WhatsApp (Linked Devices) to connect.");
            } catch (err) {
                console.error("Failed to get pairing code:", err);
            }
        });
    }

    // connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Bot connected!');
            config.botNumber = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
            console.log('Bot Number:', config.botNumber);
        }
    });

    // load command handler
    const commands = await loadCommands();
    const prefix = config.prefix;

    // message listener
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        // auto-react on every incoming message
        if (config.autoReact) {
            await react(sock, msg.key, '👀');   // you can make it dynamic
        }

        // anti‑delete handler (injected by antidelete.js)
        // note: actual anti‑delete logic is inside lib/antidelete.js

        // command detection
        if (text.startsWith(prefix)) {
            const args = text.slice(prefix.length).trim().split(/ +/);
            const cmd = args.shift().toLowerCase();
            if (commands.has(cmd)) {
                try {
                    await commands.get(cmd).execute(sock, msg, args, config);
                } catch (e) {
                    console.error(`Command ${cmd} error:`, e);
                    await sendWithTyping(sock, remoteJid, { text: `❌ Error executing ${cmd}` });
                }
            }
        } else {
            // free text – trigger auto‑reply (AI)
            const aiResponse = await getAutoReply(text);
            if (aiResponse) {
                await sendWithTyping(sock, remoteJid, { text: aiResponse });
            }
        }
    });
}

// simple AI auto‑reply engine (keyword based, extendable)
async function getAutoReply(message) {
    const msg = message.toLowerCase().trim();
    const replies = {
        'hi': 'Hello! 👋 I am KING_BLESS XMD, your personal assistant.',
        'hello': 'Hey there! How can I help?',
        'bye': 'Goodbye! Have a great day! 👋',
        'how are you': 'I am just a bot, but I am doing great! 😄',
        'menu': 'Use *.menu* to see all commands.',
    };
    // direct match
    if (replies[msg]) return replies[msg];
    // keyword match
    for (const [key, val] of Object.entries(replies)) {
        if (msg.includes(key)) return val;
    }
    return null; // no reply
}

startBot();
