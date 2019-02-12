const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
    token: 'xoxb-319819101174-549476859751-QfoSM4bRuWpdVOkfXkuB3gQu',
    name: 'baxter',
});

/**
 * Respond to the user
 */
function response() {
    axios.get('https://api.icndb.com/jokes/random').then(res => {
        const rsvp = res.data.value.joke;
        const params = {
            icon_emoji: ':joy:',
        };

        bot.postMessageToChannel('general', rsvp, params);
    });
}

/**
 * Show help message
 */
function showHelp() {
    const params = {
        icon_emoji: ':question:',
    };

    bot.postMessageToChannel('general', `Type @Baxter 'beer' to get a response`, params);
}

/**
 * Process the message from the user
 * @param {string} message
 */
function handleMessage(message) {
    if (message.includes(' beer')) {
        response();
    } else if (message.includes(' help')) {
        showHelp();
    }
}

// Start Handler
// bot.on('start', () => {
//     const params = {};

//     bot.postMessageToChannel('general', 'Howdy!', params);
// });

// Error Handler
bot.on('error', err => console.log(err));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message' || data.subtype === 'bot_message') return;
    if (data.subtype === 'message_deleted') {
        // bot.postEphemeral('C9E0NA7BR', 'U9DQ32ZGE', '<@U9DQ32ZGE> has deleted a message');
        return;
    }

    console.log(data);
    handleMessage(data.text);
});
