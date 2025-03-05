import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./global/NavBar";
import LandingPage from './components/Landingpage';
import ManageUser from './components/ManageUser';
import AddUser from './components/AddUser';
import AdminDashboard from './components/AdminDashboard';
import ManageSurvey from './components/ManageSurvey';
import AddSurvey from './components/AddSurvey';
import OfficeSurvey from './components/OfficeSurvey';
import AdminLogin from './components/AdminLogin';
import EditUser from './components/EditUser';
import AddOffice from './components/AddOffice';
import ManageOffice from './components/ManageOffice';
import EditOffice from './components/EditOffice';


function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/clientsurvey" element={<LandingPage />} />
        <Route path="/add-survey" element={<AddSurvey />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/manageoffice" element={<ManageOffice />} />
        <Route path="/managesurvey" element={<ManageSurvey />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/add-office" element={<AddOffice />} />
        <Route path="/edit-office" element={<EditOffice />} />
        <Route path="/office/:officeId/survey/:surveyId" element={<OfficeSurvey />} />
      </Routes>
    </Router>
  );
}

export default App;
