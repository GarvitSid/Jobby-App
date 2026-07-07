const ErrorState = ({message = 'Something went wrong.', onRetry, retryLabel = 'Retry'}) => (
  <div className="jobs-failure-view">
    <p>{message}</p>
    {typeof onRetry === 'function' && (
      <button type="button" className="retry-button" onClick={onRetry}>
        {retryLabel}
      </button>
    )}
  </div>
)

export default ErrorState