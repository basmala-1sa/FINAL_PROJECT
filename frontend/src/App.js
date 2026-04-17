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

import StudentDashboard  from './pages/StudentDashboard'
import StudentProfile    from './pages/StudentProfile'
import SearchOffers      from './pages/SearchOffers'
import MyApplications    from './pages/MyApplications'
import StudentLayout     from './pages/StudentLayout'

import SavedOffers from './pages/SavedOffers';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/company/dashboard"  element={<CompanyDashboard />} />
        <Route path="/company/profile"    element={<CompanyProfile />} />
        <Route path="/company/offers"     element={<MyOffers />} />
        <Route path="/company/applicants" element={<Applicants />} />

        <Route path="/admin/dashboard"   element={<AdminDashboard />} />
        <Route path="/admin/validations" element={<AdminValidations />} />
        <Route path="/admin/statistics"  element={<AdminStatistics />} />
        <Route path="/student/dashboard"  element={<StudentDashboard />} />

        <Route path="/student/dashboard"    element={<StudentDashboard />} />
        <Route path="/student/profile"   element={<StudentProfile />} />
        <Route path="/student/offers"       element={<SearchOffers />}     />
        <Route path="/student/applications" element={<MyApplications />}   />
        <Route path="/student/layout" element={<StudentLayout />}   />

        <Route path="/student/saved" element={<SavedOffers />} />


        
      </Routes>
    </BrowserRouter>
  )
}

export default App



