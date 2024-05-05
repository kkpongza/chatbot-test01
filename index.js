const express = require('express');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
dotenv.config();

    const config = {
        channelSecret: process.env.CHANNEL_SECRET,
    };
  
  // create LINE SDK client
  //console.log success when connected to line
  const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
  });

//   console.log(config);
//   console.log(client);
  
  // create Express app
  // about Express itself: https://expressjs.com/
  const app = express();

  // register a webhook handler with middleware
  // about the middleware, please refer to doc

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });


  app.post('/callback', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        console.log('error');
        res.status(500).end();
      });
  });
  
  // event handler
  function handleEvent(event) {
    console.log(event);
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }

    // create an echoing text message
    const echo = { type: 'text', text: event.message.text };

    // use reply API
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [echo],
    });
  }
  
  // listen on port
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });