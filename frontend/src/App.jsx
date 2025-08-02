import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";
import IssueDetail from "./components/IssueDetail";
import MapView from "./components/MapView";
import Mapi from "./components/Mapi"
import AdminDashboard from "./components/AdminDashboard";
import { LocationProvider } from "./contexts/LocationContext";
import "./App.css";

function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="App">
          <Routes>
          
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
            <Route path="/map" element={<Mapi />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;