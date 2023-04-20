import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Discounts from './pages/Discounts';
import ForgotPassWord from './pages/ForgotPassWord';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from './pages/CreateListing';

function App() {
  return (
    <>
     <Router>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>

          {/* Authorized Login  */}
          <Route path='/profile' element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
          </Route>
          
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/forgot-password' element={<ForgotPassWord/>}/>
          <Route path='/discounts' element={<Discounts/>}/>
          <Route path='/create-listing' element={<CreateListing/>}/>
        </Routes>
     </Router>
     <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
      />
    </>
  );
}

export default App;
