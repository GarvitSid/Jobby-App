import React, {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {BiLinkExternal} from 'react-icons/bi'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {useParams} from 'react-router-dom'

import API_BASE_URL from '../../api/config'
import Header from '../Header'
import SkillsCard from '../SkillsCard'
import SimilarJobItem from '../SimilarJobItem'
import Loader from '../common/Loader'
import './index.css'

const fetchJob = async (jobId) => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch job')
  const data = await res.json()
  const job = data.job_details
  return {
    job: {
      companyLogoUrl: job.company_logo_url,
      companyWebsiteUrl: job.company_website_url,
      employmentType: job.employment_type,
      id: job.id || job._id,
      jobDescription: job.job_description,
      lifeAtCompany: {
        description: job.life_at_company.description,
        imageUrl: job.life_at_company.image_url,
      },
      location: job.location,
      packagePerAnnum: job.package_per_annum,
      rating: job.rating,
      skills: job.skills.map(s => ({ imageUrl: s.image_url, name: s.name })),
      isSaved: job.is_saved,
      isApplied: job.is_applied,
      title: job.title,
    },
    similarJobs: data.similar_jobs.map(s => ({
      companyLogoUrl: s.company_logo_url,
      employmentType: s.employment_type,
      id: s.id,
      jobDescription: s.job_description,
      location: s.location,
      rating: s.rating,
      title: s.title,
    }))
  }
}

const performAction = async ({jobId, action, isRemoval = false}) => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/${action}`, {
    method: isRemoval ? 'DELETE' : 'POST',
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_msg || 'Action failed')
  return data
}

const updateCollectionCache = (existingData, jobId, jobData, shouldAdd, collectionType) => {
  if (!existingData) {
    return existingData
  }

  const currentJobs = Array.isArray(existingData.jobs) ? existingData.jobs : []
  const nextJobs = shouldAdd
    ? currentJobs.some(eachJob => eachJob.id === jobId)
      ? currentJobs
      : [jobData, ...currentJobs]
    : currentJobs.filter(eachJob => eachJob.id !== jobId)

  const nextTotal = shouldAdd ? existingData.total + 1 : Math.max((existingData.total || 0) - 1, 0)

  return {
    ...existingData,
    jobs: nextJobs,
    total: nextTotal,
    meta: {
      ...existingData.meta,
      totalPages: shouldAdd
        ? existingData.meta.totalPages
        : existingData.meta.totalPages,
    },
  }
}

  // --- RENDER METHODS with full JSX and CSS Classes ---

const JobItemDetails = () => {
  const queryClient = useQueryClient()
  const {id: jobId} = useParams()

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJob(jobId),
    enabled: Boolean(jobId),
  })

  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const mutation = useMutation({
    mutationFn: performAction,
    onMutate: async variables => {
      const {jobId: actionJobId, action, isRemoval} = variables
      const jobQueryKey = ['job', actionJobId]

      await queryClient.cancelQueries({queryKey: jobQueryKey})
      await queryClient.cancelQueries({queryKey: ['/saved-jobs']})
      await queryClient.cancelQueries({queryKey: ['/applied-jobs']})

      const previousJobData = queryClient.getQueryData(jobQueryKey)
      const previousSavedJobs = queryClient.getQueriesData({queryKey: ['/saved-jobs']})
      const previousAppliedJobs = queryClient.getQueriesData({queryKey: ['/applied-jobs']})

      const nextIsRemoval = Boolean(isRemoval)
      const optimisticJob = previousJobData
        ? {
            ...previousJobData,
            job: {
              ...previousJobData.job,
              isSaved: action === 'save' ? !nextIsRemoval : previousJobData.job.isSaved,
              isApplied: action === 'apply' ? !nextIsRemoval : previousJobData.job.isApplied,
            },
          }
        : previousJobData

      if (optimisticJob) {
        queryClient.setQueryData(jobQueryKey, optimisticJob)
      }

      const jobCardData = previousJobData?.job
        ? {
            companyLogoUrl: previousJobData.job.companyLogoUrl,
            employmentType: previousJobData.job.employmentType,
            id: previousJobData.job.id,
            jobDescription: previousJobData.job.jobDescription,
            location: previousJobData.job.location,
            packagePerAnnum: previousJobData.job.packagePerAnnum,
            rating: previousJobData.job.rating,
            title: previousJobData.job.title,
          }
        : null

      if (jobCardData) {
        if (action === 'save') {
          queryClient.setQueriesData({queryKey: ['/saved-jobs']}, existingData =>
            updateCollectionCache(existingData, actionJobId, jobCardData, !nextIsRemoval, 'saved-jobs'),
          )
        }

        if (action === 'apply') {
          queryClient.setQueriesData({queryKey: ['/applied-jobs']}, existingData =>
            updateCollectionCache(existingData, actionJobId, jobCardData, !nextIsRemoval, 'applied-jobs'),
          )
        }
      }

      return {previousJobData, previousSavedJobs, previousAppliedJobs}
    },
    onError: (err, variables, context) => {
      if (context?.previousJobData) {
        queryClient.setQueryData(['job', variables.jobId], context.previousJobData)
      }

      context?.previousSavedJobs?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      context?.previousAppliedJobs?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      setActionError(err.message || 'Action failed')
      setActionMessage('')
    },
    onSuccess: res => {
      setActionMessage(res.message)
      setActionError('')
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['job', jobId]})
      queryClient.invalidateQueries({queryKey: ['/saved-jobs']})
      queryClient.invalidateQueries({queryKey: ['/applied-jobs']})
    },
  })

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          <Loader text="Loading job details..." />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          <div className="job-details-failure-view-container">
            <img
              src="/assets/failure-img.png"
              alt="failure view"
              className="failure-view-image"
            />
            <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
            <p className="failure-description">
              We cannot seem to find the page you are looking for.
            </p>
            <button
              type="button"
              className="job-item-retry-button"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    )
  }

  const { job, similarJobs } = data
  const {
    companyLogoUrl,
    companyWebsiteUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    lifeAtCompany,
    skills,
    isSaved,
    isApplied,
  } = job

  const onPerformAction = payload => mutation.mutate({jobId, ...payload})

  return (
    <>
      <Header />
      <div className="job-item-details-container">
        <div className="job-details-view-container">
          <div className="job-item">
            <div className="logo-title-location-container">
              <div className="logo-title-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{title}</h1>
                  <div className="rating-container">
                    <BsStarFill className="rating-icon" />
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
                    <BsFillBriefcaseFill className="brief-case-icon" />
                    <p className="employee-type-text">{employmentType}</p>
                  </div>
                </div>
                <p className="package-heading">{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="line" />
            <div className="description-visit-container">
              <h1 className="description-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                className="visit-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit <BiLinkExternal />
              </a>
            </div>
            <div className="job-actions-container">
              <button
                type="button"
                className={`job-action-button ${isSaved ? 'saved-active' : 'save-button'}`}
                onClick={() => onPerformAction({action: 'save', isRemoval: isSaved})}
                disabled={mutation.isPending}
              >
                {isSaved ? 'Unsave Job' : 'Save Job'}
              </button>
              <button
                type="button"
                className={`job-action-button ${isApplied ? 'applied-active' : 'apply-button'}`}
                onClick={() => onPerformAction({action: 'apply', isRemoval: isApplied})}
                disabled={mutation.isPending}
              >
                {isApplied ? 'Withdraw Application' : 'Apply Now'}
              </button>
            </div>
            {actionMessage !== '' && (
              <p className="action-message success-message">{actionMessage}</p>
            )}
            {actionError !== '' && (
              <p className="action-message error-message">{actionError}</p>
            )}
            <p className="description-text">{jobDescription}</p>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list">
              {skills.map(eachSkill => (
                <SkillsCard skillDetails={eachSkill} key={eachSkill.name} />
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-at-company-container">
              <p className="life-at-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(eachSimilarJob => (
              <SimilarJobItem jobDetails={eachSimilarJob} key={eachSimilarJob.id} />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default JobItemDetails