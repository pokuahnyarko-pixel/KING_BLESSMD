# KING_BLESSMD

---

7️⃣ RUN LOCALLY

1. Install dependencies: npm install
2. Place a valid menu.jpg inside assets/
3. Start: npm start
4. When prompted, enter your WhatsApp number with country code (no +). Example: 254712345678
5. You will receive a pairing code in the terminal.
      Open WhatsApp on your phone → Linked Devices → Link a Device → enter the code.
6. The bot connects instantly. Test by typing .menu in any chat.

---

8️⃣ DEPLOY ON KATABUMP

Katabump.com is a free hosting platform for WhatsApp bots.
Steps:

1. Create an account on https://katabump.com and log in.
2. Create a new Application:
   · Give it a name (e.g., king-bless-bot)
   · Choose Node.js as the runtime.
3. Upload your bot files:
   · You can connect a GitHub repository or upload a ZIP.
   · Required structure: the ZIP must contain all folders and files (index.js, commands/, assets/, config.js, package.json).
4. Environment Variables – none needed. The bot uses config.js.
5. Start Script: set to npm start (or node index.js).
6. Phone Number Input:
   · Katabump’s console will be accessible. When the bot starts, it will ask for the number once. Use the App Console to answer the prompt.
   · Or you can hardcode the number in config.js (set phoneNumber: '2547XXXXXXXX') before uploading.
7. Pairing Code: after entering the number, the code appears in the console. Use it to link your WhatsApp.
8. The bot stays online 24/7. Restart if needed from the dashboard.

⚠️ Note: Free Katabump instances may sleep after inactivity. Use an uptime monitor (like UptimeRobot) to ping a health endpoint or keep it alive by sending a message periodically.

---
