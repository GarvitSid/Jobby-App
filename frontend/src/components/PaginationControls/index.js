import './index.css'

const PaginationControls = ({page, totalPages, onPrevious, onNext}) => {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="pagination-container">
      <button
        type="button"
        className="pagination-button"
        onClick={onPrevious}
        disabled={page <= 1}
      >
        Previous
      </button>
      <p className="pagination-text">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        className="pagination-button"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  )
}

export default PaginationControls