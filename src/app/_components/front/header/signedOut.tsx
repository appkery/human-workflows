'use client'

import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

import { classNames } from '~/shared'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

// const navigation = [{ name: '블로그', href: '/blogs', current: false }]

export default function SignedOut() {
  return (
    <>
      <Disclosure as='nav' className='border-b border-gray-200 bg-white'>
        {({ open }) => (
          <>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='flex h-16 justify-between'>
                <div className='flex'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Link href='/' scroll={false}>
                      <Image
                        className='block h-8 w-auto lg:hidden'
                        src='/images/emoji/1F642.png'
                        alt='appkery'
                        width={32}
                        height={32}
                      />
                    </Link>
                    <Link href='/' scroll={false}>
                      <Image
                        className='hidden h-8 w-auto lg:block'
                        src='/images/emoji/1F642.png'
                        alt='appkery'
                        width={32}
                        height={32}
                      />
                    </Link>
                  </div>
                  {/* <div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
                    {navigation.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                        scroll={false}>
                        {item.name}
                      </Link>
                    ))}
                  </div> */}
                </div>
                {/* Profile dropdown */}
                <div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
                  <Link
                    href='/signin'
                    className={classNames(
                      'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                    )}
                    scroll={false}>
                    로그인
                  </Link>
                  <Link
                    href='/signup'
                    className={classNames(
                      'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                    )}
                    scroll={false}>
                    회원가입
                  </Link>
                </div>
                <div className='-mr-2 flex items-center sm:hidden'>
                  {/* Mobile menu button */}
                  <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                    <span className='absolute -inset-0.5' />
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className='sm:hidden'>
              {/* <div className='space-y-1 pb-3 pt-2'>
                {navigation.map(item => (
                  <Disclosure.Button
                    key={item.name}
                    as='a'
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}>
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div> */}
              <div className='border-t border-gray-200 pb-3 pt-4'>
                <div className='space-y-1'>
                  <Disclosure.Button
                    as='a'
                    href='/signin'
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'>
                    로그인
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}
