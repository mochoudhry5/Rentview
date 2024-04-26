const express = require('express');
const bodyParser = require('body-parser');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 8000;

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
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