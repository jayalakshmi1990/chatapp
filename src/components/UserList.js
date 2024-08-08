import React from 'react';

const UserList = ({ users, selectedReceiver, setSelectedReceiver }) => {
  return (
    <div>
      <h3>Select Receiver:</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedReceiver(user)}
            style={{ cursor: 'pointer', color: user.id === selectedReceiver?.id ? 'blue' : 'black' }}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
