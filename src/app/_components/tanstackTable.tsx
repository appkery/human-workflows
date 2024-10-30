'use client'

import {
  type Column,
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Getter,
  type Row,
  type RowData,
  type SortingState,
  type Table,
  useReactTable,
} from '@tanstack/react-table'
import { format, isSameDay } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import { api } from '~/libs/trpc/react'
import { classNames } from '~/shared'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

type Symbols = {
  id?: number
  name: string | null
  code: string | null
  currency: string | null
  buyingPrice: number | null
  marketPrice: number | null
  sellingPrice?: number | null
  amount: number | null
  profitRate?: number
  profit?: number
  createdAt?: Date | null
  updatedAt?: Date | null
}

const columHelpers = createColumnHelper<Symbols>()

const columns = [
  columHelpers.accessor('name', {
    header: '종목명',
    // cell: c => c.getValue(),
  }),
  columHelpers.accessor('currency', {
    header: '화폐',
    // cell: c => c.getValue(),
  }),
  columHelpers.accessor('buyingPrice', {
    header: '매입가',
    // cell: c => c.getValue().toLocaleString() + c.row.original.currency,
  }),
  columHelpers.accessor('marketPrice', {
    header: '현재가',
    // cell: c => c.getValue().toLocaleString() + c.row.original.currency,
  }),
  columHelpers.accessor('sellingPrice', {
    header: '판매가',
    // cell: c => c.getValue().toLocaleString() + c.row.original.currency,
  }),
  columHelpers.accessor('amount', {
    header: '수량',
    // cell: c => c.getValue().toLocaleString() + c.row.original.currency,
  }),
  columHelpers.accessor('profitRate', {
    header: '수익률',
    cell: c => {
      if (
        c.row.original.marketPrice === null ||
        c.row.original.buyingPrice === null
      )
        return 0

      return (
        Math.floor(
          (c.row.original.marketPrice / c.row.original.buyingPrice) * 10000
        ) /
          100 +
        '%'
      )
    },
  }),
  columHelpers.accessor('profit', {
    header: '평가손익',
    cell: c => {
      if (
        c.row.original.marketPrice === null ||
        c.row.original.buyingPrice === null ||
        c.row.original.amount === null
      )
        return 0

      return (
        (
          (c.row.original.marketPrice - c.row.original.buyingPrice) *
          c.row.original.amount
        ).toLocaleString() + c.row.original.currency
      )
    },
  }),
  columHelpers.accessor('createdAt', {
    header: '작성일',
    cell: c => c.getValue()?.toLocaleDateString(),
  }),
  columHelpers.accessor('updatedAt', {
    header: '수정일',
    cell: c => {
      const value = c.getValue()
      if (
        value === undefined ||
        value === null ||
        c.row.original.createdAt === undefined ||
        c.row.original.createdAt === null ||
        isSameDay(value, c.row.original.createdAt)
      ) {
        return '-'
      }

      return value.toLocaleDateString()
    },
  }),
]

const useCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: {
  getValue: Getter<unknown>
  row: Row<Symbols>
  column: Column<Symbols, unknown>
  table: Table<Symbols>
}) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input
      className='w-full'
      value={value as string}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      readOnly={true}
    />
  )
}

const defaultColumn: Partial<ColumnDef<Symbols>> = {
  cell: useCell,
}

export default function TanstackTable({
  isEditable,
  userId,
  postDate,
}: {
  isEditable: boolean
  userId: string
  postDate: string
}) {
  const {
    data: post,
    error: postError,
    isFetching: isPostFetching,
    isSuccess: isPostSuccess,
  } = api.posts.getPostByUserAndDate.useQuery({
    userId,
    postDate,
  })
  const [symbols, updateSymbols] = useImmer(new Array<Symbols>())

  useEffect(() => {
    if (isPostSuccess) {
      updateSymbols(() => post?.symbols)
    }
  }, [isPostSuccess, updateSymbols, post?.symbols])

  // const [post, postQuery] = api.posts.getPostByUserAndDate.useSuspenseQuery({
  //   userId,
  //   postDate,
  // })
  // const [symbols, updateSymbols] = useImmer(post?.symbols ?? [])

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    columns,
    defaultColumn,
    data: symbols,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        updateSymbols(old =>
          old?.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    debugTable: true,
  })

  return (
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <h1 className='text-base font-semibold leading-6 text-gray-900'>
              <time dateTime={postDate}>
                {postDate ? format(postDate, 'yyyy년 M월 d일') : 'N/A'}
              </time>
            </h1>
          </div>
        </div>
        <div className='mt-8 flow-root'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr
                      key={headerGroup.id}
                      className='divide-x divide-gray-200'>
                      {isEditable && (
                        <th
                          scope='col'
                          className='py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0'>
                          <span className='sr-only'>수정</span>
                        </th>
                      )}
                      {headerGroup.headers.map((header, index) => (
                        <th
                          key={header.id}
                          scope='col'
                          colSpan={header.colSpan}
                          className={classNames(
                            isEditable
                              ? 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                              : index
                                ? 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                                : 'py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0',
                            header.column.getCanSort() &&
                              'cursor-pointer select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }>
                          <span className='align-middle'>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </span>
                          {{
                            asc: (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='ml-2 inline size-6 text-gray-400'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3'
                                />
                              </svg>
                            ),
                            desc: (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='ml-2 inline size-6 text-gray-400'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18'
                                />
                              </svg>
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='ml-2 inline size-6 text-gray-300'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                              />
                            </svg>
                          )}
                        </th>
                      ))}
                      {isEditable && (
                        <th
                          scope='col'
                          className='relative !border-l-0 py-3.5 pl-3 pr-4 sm:pr-0'>
                          <span className='sr-only'>삭제</span>
                        </th>
                      )}
                    </tr>
                  ))}
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='divide-x divide-gray-200'>
                      {isEditable && (
                        <td className='whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0'>
                          <button
                            type='button'
                            className='text-indigo-600 hover:text-indigo-900'
                            onClick={e => {
                              updateSymbols(symbols => {
                                symbols?.splice(row.index, 1)
                              })
                            }}>
                            수정
                          </button>
                        </td>
                      )}
                      {row.getVisibleCells().map((cell, index, cells) => (
                        <td
                          key={cell.id}
                          className={
                            isEditable
                              ? 'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                              : index
                                ? 'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                : 'whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0'
                          }>
                          <Link
                            // href={`${postDate}/${cell.row.original.name}`}
                            href={'/symbols'}
                            scroll={false}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          </Link>
                        </td>
                      ))}
                      {isEditable && (
                        <td className='relative whitespace-nowrap !border-l-0 py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                          <button
                            type='button'
                            className='text-indigo-600 hover:text-indigo-900'
                            onClick={e => {
                              updateSymbols(symbols => {
                                symbols?.splice(row.index, 1)
                              })
                            }}>
                            삭제
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {isEditable && (
            <>
              <div className='mt-4 flex gap-2'>
                <button
                  type='button'
                  className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={e => {
                    updateSymbols(symbols => {
                      symbols?.push({
                        name: '',
                        code: '',
                        currency: '',
                        buyingPrice: 0,
                        marketPrice: 0,
                        sellingPrice: 0,
                        amount: 0,
                        createdAt: new Date(),
                      })
                    })
                  }}>
                  행 추가
                </button>
                <button
                  type='button'
                  className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={e => {
                    updateSymbols(symbols => {
                      symbols?.push({
                        name: '',
                        code: '',
                        currency: '',
                        buyingPrice: 0,
                        marketPrice: 0,
                        sellingPrice: 0,
                        amount: 0,
                        createdAt: new Date(),
                      })
                    })
                  }}>
                  저장
                </button>
              </div>
            </>
          )}
        </div>
      </div>
  )
}
