const express = require('express');
const bodyParser = require('body-parser');
const StreamChat = require('stream-chat').StreamChat;
const app = express();
const PORT = process.env.PORT || 8000;
const api_key = 'pn73rx5c7g26'
const api_secret = 's7ja2gvepjzzhc7yny62kg2pew8ba2fumnzr54u95xaba8hacw2fx7yj63sgvzh3'
const serverClient = StreamChat.getInstance( api_key, api_secret);

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/api/data', function(req, res) {
    console.log('receiving data ...');
    const token = serverClient.createToken(req.body.userId);
    res.send(token);
});