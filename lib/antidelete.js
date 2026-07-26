const messageCache = new Map();

function initAntiDelete(sock) {
    // cache every incoming message
    sock.ev.on('messages.upsert', ({ messages }) => {
        for (const msg of messages) {
            if (msg.message && !msg.key.fromMe) {
                // store full message object
                messageCache.set(msg.key.id, { key: msg.key, message: msg.message, timestamp: Date.now() });
            }
            // detect deletion (protocolMessage with type REVOKE)
            if (msg.message?.protocolMessage?.type === 1) {
                const deletedKeyId = msg.key.id; // the id of the deletion notice itself?
                // better: the original message id is inside protocolMessage.key
                const origId = msg.message.protocolMessage.key?.id;
                if (origId && messageCache.has(origId)) {
                    const cached = messageCache.get(origId);
                    const jid = cached.key.remoteJid;
                    const text = cached.message?.conversation || cached.message?.extendedTextMessage?.text || 'Media/Sticker';
                    sock.sendMessage(jid, {
                        text: `⚠️ *Anti-Delete Detected!*\n\n📩 Message: ${text}`
                    });
                    messageCache.delete(origId);
                }
            }
        }
    });

    // cleanup old cache entries every 10 minutes
    setInterval(() => {
        const now = Date.now();
        for (const [id, data] of messageCache.entries()) {
            if (now - data.timestamp > 600000) messageCache.delete(id);
        }
    }, 600000);
}

module.exports = { initAntiDelete };
