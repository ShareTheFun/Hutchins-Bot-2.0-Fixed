module.exports = {
    name: "confess",
    info: "Send an anonymous confession to a Facebook user",
    dev: "Jmlabaco",
    onPrefix: true,
    dmUser: false,
    nickName: ["confess", "cf"],
    usages: "[Your message | fb link or UID]",
    cooldowns: 5,

    onLaunch: async function ({ api, event, actions }) {
        const args = event.body.slice(event.body.indexOf(" ") + 1).split("|").map(item => item.trim());
        const text1 = args[0];
        let target = args[1];

        if (!text1 || !target) {
            return api.sendMessage("Wrong format\nUse: confess [your message | Facebook link or UID].", event.threadID);
        }

        try {
            // Check if input is a Facebook URL and extract UID
            if (target.includes("facebook.com")) {
                const urlMatch = target.match(/facebook\.com\/(profile\.php\?id=|)(\d+|[\w.]+)/);
                if (urlMatch) {
                    target = urlMatch[2];
                } else {
                    throw new Error("Invalid Facebook link");
                }
            }

            // Retrieve UID if target is a username
            const userId = isNaN(target) ? await api.getUID(target) : target;

            await api.sendMessage(`Someone has confessed to you!\n\nMessage: ${text1}`, userId);
            api.sendMessage("Confession sent successfully!", event.threadID);
        } catch (err) {
            api.sendMessage("Failed to send the confession. You may need to message them directly.", event.threadID);
        }
    }
};