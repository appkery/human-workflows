'use client'

import {
  defaultRangeExtractor,
  type Range,
  useWindowVirtualizer,
} from '@tanstack/react-virtual'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { type SerializedTextNode } from 'lexical'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'

import { api } from '~/libs/trpc/react'

const photoPath = '/images/photos/default.svg'

export default function List() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.posts.getAllPosts.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  )

  const rows = data?.pages.flatMap(d => d.items) ?? []

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
    count: hasNextPage ? rows.length + 1 : rows.length,
    estimateSize: () => 89,
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
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage().catch(console.error)
    }
  }, [
    hasNextPage,
    fetchNextPage,
    rows.length,
    isFetchingNextPage,
    virtualItems,
  ])

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <div ref={listRef}>
      <ul role='list' className={'divide-y divide-gray-100'}>
        {windowVirtualizer.getVirtualItems().map(item => {
          const isLoaderRow = item.index > rows.length - 1
          const { user, post } = rows[item.index] ?? {}

          if (!post?.content) return

          const serializedContent =
          post.content
          /* eslint-disable */
          const content = serializedContent.root.children
            .flatMap((child: any) =>
              child.children.flatMap((child: SerializedTextNode) => child.text)
            )
            .join(' ')
          /* eslint-disable */

          return (
            <li
              key={item.key}
              data-index={item.index}
              ref={windowVirtualizer.measureElement}
              className={'relative flex justify-between gap-x-6 py-5'}>
              {isLoaderRow ? (
                hasNextPage ? (
                  'Loading more...'
                ) : (
                  'Nothing more to load'
                )
              ) : (
                <>
                  <div className='flex min-w-0 gap-x-4'>
                    <Link
                      href={`/blogs/${user?.id}`}
                      scroll={false}
                      className='flex-none'>
                      <Image
                        className='h-12 w-12 rounded-full bg-gray-50'
                        src={user?.image ?? photoPath}
                        alt=''
                        width={48}
                        height={48}
                      />
                    </Link>
                    <div className='min-w-0 flex-auto'>
                      <p className='text-sm font-semibold leading-6 text-gray-900'>
                        <Link href={`/blogs/${user?.id}`} scroll={false}>
                          {/* <span className='absolute inset-x-0 -top-px bottom-0' /> */}
                          {user?.name}
                        </Link>
                      </p>
                      <p className='mt-1 flex text-xs leading-5 text-gray-500'>
                        <Link
                          href={`/blogs/${user?.id}/${post?.date}`}
                          scroll={false}
                          className='relative line-clamp-3 hover:underline'>
                          {content}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className='flex shrink-0 items-center gap-x-4'>
                    <div className='hidden sm:flex sm:flex-col sm:items-end'>
                      <p className='mt-1 text-xs leading-5 text-gray-500'>
                        <time dateTime={post?.createdAt.toISOString()}>
                          {post?.createdAt &&
                            formatDistanceToNow(new Date(post?.createdAt), {
                              locale: ko,
                            })}
                        </time>
                        {' 전'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </li>
          )
        })}
      </ul>
      <div>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </div>
    </div>
  )
}
