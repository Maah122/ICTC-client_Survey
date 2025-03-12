import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { getUserFromToken } from './utils/auth';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/Landingpage';
import OfficeSurvey from './components/OfficeSurvey';
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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUserFromToken();

  if (!user) return <Navigate to="/" />; // not logged in
  if (!allowedRoles.includes(user.user_rights)) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["Admin", "View all", "Limited"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Admin-only routes */}
        <Route path="/add" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <FormsBuilder />
          </ProtectedRoute>
        } />
        <Route path="/add-survey" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddSurvey />
          </ProtectedRoute>
        } />
        <Route path="/manageuser" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageUser />
          </ProtectedRoute>
        } />
        <Route path="/add-user" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddUser />
          </ProtectedRoute>
        } />
        <Route path="/edit-user" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditUser />
          </ProtectedRoute>
        } />
        <Route path="/managesurvey" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageSurvey />
          </ProtectedRoute>
        } />
        <Route path="/edit-survey" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditSurvey />
          </ProtectedRoute>
        } />
        <Route path="/manageoffice" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageOffice />
          </ProtectedRoute>
        } />
        <Route path="/add-office" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddOffice />
          </ProtectedRoute>
        } />
        <Route path="/edit-office" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditOffice />
          </ProtectedRoute>
        } />

        {/* Public-facing */}
        <Route path="/clientsurvey" element={<LandingPage />} />
        <Route path="/office/:officeId/survey/:surveyId" element={<OfficeSurvey />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;