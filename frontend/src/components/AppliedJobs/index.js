import JobsCollectionPage from '../JobsCollectionPage'

const AppliedJobs = () => (
  <JobsCollectionPage
    title="Applied Jobs"
    endpoint="/applied-jobs"
    emptyTitle="No Applied Jobs"
    emptyMessage="Apply to jobs to see them listed here."
  />
)

export default AppliedJobs