'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  createContext,
  type Dispatch,
  Fragment,
  type ReactNode,
  type SetStateAction,
  useState,
} from 'react'

import { classNames } from '~/shared'

import Header from './header'

type SidebarContextType = {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
})
const userNavigation = [{ name: '프로필', href: '/admin/profile' }]

export default function Aside({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const user = session?.user

  const navigation = [
    { name: '새 워크플로우', href: '/admin', icon: HomeIcon, current: true },
    { name: '대시보드', href: '/admin', icon: HomeIcon, current: true },
    {
      name: '조직도',
      href: `/admin/blogs/${user?.id}`,
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: '워크플로우',
      href: '/admin/blogs',
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: '내 워크플로우',
      href: '/admin/blogs',
      icon: DocumentDuplicateIcon,
      current: false,
    },
  ]  

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {/* Sidebar for mobile */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50 lg:hidden'
          onClose={setSidebarOpen}>
          <TransitionChild
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-gray-900/80' />
          </TransitionChild>

          <div className='fixed inset-0 flex'>
            <TransitionChild
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'>
              <DialogPanel className='relative mr-16 flex w-full max-w-xs flex-1'>
                <TransitionChild
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'>
                  <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                    <button
                      type='button'
                      className='-m-2.5 p-2.5'
                      onClick={() => setSidebarOpen(false)}>
                      <span className='sr-only'>Close sidebar</span>
                      <XMarkIcon
                        className='h-6 w-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'>
                  <Link
                    href='/'
                    className='flex h-16 shrink-0 items-center'
                    scroll={false}>
                    <Image
                      className='h-8 w-auto'
                      src='/images/emoji/1F642.png'
                      alt='appkery'
                      width={32}
                      height={32}
                    />
                  </Link>
                  <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                      <li>
                        <ul role='list' className='-mx-2 space-y-1'>
                          {navigation.map(item => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                )}
                                scroll={false}>
                                <item.icon
                                  className={classNames(
                                    item.current
                                      ? 'text-indigo-600'
                                      : 'text-gray-400 group-hover:text-indigo-600',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden='true'
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className='mt-auto'>
                        <Link
                          href='/admin/settings'
                          className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                          scroll={false}>
                          <Cog6ToothIcon
                            className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                            aria-hidden='true'
                          />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4'>
          <Link
            href='/'
            className='flex h-16 shrink-0 items-center'
            scroll={false}>
            <Image
              className='h-8 w-auto'
              src='/images/emoji/1F642.png'
              alt='appkery'
              width={32}
              height={32}
            />
          </Link>
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
              <li>
                <ul role='list' className='-mx-2 space-y-1'>
                  {navigation.map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        )}
                        scroll={false}>
                        <item.icon
                          className={classNames(
                            item.current
                              ? 'text-indigo-600'
                              : 'text-gray-400 group-hover:text-indigo-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden='true'
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className='mt-auto'>
                <Link
                  href='/admin/settings'
                  className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  scroll={false}>
                  <Cog6ToothIcon
                    className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                    aria-hidden='true'
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className='lg:pl-72'>
        <Header />
        {children}
      </div>
    </SidebarContext.Provider>
  )
}
