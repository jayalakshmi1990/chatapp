import React, { useRef, useEffect } from 'react';

const ChatInput = ({ sendMessage }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      if (message.trim()) {
        sendMessage(message);
        inputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        placeholder="Type a message..."
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
