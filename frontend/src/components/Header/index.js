import {Link, useLocation, useNavigate} from 'react-router-dom'
import API_BASE_URL from '../../api/config'
import './index.css'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {pathname} = location

  const onClickLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (e) {
      // No-op: client still navigates to login if network fails
    }
    navigate('/login', {replace: true})
  }

  const activeHomeClass = pathname === '/' ? 'active-link' : ''
  const activeJobsClass = pathname === '/jobs' ? 'active-link' : ''
  const activeSavedJobsClass = pathname === '/saved-jobs' ? 'active-link' : ''
  const activeAppliedJobsClass = pathname === '/applied-jobs' ? 'active-link' : ''
  const activeProfileClass = pathname === '/profile' ? 'active-link' : ''

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="mobile-nav-container">
          <Link to="/">
            <img
              className="website-logo-mobile"
              src="/assets/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="mobile-nav-menu">
            <li>
              <Link to="/" className={`mobile-icon-link ${activeHomeClass}`}>Home</Link>
            </li>
            <li>
              <Link to="/jobs" className={`mobile-icon-link ${activeJobsClass}`}>Jobs</Link>
            </li>
            <li>
              <Link to="/saved-jobs" className={`mobile-icon-link ${activeSavedJobsClass}`}>
                Saved
              </Link>
            </li>
            <li>
              <Link to="/applied-jobs" className={`mobile-icon-link ${activeAppliedJobsClass}`}>
                Applied
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`mobile-icon-link ${activeProfileClass}`}>
                Profile
              </Link>
            </li>
            <li>
              <button type="button" className="mobile-logout-btn" onClick={onClickLogout}>Logout</button>
            </li>
          </ul>
        </div>

        <div className="desktop-nav-container">
          <Link to="/">
            <img
              className="website-logo-desktop"
              src="/assets/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className={`nav-link ${activeHomeClass}`}>Home</Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/jobs" className={`nav-link ${activeJobsClass}`}>Jobs</Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/saved-jobs" className={`nav-link ${activeSavedJobsClass}`}>Saved Jobs</Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/applied-jobs" className={`nav-link ${activeAppliedJobsClass}`}>Applied Jobs</Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/profile" className={`nav-link ${activeProfileClass}`}>Profile</Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Header
