'use client'

import { Menu, Transition } from '@headlessui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { type SerializedTextNode } from 'lexical'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'

import { api } from '~/libs/trpc/react'
import { classNames } from '~/shared'

export default function Calendar({ userId }: { userId: string }) {
  const { data: session } = useSession()
  const user = session?.user

  const {
    data: posts,
    isFetching,
    isSuccess,
  } = api.posts.getPostsByUser.useQuery({
    userId,
  })

  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'yyyy-MM'))
  const startOfCurrentMonth = startOfMonth(currentMonth)

  const days = eachDayOfInterval({
    start: startOfWeek(startOfCurrentMonth),
    end: endOfWeek(endOfMonth(startOfCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(startOfCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'yyyy-MM'))
  }

  function nextMonth() {
    const firstDayNextMonth = add(startOfCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'yyyy-MM'))
  }

  const selectedDayPosts = posts?.filter(post => {
    if (!post.date) return
    return isSameDay(post.date, selectedDay)
  })

  return (
    <div className='lg:flex lg:h-full lg:flex-col'>
      <header className='flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none'>
        <h1 className='text-base font-semibold leading-6 text-gray-900'>
          <time dateTime={format(startOfCurrentMonth, 'yyyy-MM')}>
            {format(startOfCurrentMonth, 'yyyy년 MMM', { locale: ko })}
          </time>
        </h1>
        <div className='flex items-center'>
          <div className='relative flex items-center rounded-md bg-white shadow-sm md:items-stretch'>
            <button
              type='button'
              className='flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50'
              onClick={previousMonth}>
              <span className='sr-only'>저번달</span>
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
            </button>
            <button
              type='button'
              className='hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block'
              onClick={e => setCurrentMonth(format(today, 'yyyy-MM'))}>
              이번달
            </button>
            <span className='relative -mx-px h-5 w-px bg-gray-300 md:hidden' />
            <button
              type='button'
              className='flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50'
              onClick={nextMonth}>
              <span className='sr-only'>다음달</span>
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
          {user && (
            <div className='hidden md:ml-4 md:flex md:items-center'>
              <div className='ml-6 h-6 w-px bg-gray-300' />
              <Link
                href={`${userId}/${format(selectedDay, 'yyyy-MM-dd')}/edit`}
                className='ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                scroll={false}>
                블로그 편집
              </Link>
            </div>
          )}
          {/* Mobile Calendar Header */}
          <Menu as='div' className='relative ml-6 md:hidden'>
            <Menu.Button className='-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500'>
              <span className='sr-only'>Open menu</span>
              <EllipsisHorizontalIcon className='h-5 w-5' aria-hidden='true' />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'>
              <Menu.Items className='absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={`${userId}/${format(selectedDay, 'yyyy-MM-dd')}/edit`}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                        scroll={false}>
                        블로그 편집
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className='py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type='button'
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'flex w-full px-4 py-2 text-sm'
                        )}
                        onClick={e => {
                          setCurrentMonth(format(today, 'yyyy-MM'))
                        }}>
                        이번달
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      <div className='shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col'>
        <div className='grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none'>
          <div className='bg-white py-2'>
            일<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
          <div className='bg-white py-2'>
            월<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
          <div className='bg-white py-2'>
            화<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
          <div className='bg-white py-2'>
            수<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
          <div className='bg-white py-2'>
            목<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
          <div className='bg-white py-2'>
            금<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
          <div className='bg-white py-2'>
            토<span className='sr-only sm:not-sr-only'>요일</span>
          </div>
        </div>
        <div className='flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto'>
          <div className='hidden w-full lg:grid lg:grid-cols-7 lg:gap-px'>
            {days.map(day => (
              <button
                key={format(day, 'yyyy-MM-dd')}
                type='button'
                className={classNames(
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    'font-semibold',

                  isEqual(day, selectedDay) && 'text-white',
                  !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    'text-indigo-600',
                  !isEqual(day, selectedDay) &&
                    isSameMonth(day, startOfCurrentMonth) &&
                    !isToday(day) &&
                    'text-gray-900',
                  !isEqual(day, selectedDay) &&
                    !isSameMonth(day, startOfCurrentMonth) &&
                    !isToday(day) &&
                    'text-gray-500',

                  isSameMonth(day, startOfCurrentMonth)
                    ? 'bg-white'
                    : 'bg-gray-50',

                  'px-3 py-2 text-left hover:bg-gray-100 focus:z-10'
                )}
                onClick={e => {
                  setSelectedDay(day)
                }}>
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={classNames(
                    isEqual(day, selectedDay) &&
                      'flex h-6 w-6 items-center justify-center rounded-full',
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      'bg-indigo-600 font-semibold text-white',
                    isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900'
                  )}>
                  {format(day, 'd')}
                </time>
                {isSuccess && posts.length > 0 && (
                  <ol className='mt-2 min-h-12'>
                    {posts.map(post => {
                      if (
                        !post.date ||
                        !isSameDay(post.date, day) ||
                        !post.content
                      )
                        return

                        const serializedContent =
                        post.content
                      /* eslint-disable */
                      const content = serializedContent.root.children
                        .flatMap((child: any) =>
                          child.children.flatMap(
                            (child: SerializedTextNode) => child.text
                          )
                        )
                        .join(' ')
                      /* eslint-disable */

                      return (
                        <li key={post.date}>
                          <Link
                            href={`${userId}/${post.date}`}
                            className='group'
                            scroll={false}>
                            <p className='truncate text-gray-700 group-hover:text-indigo-500'>
                              {content}
                            </p>
                          </Link>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </button>
            ))}
          </div>
          {/* Mobile Calendar Body */}
          <div className='isolate grid w-full grid-cols-7 gap-px lg:hidden'>
            {days.map(day => (
              <button
                key={format(day, 'yyyy-MM-dd')}
                type='button'
                className={classNames(
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    'font-semibold',

                  isEqual(day, selectedDay) && 'text-white',
                  !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    'text-indigo-600',
                  !isEqual(day, selectedDay) &&
                    isSameMonth(day, startOfCurrentMonth) &&
                    !isToday(day) &&
                    'text-gray-900',
                  !isEqual(day, selectedDay) &&
                    !isSameMonth(day, startOfCurrentMonth) &&
                    !isToday(day) &&
                    'text-gray-500',

                  isSameMonth(day, startOfCurrentMonth)
                    ? 'bg-white'
                    : 'bg-gray-50',

                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10'
                )}
                onClick={e => {
                  setSelectedDay(day)
                }}>
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={classNames(
                    isEqual(day, selectedDay) &&
                      'flex h-6 w-6 items-center justify-center rounded-full',
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      'bg-indigo-600',
                    isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                    'ml-auto'
                  )}>
                  {format(day, 'd')}
                </time>
                <span className='sr-only'>
                  {isSuccess && posts.length} posts
                </span>
                {isSuccess && posts.length > 0 && (
                  <span className='-mx-0.5 mt-auto flex flex-wrap-reverse'>
                    {posts.map(post => {
                      if (!post.date || !isSameDay(post.date, day)) return

                      return (
                        <span
                          key={post.date}
                          className='mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400'
                        />
                      )
                    })}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='px-4 py-10 sm:px-6 lg:hidden'>
        {selectedDayPosts && selectedDayPosts.length > 0 && (
          <ol className='divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5'>
            {selectedDayPosts?.map(post => {
              if (!post.content) return

              const serializedContent =
              post.content
              /* eslint-disable */
              const content = serializedContent.root.children
                .flatMap((child: any) =>
                  child.children.flatMap(
                    (child: SerializedTextNode) => child.text
                  )
                )
                .join(' ')
              /* eslint-disable */

              return (
                <li
                  key={post.date}
                  className='group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50'>
                  <Link
                    href={`${userId}/${post.date}`}
                    className='flex-auto'
                    scroll={false}>
                    <p className='mt-2 flex items-center text-gray-700'>
                      {content}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
