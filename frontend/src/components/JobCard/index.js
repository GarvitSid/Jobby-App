import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = props => {
  const {jobData, actionButton = null} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="link-item job-card-link">
        <div className="logo-title-location-container">
          <div className="logo-title-container">
            <img src={companyLogoUrl} alt="company logo" className="company-logo" />
            <div className="title-rating-container">
              <h1 className="title-heading">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-employee-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location-text">{location}</p>
              </div>
              <div className="employee-type-container">
                <BsBriefcaseFill className="brief-case-icon" />
                <p className="employee-type-text">{employmentType}</p>
              </div>
            </div>
            <p className="package-heading">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="line" />
        <div className="description-container">
          <h1 className="description-heading">Description</h1>
          <p className="description-text">{jobDescription}</p>
        </div>
      </Link>
      {actionButton ? <div className="job-card-action-container">{actionButton}</div> : null}
    </li>
  )
}

export default JobCard