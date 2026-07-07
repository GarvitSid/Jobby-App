import './Loader.css'

const Loader = ({text = 'Loading...'}) => (
  <div className="loader-container" data-testid="loader">
    <p className="loader-text">{text}</p>
  </div>
)

export default Loader