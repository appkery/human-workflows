'use client'

import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

import Comments from '~/app/_components/comments'
import Textarea from '~/app/_components/textarea'
import { api } from '~/libs/trpc/react'

import TanstackTable from './tanstackTable'

export default function Post({
  userId,
  postDate,
}: {
  userId: string
  postDate: string[]
}) {
  const { data: session } = useSession()
  const user = session?.user
  const isEditable = Boolean(user) && postDate[1] === 'edit'

  postDate[0] = postDate[0] ?? format(new Date(), 'yyyy-MM-dd')

  const {
    data: post,
    isFetching: isPostFetching,
    isSuccess: isPostSuccess,
  } = api.posts.getPostByUserAndDate.useQuery({
    userId,
    postDate: postDate[0],
  })

  if (!post?.content) return

  return (
    <>
      <TanstackTable
        isEditable={isEditable}
        userId={userId}
        postDate={postDate[0]}
      />
      <Textarea
        buttonLabel='Post'
        isEditable={isEditable}
        userId={userId}
        postDate={postDate[0]}
        textareaContent={post.content}
      />
      <Comments
        isEditable={Boolean(user)}
        userId={userId}
        postDate={postDate[0]}
      />
    </>
  )
}
