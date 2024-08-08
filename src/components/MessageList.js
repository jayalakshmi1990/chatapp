import React from 'react';

const MessageList = ({ messages }) => (
  <ul>
    {messages.map((message, index) => (
      <li key={index}>
        {message.content}
        {message.fileUrl && <img src={`http://localhost:5000${message.fileUrl}`} alt="Attachment" style={{ maxWidth: '200px', display: 'block' }} />}
      </li>
    ))}
  </ul>
);

export default MessageList;
