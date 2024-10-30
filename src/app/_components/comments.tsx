'use client'



import {
  defaultRangeExtractor,
  type Range,
  useWindowVirtualizer,
} from '@tanstack/react-virtual'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useCallback, useEffect, useRef } from 'react'

import { api } from '~/libs/trpc/react'
import { classNames } from '~/shared'

import Textarea from './textarea'

const photoPath = '/images/photos/default.svg'

export default function Comments({
  userId,
  postDate,
  isEditable,
}: {
  userId: string
  postDate: string
  isEditable: boolean
}) {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.comments.getCommentsByPost.useInfiniteQuery(
    {
      userId,
      postDate,
      limit: 20,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  )

  const parentComments = data?.pages.flatMap(d => d.items) ?? []

  const listRef = useRef<HTMLDivElement>(null)
  const rangeRef = useRef(new Set<number>())

  const rangeExtractor = useCallback(
    (range: Range) => {
      rangeRef.current = new Set([
        ...rangeRef.current,
        ...defaultRangeExtractor(range),
      ])
      return [...rangeRef.current]
    },
    [rangeRef]
  )

  const windowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? parentComments.length + 1 : parentComments.length,
    estimateSize: () => 72,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    rangeExtractor,
  })

  const virtualItems = windowVirtualizer.getVirtualItems()
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= parentComments.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage().catch(console.error)
    }
  }, [
    hasNextPage,
    fetchNextPage,
    parentComments.length,
    isFetchingNextPage,
    windowVirtualizer,
    virtualItems,
  ])

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <div ref={listRef}>
      <ul role='list' className={'mt-6 space-y-6'}>
        {virtualItems.map(item => {
          const isLoaderRow = item.index > parentComments.length - 1
          const comment = parentComments[item.index]
          if (!comment) return

          return (
            <li
              key={item.key}
              data-index={item.index}
              ref={windowVirtualizer.measureElement}
              className={'relative flex gap-x-4'}>
              {isLoaderRow ? (
                hasNextPage ? (
                  'Loading more...'
                ) : (
                  'Nothing more to load'
                )
              ) : (
                <>
                  <div
                    className={classNames(
                      item.index === parentComments.length - 1
                        ? 'h-6'
                        : '-bottom-6',
                      'absolute left-0 top-0 flex w-6 justify-center'
                    )}>
                    <div className='w-px bg-gray-200' />
                  </div>
                  <Link
                    href={`/blogs/${comment.users.id}`}
                    scroll={false}
                    className='flex-none'>
                    <Image
                      src={comment.users.image ?? photoPath}
                      alt=''
                      className='relative h-6 w-6 rounded-full bg-gray-50'
                      width={24}
                      height={24}
                      onError={e => {
                        e.currentTarget.src = photoPath
                      }}
                    />
                  </Link>
                  <div>
                    <div className='rounded-md rounded-tl-none p-3 ring-1 ring-inset ring-gray-200'>
                      <div className='flex justify-between gap-x-4'>
                        <div className='py-0.5 text-xs leading-5 text-gray-500'>
                          <span className='font-medium text-gray-900'>
                            {comment.users.name}
                          </span>
                        </div>
                        <time
                          dateTime={comment.createdAt.toISOString()}
                          className='flex-none py-0.5 text-xs leading-5 text-gray-500'>
                          {comment.createdAt &&
                            formatDistanceToNow(new Date(comment.createdAt), {
                              locale: ko,
                            })}
                          {' 전'}
                        </time>
                      </div>
                      <p className='text-sm leading-6 text-gray-500'>
                        {comment.content}
                      </p>
                    </div>
                    {/* {childComments && <ChildComments />} */}
                  </div>
                </>
              )}
            </li>
          )
        })}
      </ul>
      <p>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </p>
      {isEditable && <Textarea buttonLabel='Comment' isEditable={isEditable} userId={userId} postDate={postDate} />}
    </div>
  )
}
