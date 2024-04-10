import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './Component/UserForm/UserForm.jsx';
import UserList from './Component/UserData/UserList';
import Login from './Component/login/login.jsx';
import Signup from './Component/signup/Signup.jsx';
import axios from "axios";

function App() {
  axios.interceptors.request.use((request) => {
    console.log(request);
  })
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/userList" element={<UserList />} />
            <Route path="/userForm" element={<UserForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> .
            <Route path="/userForm/:id" element={<UserForm />} />
            <Route path="/" element={<UserForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
