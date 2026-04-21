import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyProfile from './pages/CompanyProfile'
import MyOffers from './pages/MyOffers'
import Applicants from './pages/Applicants'
import AdminDashboard from './pages/AdminDashboard'
import AdminValidations from './pages/AdminValidations'
import AdminStatistics from './pages/AdminStatistics'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'
import SearchOffers from './pages/SearchOffers'
import MyApplications from './pages/MyApplications'
import StudentLayout from './pages/StudentLayout'
import SavedOffers from './pages/SavedOffers'
import LandingPage from './pages/LandingPage'
import SuperAdminDashboard from "./pages/SuperAdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing page = home */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Company */}
        <Route path="/company/dashboard"  element={<CompanyDashboard />} />
        <Route path="/company/profile"    element={<CompanyProfile />} />
        <Route path="/company/offers"     element={<MyOffers />} />
        <Route path="/company/applicants" element={<Applicants />} />

        {/* Admin */}
        <Route path="/admin/dashboard"   element={<AdminDashboard />} />
        <Route path="/admin/validations" element={<AdminValidations />} />
        <Route path="/admin/statistics"  element={<AdminStatistics />} />

        {/* Student */}
        <Route path="/student/dashboard"    element={<StudentDashboard />} />
        <Route path="/student/profile"      element={<StudentProfile />} />
        <Route path="/student/offers"       element={<SearchOffers />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/layout"       element={<StudentLayout />} />
        <Route path="/student/saved"        element={<SavedOffers />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

        

      </Routes>
    </BrowserRouter>
  )
}

export default App