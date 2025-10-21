import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <>
    
    <div className="not-found-container">
      <img
          src="/assets/jobby-app-not-found-img.png"
        alt="not found"
        className="not-found-img"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-description">
        We are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>
      <Link to="/">
        <button className="home-button" type="button">
          Home Page
        </button>
      </Link>
    </div>
  </>
)

export default NotFound