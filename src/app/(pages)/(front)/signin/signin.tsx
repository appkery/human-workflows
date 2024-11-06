'use client'

import Image from 'next/image'
import { useFormState, useFormStatus } from 'react-dom'
import { useImmer } from 'use-immer'

import { authenticate } from '~/server/actions/authenticate'

export default function SignIn() {
  const [formData, updateFormData] = useImmer({
    provider: '',
    email: '',
    password: '',
    rememberEmail: false,
  })

  const [formState, formAction] = useFormState(authenticate, [
    {
      path: [],
      message: '',
    },
  ])

  const { pending } = useFormStatus()

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            로그인
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
          <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
            <form action={formAction} className='space-y-6'>
              <input type='hidden' name='provider' value={formData.provider} />
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  이메일
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    value={formData.email}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    onChange={e => {
                      updateFormData(data => {
                        data.email = e.target.value
                      })
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  비밀번호
                </label>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    value={formData.password}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    onChange={e => {
                      updateFormData(data => {
                        data.password = e.target.value
                      })
                    }}
                    required
                  />
                  {formState.map(({ path, message }) => {
                    const err = path.some(v => {
                      return ['CredentialsSignin'].includes(v)
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

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-email'
                    name='remember-email'
                    type='checkbox'
                    checked={formData.rememberEmail}
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    onChange={e => {
                      updateFormData(data => {
                        data.rememberEmail = e.target.checked
                      })
                    }}
                  />
                  <label
                    htmlFor='remember-email'
                    className='ml-3 block text-sm leading-6 text-gray-900'>
                    기억하기
                  </label>
                </div>
              </div>

              <div>
                <button
                  className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  aria-disabled={pending}
                  onClick={e => {
                    updateFormData(data => {
                      data.provider = 'credentials'
                    })
                  }}>
                  로그인
                </button>
              </div>
            </form>

            <div>
              <div className='relative mt-10'>
                <div
                  className='absolute inset-0 flex items-center'
                  aria-hidden='true'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm font-medium leading-6'>
                  <span className='bg-white px-6 text-gray-900'>
                    또는 로그인 링크 전송
                  </span>
                </div>
              </div>

              <form className='space-y-6' action={formAction}>
                <input
                  type='hidden'
                  name='provider'
                  value={formData.provider}
                />
                <div>
                  <label
                    htmlFor='email-link'
                    className='block text-sm font-medium leading-6 text-gray-900'>
                    이메일
                  </label>
                  <div className='mt-2'>
                    <input
                      id='email-link'
                      name='email'
                      type='email'
                      autoComplete='email'
                      value={formData.email}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      onChange={e => {
                        updateFormData(data => {
                          data.email = e.target.value
                        })
                      }}
                      required
                    />
                    {formState.map(({ path, message }) => {
                      const err = path.some(v => {
                        return ['EmailSignInError'].includes(v)
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

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-email-link'
                      name='remember-email'
                      type='checkbox'
                      checked={formData.rememberEmail}
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                      onChange={e => {
                        updateFormData(data => {
                          data.rememberEmail = e.target.checked
                        })
                      }}
                    />
                    <label
                      htmlFor='remember-email-link'
                      className='ml-3 block text-sm leading-6 text-gray-900'>
                      기억하기
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={e => {
                      updateFormData(data => {
                        data.provider = 'nodemailer'
                      })
                    }}>
                    로그인
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
