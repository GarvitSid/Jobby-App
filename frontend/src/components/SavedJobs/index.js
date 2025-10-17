import JobsCollectionPage from '../JobsCollectionPage'

const SavedJobs = () => (
  <JobsCollectionPage
    title="Saved Jobs"
    endpoint="/saved-jobs"
    emptyTitle="No Saved Jobs"
    emptyMessage="Save jobs from the Jobs page to keep them here."
  />
)

export default SavedJobs