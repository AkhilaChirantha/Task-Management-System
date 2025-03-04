import { Route, BrowserRouter as Router, Routes,} from 'react-router-dom';
import Home from './pages/Home';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import TaskFormPage from './pages/TaskFormPage';
import TaskList from './pages/TaskList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<RegistrationPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
        <Route path='/taskform/create' element={<TaskFormPage/>} />
        <Route path='/tasks' element={<TaskList/>} />
        <Route path='/tasks/update/:taskId' element={<TaskFormPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
