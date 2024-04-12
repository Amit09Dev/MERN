import React, { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleClick = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div>
      <label htmlFor="email">Email:</label><br />
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <label htmlFor="password">Password:</label><br />
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <label htmlFor="confirmPassword">Confirm Password:</label><br />
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleClick}>Log Values</button>
    </div>
  );
}

export default MyForm;
