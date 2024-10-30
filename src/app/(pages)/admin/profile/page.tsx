'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useImmer } from 'use-immer'

import { api } from '~/libs/trpc/react'
import { updateProfile } from '~/server/actions/updateProfile'

const photoPath = '/images/photos/default.svg'

export default function Profile() {
  const photoInput = useRef<HTMLInputElement>(null)
  const [formData, updateFormData] = useImmer({
    username: '',
    photo: photoPath,
    about: '',
    currentPassword: '',
    newPassword: '',
    confirmedPassword: '',
  })

  const [formState, formAction] = useFormState(updateProfile, [
    {
      path: [],
      message: '',
    },
  ])

  const { pending } = useFormStatus()

  const {
    data: profile,
    isFetching,
    isSuccess,
  } = api.users.getProfile.useQuery()

  const initFormData = useCallback(() => {
    updateFormData({
      username: profile?.name ?? '',
      photo: profile?.image ?? photoPath,
      about: profile?.about ?? '',
      currentPassword: '',
      newPassword: '',
      confirmedPassword: '',
    })
  }, [profile, updateFormData])

  useEffect(() => {
    if (isSuccess) {
      initFormData()
    }
  }, [isSuccess, profile, initFormData])

  return (
    <form action={formAction}>
      <div className='space-y-12 sm:space-y-16'>
        <div>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Profile
          </h2>
          <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-600'>
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className='mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0'>
            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                이메일
              </label>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={isFetching ? 'Loading...' : profile?.email}
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                필명
              </label>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    id='username'
                    name='username'
                    autoComplete='name'
                    value={isFetching ? 'Loading...' : formData.username}
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    onChange={e =>
                      updateFormData(profile => {
                        profile.username = e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6'>
              <label
                htmlFor='photo'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Photo
              </label>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                <div className='flex items-center gap-x-3'>
                  <Image
                    className='h-12 w-12 rounded-full bg-gray-50'
                    src={formData.photo}
                    alt=''
                    width={48}
                    height={48}
                    aria-hidden='true'
                    onError={e => {
                      e.currentTarget.src = photoPath
                    }}
                  />
                  <input
                    id='photo'
                    ref={photoInput}
                    name='photo'
                    type='file'
                    accept='image/*'
                    className='sr-only'
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.addEventListener('load', e => {
                          updateFormData(profile => {
                            profile.photo = e.target?.result as string
                          })
                        })
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <button
                    type='button'
                    className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    onClick={e => {
                      if (!photoInput.current) throw new Error('ref is null')
                      photoInput.current.click()
                    }}>
                    변경
                  </button>
                </div>
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <label
                htmlFor='about'
                className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                소개
              </label>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                <textarea
                  id='about'
                  name='about'
                  value={isFetching ? 'Loading...' : formData.about}
                  rows={3}
                  className='block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  onChange={e =>
                    updateFormData(profile => {
                      profile.about = e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <label
                htmlFor='currentPassword'
                className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                비밀번호 변경
              </label>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    id='currentPassword'
                    name='currentPassword'
                    type='password'
                    autoComplete='current-password'
                    value={formData.currentPassword}
                    placeholder='현재 비밀번호'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    onChange={e =>
                      updateFormData(profile => {
                        profile.currentPassword = e.target.value
                      })
                    }
                  />
                </div>
                {formState.map(({ path, message }) => {
                  const err = path.some(v => {
                    return ['currentPassword'].includes(v)
                  })

                  if (!err) return
                  return (
                    <p
                      key={path.toString()}
                      className='mt-3 text-sm leading-6 text-red-500'>
                      {message}
                    </p>
                  )
                })}

                <div className='mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:mt-6 sm:max-w-md'>
                  <input
                    id='newPassword'
                    name='newPassword'
                    type='password'
                    autoComplete='new-password'
                    value={formData.newPassword}
                    placeholder='새 비밀번호'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    onChange={e =>
                      updateFormData(profile => {
                        profile.newPassword = e.target.value
                      })
                    }
                  />
                </div>
                {formState.map(({ path, message }) => {
                  const err = path.some(v => {
                    return ['newPassword'].includes(v)
                  })

                  if (!err) return
                  return (
                    <p
                      key={path.toString()}
                      className='mt-3 text-sm leading-6 text-red-500'>
                      {message}
                    </p>
                  )
                })}

                <div className='mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:mt-6 sm:max-w-md'>
                  <input
                    id='confirmedPassword'
                    name='confirmedPassword'
                    type='password'
                    autoComplete='new-password'
                    value={formData.confirmedPassword}
                    placeholder='새 비밀번호 확인'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    onChange={e => {
                      updateFormData(profile => {
                        profile.confirmedPassword = e.target.value
                      })
                    }}
                  />
                </div>
                {formState.map(({ path, message }) => {
                  const err = path.some(v => {
                    return ['confirmedPassword'].includes(v)
                  })

                  if (!err) return
                  return (
                    <p
                      key={path.toString()}
                      className='mt-3 text-sm leading-6 text-red-500'>
                      {message}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='reset'
          className='text-sm font-semibold leading-6 text-gray-900'
          aria-disabled={pending}
          onClick={() => {
            initFormData()
          }}>
          입력 취소
        </button>
        <button
          className='inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          aria-disabled={pending}>
          저장
        </button>
      </div>
    </form>
  )
}
