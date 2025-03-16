import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login.components';
import { Register } from './components/Register.component';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<div>Welcome to Sandbox Proect</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 