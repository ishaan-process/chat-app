const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusherConfig = require('./pusher.json');
const pusherClient = new Pusher(pusherConfig);

const app = express();
app.use(bodyParser.json());

app.put('/users/:name', function(req,res){
    const { name } = req.params;
    console.log('User joined: ' + name);
    pusherClient.trigger('chat_channel', 'join',{
            name: name
    });
    res.sendStatus(204)
})

app.delete('/users/:name', function(req,res){
    const { name } = req.params;
    console.log('User left: ' + name);
    pusherClient.trigger('chat_channel', 'part',{
        name: name
    });
    res.sendStatus(204);
})

app.post('/users/:name/messages', function(req, res) { 
    const { name, message } = req.params;
    console.log('User ' + req.params.name + ' sent message: ' + req.body.message);
    pusherClient.trigger('chat_channel', 'message', {
        name: name,
        message: message
    });
    res.sendStatus(204);
});

app.listen(4000, function() { 
    console.log('App listening on port 4000');
});