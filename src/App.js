import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./global/NavBar";
import LandingPage from './components/Landingpage';
import OfficeSurvey from './components/OfficeSurvey';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import FormsBuilder from './components/formbuilder';
import AddSurvey from './components/AddSurvey';
import ManageUser from './components/ManageUser';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
import ManageSurvey from './components/ManageSurvey';
import EditSurvey from './components/EditSurvey';
import ManageOffice from './components/ManageOffice';
import AddOffice from './components/AddOffice';
import EditOffice from './components/EditOffice';
function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/clientsurvey" element={<LandingPage />} />
        <Route path="/office/:officeId/survey/:surveyId" element={<OfficeSurvey />} />
        <Route path="/add" element={<FormsBuilder />} />
        <Route path="/add-survey" element={<AddSurvey />} />
        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/managesurvey" element={<ManageSurvey />} />
        <Route path="/edit-survey" element={<EditSurvey />} />
        <Route path="/manageoffice" element={<ManageOffice />} /> 
        <Route path="/add-office" element={<AddOffice />} />
        <Route path="/edit-office" element={<EditOffice />} />
      </Routes>
    </Router>
  );
}

export default App;