import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Discounts from './pages/Discounts';
import ForgotPassWord from './pages/ForgotPassWord';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Header from './components/Header';

function App() {
  return (
    <>
     <Router>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-out' element={<SignOut/>}/>
          <Route path='/forgot-password' element={<ForgotPassWord/>}/>
          <Route path='/discounts' element={<Discounts/>}/>
        </Routes>
     </Router>
    </>
  );
}

export default App;
