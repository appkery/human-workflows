'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'


export function CreatePost() {
  const router = useRouter()
  const [content, setContent] = useState('')

  // const createPost = api.posts.create.useMutation({
  //   onSuccess: () => {
  //     router.refresh()
  //     setContent('')
  //   },
  // })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        // createPost.mutate({ content })
      }}
      className='flex flex-col gap-2'>
      <input
        type='text'
        placeholder='Content'
        value={content}
        onChange={e => setContent(e.target.value)}
        className='w-full rounded-full px-4 py-2 text-black'
      />
      <button
        className='rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20'
        // disabled={createPost.isPending}
        >
        {/* {createPost.isPending ? 'Submitting...' : 'Submit'} */}
      </button>
    </form>
  )
}
