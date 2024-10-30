'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignUp() {
  const [email, setEmail] = useState('')

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            회원가입
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
          <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
            <div>
              <form
                className='space-y-6'
                onSubmit={async e => {
                  e.preventDefault()
                  await signIn('nodemailer', {
                    email,
                    callbackUrl: '/admin/profile',
                  })
                }}>
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
                      value={email}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <button className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                    회원가입
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className='relative mt-10'>
                <div
                  className='absolute inset-0 flex items-center'
                  aria-hidden='true'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm font-medium leading-6'>
                  <span className='bg-white px-6 text-gray-900'>또는</span>
                </div>
              </div>

              <div className='mt-6 grid gap-4'>
                <button
                  className='flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent'
                  onClick={() => signIn('naver', { callbackUrl: '/admin' })}>
                  <Image
                    src='/images/logos/naver-login.png'
                    alt='네이버 회원가입'
                    className='h-5 w-5'
                    width={20}
                    height={20}
                  />
                  <span className='text-sm font-semibold leading-6'>
                    네이버 회원가입
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
