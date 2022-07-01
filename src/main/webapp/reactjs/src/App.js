import './App.css';

import React  from 'react';
import NavigationBar from './components/NavigationBar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import QuestionTable from './components/conversation/QuestionTable';
import AnswerTable from './components/conversation/AnswerTable';
import Login from './components/user/Login';
import Register from './components/user/Register';
import NotFound from './components/NotFound';

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
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Router> 
    </div>
  );
}

export default App;
