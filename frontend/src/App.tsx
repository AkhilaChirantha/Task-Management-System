import { Route, BrowserRouter as Router, Routes,} from 'react-router-dom';
import Home from './pages/Home';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<RegistrationPage/>} />
        <Route path='/login' element={<LoginPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
