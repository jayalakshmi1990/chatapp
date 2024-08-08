const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const { io } = require('../server');  // Assuming you export io from server.js

const router = express.Router();

// Send a message
router.post('/sendMessage', auth, async (req, res) => {
  const { content, receiver, fileUrl } = req.body;

  if (!content || !receiver) {
    return res.status(400).send('Content and receiver are required');
  }

  try {
    const message = new Message({
      sender: req.user.id,
      receiver,
      content,
      fileUrl
    });

    await message.save();

    io.to(receiver).emit('message', message);  // Emit message to the receiver's socket room

    res.status(200).send(message);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
