import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {keepPreviousData, useQuery} from '@tanstack/react-query'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobCard from '../JobCard'
import PaginationControls from '../PaginationControls'
import API_BASE_URL from '../../api/config'
import Loader from '../common/Loader'
import ErrorState from '../common/ErrorState'
import useDebounce from '../../hooks/useDebounce'
import './index.css'

const employmentTypesList = ['FULLTIME', 'PARTTIME', 'FREELANCE', 'INTERNSHIP']
const PAGE_LIMIT = 2
const salaryRangesList = [
  {label: '10 LPA and above', value: '1000000'},
  {label: '20 LPA and above', value: '2000000'},
  {label: '30 LPA and above', value: '3000000'},
  {label: '40 LPA and above', value: '4000000'},
]

const fetchProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  const data = await res.json()
  return {
    name: data.profile_details.name,
    profileImageUrl: data.profile_details.profile_image_url,
    shortBio: data.profile_details.short_bio,
  }
}

const fetchJobs = async ({queryKey}) => {
  const [_key, {employmentTypes, minimumPackage, search, page}] = queryKey
  const employmentTypeParam = (employmentTypes || []).join(',')
  const url = `${API_BASE_URL}/jobs?employment_type=${employmentTypeParam}&minimum_package=${minimumPackage || ''}&search=${encodeURIComponent(search || '')}&page=${page}&limit=${PAGE_LIMIT}`
  const res = await fetch(url, {credentials: 'include'})
  if (!res.ok) throw new Error('Failed to fetch jobs')
  const data = await res.json()
  const updatedJobs = data.jobs.map(job => ({
    companyLogoUrl: job.company_logo_url,
    employmentType: job.employment_type,
    id: job.id || job._id,
    jobDescription: job.job_description,
    location: job.location,
    packagePerAnnum: job.package_per_annum,
    rating: job.rating,
    title: job.title,
  }))
  return { jobs: updatedJobs, meta: { total: data.total, page: data.page, totalPages: data.total_pages } }
}

function Jobs() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([])
  const [activeSalaryRangeId, setActiveSalaryRangeId] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchInput, activeEmploymentTypes, activeSalaryRangeId])

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })

  const jobsQueryKey = ['jobs', {
    employmentTypes: activeEmploymentTypes,
    minimumPackage: activeSalaryRangeId,
    search: debouncedSearchInput,
    page,
  }]
  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: jobsQueryKey,
    queryFn: fetchJobs,
    placeholderData: keepPreviousData,
  })

  const onChangeSearchInput = event => setSearchInput(event.target.value)

  const toggleEmploymentType = employmentType => {
    setActiveEmploymentTypes(prev => prev.includes(employmentType) ? prev.filter(t => t !== employmentType) : [...prev, employmentType])
  }

  const onChangeSalaryRange = event => setActiveSalaryRangeId(event.target.value)

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      setPage(1)
      refetchJobs()
    }
  }

  const totalPages = jobsData?.meta?.totalPages || 1

  const goToPreviousPage = () => setPage(currentPage => Math.max(currentPage - 1, 1))

  const goToNextPage = () => setPage(currentPage => Math.min(currentPage + 1, totalPages))

  const renderProfileSuccessView = () => {
    if (!profileData) return null
    return (
      <Link to="/profile" className="profile-card-link" aria-label="Go to profile page">
        <div className="profile-card">
          <img
            src={profileData.profileImageUrl}
            alt="profile"
            className="profile-image"
          />
          <h1 className="profile-name">{profileData.name}</h1>
          <p className="profile-bio">{profileData.shortBio}</p>
        </div>
      </Link>
    )
  }

  const renderProfileFailureView = () => (
    <ErrorState message="Unable to load profile" onRetry={refetchProfile} />
  )

  const renderProfileSection = () => {
    if (profileLoading) {
      return <Loader text="Loading profile..." />
    }
    if (profileError) return renderProfileFailureView()
    return renderProfileSuccessView()
  }

  const renderFiltersGroup = () => {
    return (
      <>
        <div className="filters-group">
          <h1 className="filter-heading">Type of Employment</h1>
          <ul className="filter-list">
            {employmentTypesList.map(type => (
              <li key={type} className="filter-item">
                <input
                  type="checkbox"
                  id={type}
                  checked={activeEmploymentTypes.includes(type)}
                  onChange={() => toggleEmploymentType(type)}
                />
                <label htmlFor={type}>{type}</label>
              </li>
            ))}
          </ul>
        </div>
        <hr className="separator" />
        <div className="filters-group">
          <h1 className="filter-heading">Salary Range</h1>
          <ul className="filter-list">
            {salaryRangesList.map(range => (
              <li key={range.value} className="filter-item">
                <input
                  type="radio"
                  id={range.value}
                  name="salaryRange"
                  value={range.value}
                  checked={activeSalaryRangeId === range.value}
                  onChange={onChangeSalaryRange}
                />
                <label htmlFor={range.value}>{range.label}</label>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  const renderJobsList = () => {
    const jobsList = jobsData?.jobs || []
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-view">
          <img src="/assets/no-jobs-img.png" alt="no jobs" />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(job => <JobCard jobData={job} key={job.id} />)}
      </ul>
    )
  }

  const renderLoader = () => <Loader text="Loading jobs..." />

  const renderJobsStatus = () => {
    if (jobsLoading) return renderLoader()
    if (jobsError) {
      return <ErrorState message="Failed to load jobs." onRetry={refetchJobs} />
    }
    return renderJobsList()
  }

  return (
    <>
      <Header />
      <div className="jobs-container">
        <div className="sidebar">
          {renderProfileSection()}
          <hr className="separator" />
          {renderFiltersGroup()}
        </div>
        <div className="jobs-display-container">
          <div className="search-input-container">
            <input type="search" value={searchInput} onChange={onChangeSearchInput} onKeyDown={onEnterSearchInput} placeholder="Search" />
            <button type="button" data-testid="searchButton" onClick={refetchJobs}>
              <BsSearch className="search-icon" />
            </button>
          </div>
          {renderJobsStatus()}
          {jobsData?.jobs?.length > 0 && (
            <PaginationControls
              page={jobsData?.meta?.page || page}
              totalPages={totalPages}
              onPrevious={goToPreviousPage}
              onNext={goToNextPage}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Jobs