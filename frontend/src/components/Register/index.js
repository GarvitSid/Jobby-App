import {useState} from 'react'
import {Link} from 'react-router-dom'
import API_BASE_URL from '../../api/config'
import './index.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../lib/validationSchemas'

const Register = () => {
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const submitForm = async data => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username: data.username, password: data.password }),
    }

    const response = await fetch(`${API_BASE_URL}/register`, options)
    const respData = await response.json()

    if (response.ok) {
      setMsg('Success! You can now log in.')
      setIsError(false)
    } else {
      setMsg(respData.error_msg)
      setIsError(true)
    }
  }

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleSubmit(submitForm)}>
        <img
          src="/assets/logo-img.png"
          alt="website logo"
          className="login-logo"
        />
        <h1 className="register-heading">Create Account</h1>
        <label htmlFor="username">USERNAME</label>
        <input type="text" id="username" {...register('username')} />
        {errors.username && <p className="field-error">{errors.username.message}</p>}
        <label htmlFor="password">PASSWORD</label>
        <input type="password" id="password" {...register('password')} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
        <button type="submit" className="login-button">
          Register
        </button>
        <p className={isError ? 'error-message' : 'success-message'}>{msg}</p>
        <Link
          to="/login"
          className="nav-link"
          style={{textAlign: 'center', display: 'block', marginTop: '10px'}}
        >
          Go to Login
        </Link>
      </form>
    </div>
  )
}

export default Register