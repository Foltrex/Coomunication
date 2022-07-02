import './App.css';

import React  from 'react';
import NavigationBar from './components/NavigationBar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import QuestionTable from './components/conversation/question/QuestionTable';
import AnswerTable from './components/conversation/answer/AnswerTable';
import Login from './components/user/Login';
import Register from './components/user/Register';
import NotFound from './components/NotFound';
import EditUser from './components/user/EditUser';
import DeleteUser from './components/user/DeleteUser';

function App() {
  return (
    <div className='jumbotron'>
      <Router className="App">
        <Routes>
          <Route path='/' element={<NavigationBar />}>
            <Route index element={<QuestionTable />} />
            <Route path='questions' element={<QuestionTable />} />
            <Route path='answers' element={<AnswerTable />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='user'>
              <Route path='edit' element={<EditUser />} />
              <Route path='delete' element={<DeleteUser />} />
              <Route path='logout' element={<Login />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Router> 
    </div>
  );
}

export default App;
