import {keepPreviousData, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useEffect, useState} from 'react'
import Header from '../Header'
import JobCard from '../JobCard'
import PaginationControls from '../PaginationControls'
import API_BASE_URL from '../../api/config'
import Loader from '../common/Loader'
import ErrorState from '../common/ErrorState'
import '../Jobs/index.css'
import './index.css'

const PAGE_LIMIT = 2

const getRemoveActionPath = endpoint => {
  if (endpoint === '/saved-jobs') return 'save'
  if (endpoint === '/applied-jobs') return 'apply'
  return ''
}

const fetchJobCollection = async (endpoint, page) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}?page=${page}&limit=${PAGE_LIMIT}`, {
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Failed to fetch jobs')

  const data = await res.json()
  return {
    jobs: (data.jobs || []).map(job => ({
      companyLogoUrl: job.company_logo_url,
      employmentType: job.employment_type,
      id: job.id || job._id,
      jobDescription: job.job_description,
      location: job.location,
      packagePerAnnum: job.package_per_annum,
      rating: job.rating,
      title: job.title,
    })),
    total: data.total || 0,
    meta: {
      page: data.page || page,
      totalPages: data.total_pages || 1,
    },
  }
}

const removeJobFromCollection = async ({endpoint, jobId}) => {
  const actionPath = getRemoveActionPath(endpoint)
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/${actionPath}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error_msg || 'Failed to remove job')
  return data
}

const JobsCollectionPage = ({title, endpoint, emptyTitle, emptyMessage}) => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    setPage(1)
  }, [endpoint])

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: [endpoint, page],
    queryFn: () => fetchJobCollection(endpoint, page),
    placeholderData: keepPreviousData,
  })

  const removeMutation = useMutation({
    mutationFn: removeJobFromCollection,
    onMutate: async variables => {
      await queryClient.cancelQueries({queryKey: [variables.endpoint]})

      const previousQueries = queryClient.getQueriesData({queryKey: [variables.endpoint]})

      queryClient.setQueriesData({queryKey: [variables.endpoint]}, existingData => {
        if (!existingData) return existingData

        const nextJobs = Array.isArray(existingData.jobs)
          ? existingData.jobs.filter(job => job.id !== variables.jobId)
          : []

        return {
          ...existingData,
          jobs: nextJobs,
          total: Math.max((existingData.total || 0) - 1, 0),
        }
      })

      return {previousQueries}
    },
    onSuccess: res => {
      setActionMessage(res.message)
      setActionError('')
    },
    onError: (err, variables, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
      setActionError(err.message || 'Failed to remove job')
      setActionMessage('')
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [endpoint]})
    },
  })

  const totalPages = data?.meta?.totalPages || 1

  const goToPreviousPage = () => setPage(currentPage => Math.max(currentPage - 1, 1))

  const goToNextPage = () => setPage(currentPage => Math.min(currentPage + 1, totalPages))

  const renderLoader = () => <Loader text="Loading..." />

  const renderFailure = () => <ErrorState message="Failed to load jobs." onRetry={refetch} />

  const onRemoveJob = jobId => removeMutation.mutate({endpoint, jobId})

  const renderActionButton = jobId => (
    <button
      type="button"
      className="collection-remove-button"
      onClick={() => onRemoveJob(jobId)}
      disabled={removeMutation.isPending}
    >
      Remove
    </button>
  )

  const renderEmpty = () => (
    <div className="no-jobs-view">
      <img src="/assets/no-jobs-img.png" alt="no jobs" />
      <h1>{emptyTitle}</h1>
      <p>{emptyMessage}</p>
    </div>
  )

  return (
    <>
      <Header />
      <div className="collection-container">
        <h1 className="collection-heading">{title}</h1>
        {actionMessage !== '' && <p className="collection-message success-message">{actionMessage}</p>}
        {actionError !== '' && <p className="collection-message error-message">{actionError}</p>}
        {isLoading ? renderLoader() : error ? renderFailure() : (data?.jobs?.length || 0) === 0 ? renderEmpty() : <ul className="jobs-list">{data.jobs.map(job => <JobCard jobData={job} key={job.id} actionButton={renderActionButton(job.id)} />)}</ul>}
        {data?.jobs?.length > 0 && (
          <PaginationControls
            page={data?.meta?.page || page}
            totalPages={totalPages}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
          />
        )}
      </div>
    </>
  )
}

export default JobsCollectionPage