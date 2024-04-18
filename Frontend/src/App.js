import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './Component/UserForm/UserForm.jsx';
import UserList from './Component/UserList/UserList.jsx';
import Login from './Component/login/login.jsx';
import Signup from './Component/signup/Signup.jsx';
import Form from './Component/DynamicFrom/Form.jsx';
import Activity from './Component/Activity/Activity';
import Page404 from './Component/Page404.jsx3';

function App() {

  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/userList" element={<UserList />} />
            <Route path="/userForm" element={<UserForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/form" element={<Form />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/userForm/:id" element={<UserForm />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
