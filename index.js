const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Sentiment = require('sentiment');
const keypress = require('keypress');

const client = new Client({
    authStrategy: new LocalAuth()
});
const sentiment = new Sentiment();
keypress(process.stdin);

var results = []

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client ' + client.info.pushname + ' is ready!');
    console.log('Positive/negative sentiment score corresponds to positive/negative sentiment')
    console.log('Press the `r` key to view results of all received messages\n')
});

// listening to all incoming messages
client.on('message_create', async message => {
    if (!contact_from.isMe) {
        console.log(message.body);

        let contact_from = await message.getContact();
        // var contact_name = contact_from.pushname;
        var contact_number = contact_from.number;

        // perform sentiment analysis on each msg received
        var result = sentiment.analyze(message.body);
        console.log("sentiment score: " + result["comparative"]);

        results.push({
            'message': message.body,
            'score': result['comparative'],
            // 'from_name': contact_name,
            'from_number': contact_number,
            
        });
    }
});

client.initialize();

process.stdin.on('keypress', function (ch, key) {
    if (key && key.name == 'r') {
        console.log(results);
    } else if (key && key.ctrl && key.name == 'c') {
        process.exit(0);
    }
});
   
process.stdin.setRawMode(true);
process.stdin.resume();