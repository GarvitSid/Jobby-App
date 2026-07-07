import {useEffect, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import Header from '../Header'
import API_BASE_URL from '../../api/config'
import Loader from '../common/Loader'
import ErrorState from '../common/ErrorState'
import '../Jobs/index.css'
import './index.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '../../lib/validationSchemas'

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

const updateProfile = async ({profileImageUrl, shortBio}) => {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({profile_image_url: profileImageUrl, short_bio: shortBio}),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error_msg || 'Failed to update profile')
  return data
}

const ProfilePage = () => {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { profileImageUrl: '', shortBio: '' },
  })

  const {data, isLoading, error} = useQuery({
    queryKey: ['profile-details'],
    queryFn: fetchProfile,
  })

  useEffect(() => {
    if (data) {
      reset({ profileImageUrl: data.profileImageUrl || '', shortBio: data.shortBio || '' })
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: res => {
      setMessage(res.message)
      queryClient.invalidateQueries({queryKey: ['profile']})
      queryClient.invalidateQueries({queryKey: ['profile-details']})
    },
    onError: err => {
      setMessage(err.message || 'Failed to update profile')
    },
  })

  const onSubmit = data => {
    setMessage('')
    mutation.mutate({ profileImageUrl: data.profileImageUrl, shortBio: data.shortBio })
  }

  return (
    <>
      <Header />
      <div className="collection-container profile-page-container">
        <h1 className="collection-heading">Edit Profile</h1>
        {isLoading ? (
          <Loader text="Loading profile..." />
        ) : error ? (
          <ErrorState message="Failed to load profile." />
        ) : (
          <div className="profile-layout">
            <div className="profile-preview-card">
                {(() => {
                  const profileImageSrc = watch('profileImageUrl') || data?.profileImageUrl || ''
                  const bioText = watch('shortBio') || data?.shortBio || ''
                  return (
                    <>
                      <img src={profileImageSrc || undefined} alt="profile" className="profile-preview-image" />
                      <h2 className="profile-preview-name">{data?.name}</h2>
                      <p className="profile-preview-bio">{bioText}</p>
                    </>
                  )
                })()}
              </div>
            <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="profileImageUrl">Profile Image URL</label>
              <input
                id="profileImageUrl"
                type="url"
                placeholder="https://example.com/avatar.png"
                {...register('profileImageUrl')}
              />
              {errors.profileImageUrl && <p className="field-error">{errors.profileImageUrl.message}</p>}
              <label htmlFor="shortBio">Short Bio</label>
              <textarea
                id="shortBio"
                rows="5"
                placeholder="Tell recruiters a little about yourself"
                {...register('shortBio')}
              />
              {errors.shortBio && <p className="field-error">{errors.shortBio.message}</p>}
              <button type="submit" className="profile-save-button" disabled={isSubmitting || mutation.isPending}>
                {mutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              {message !== '' && <p className="profile-message">{message}</p>}
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default ProfilePage