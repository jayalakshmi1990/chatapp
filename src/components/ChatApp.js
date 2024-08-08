import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import FileUpload from './FileUpload';
import UserList from './UserList';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    const socket = io('http://localhost:5000', {
      query: { token },
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [token]);

  const sendMessage = (content) => {
    if (!selectedReceiver) {
      alert('Please select a receiver.');
      return;
    }

    const message = { content, receiver: selectedReceiver._id, fileUrl };
    axios.post('http://localhost:5000/api/messages', message, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessages((prevMessages) => [...prevMessages, message]);
    setFileUrl(null); // Reset file URL after sending the message
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileUrl(response.data.filePath);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <UserList users={users} selectedReceiver={selectedReceiver} setSelectedReceiver={setSelectedReceiver} />
      <MessageList messages={messages} />
      <FileUpload onFileUpload={uploadFile} />
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatApp;
