require('dotenv').config({
    path: 'settings.env',
});
const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
    token: process.env.API_TOKEN,
    name: process.env.BOT_NAME,
});

/**
 * Respond to the user
 */
function response(trigger) {
    switch (trigger) {
        case 'joke':
            axios.get('https://api.icndb.com/jokes/random').then(res => {
                const rsvp = res.data.value.joke;
                const params = {
                    icon_emoji: ':joy:',
                };
                bot.postMessageToChannel('general', rsvp, params);
            });
            break;
        case 'here':
            bot.postMessageToChannel('general', `Yes, I'm here!`);
            break;
        default:
            bot.postMessageToChannel('general', `I'm sorry. I don't understand :confused:`);
            break;
    }
}

/**
 * Show help message
 */
function showHelp() {
    const params = {
        icon_emoji: ':question:',
    };

    bot.postMessageToChannel('general', `Type @Baxter 'tell me a joke' to get a response`, params);
}

/**
 * Process the message from the user
 * @param {string} message
 */
function handleMessage(message) {
    if (message.includes(' tell me a joke')) {
        response('joke');
    } else if (message.includes(' help')) {
        showHelp();
    } else if (message.includes(' are you there')) {
        response('here');
    } else {
        response();
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
