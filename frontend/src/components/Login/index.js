import {useState} from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import API_BASE_URL from '../../api/config'
import './index.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../lib/validationSchemas'

const Login = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const onSubmitSuccess = () => {
    setIsAuthenticated(true)
    navigate('/', {replace: true})
  }

  const onSubmitFailure = message => {
    setShowSubmitError(true)
    setErrorMsg(message)
  }

  const submitForm = async data => {
    const userDetails = { username: data.username, password: data.password }
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(`${API_BASE_URL}/login`, options)
    const respData = await response.json()

    if (response.ok) {
      onSubmitSuccess()
    } else {
      onSubmitFailure(respData.error_msg)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleSubmit(submitForm)}>
        <img
          src="/assets/logo-img.png"
          alt="website logo"
          className="login-logo"
        />
        <h1 className="login-heading">Welcome Back</h1>
        <label htmlFor="username">USERNAME</label>
        <input type="text" id="username" {...register('username')} />
        {errors.username && <p className="field-error">{errors.username.message}</p>}

        <label htmlFor="password">PASSWORD</label>
        <input type="password" id="password" {...register('password')} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <Link to="/register" className="nav-link">
          Create a new account
        </Link>
      </form>
    </div>
  )
}

export default Login
