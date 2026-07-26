const config = require('../config');

// send a message after simulating 'composing' (typing)
async function sendWithTyping(sock, jid, content, delay = 1000) {
    if (config.autoTyping) {
        await sock.presenceSubscribe(jid);
        await sock.sendPresenceUpdate('composing', jid);
        await new Promise(res => setTimeout(res, delay));
        await sock.sendPresenceUpdate('paused', jid);
    }
    return sock.sendMessage(jid, content);
}

// react to a message
async function react(sock, key, emoji) {
    try {
        await sock.sendMessage(key.remoteJid, {
            react: { text: emoji, key: key }
        });
    } catch (e) {
        // ignore
    }
}

module.exports = { sendWithTyping, react };
