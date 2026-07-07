import {Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Jobs from './components/Jobs'
import SavedJobs from './components/SavedJobs'
import AppliedJobs from './components/AppliedJobs'
import JobItemDetails from './components/JobItemDetails'
import ProfilePage from './components/ProfilePage'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const App = () => (
  <Routes>
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/saved-jobs" element={<SavedJobs />} />
      <Route path="/applied-jobs" element={<AppliedJobs />} />
      <Route path="/jobs/:id" element={<JobItemDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route path="/not-found" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Routes>
)

export default App