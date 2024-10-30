import Post from '~/app/_components/post'

export default function postDate({
  params,
}: {
  params: { userId: string; postDate: string[] }
}) {
  const { userId, postDate } = params

  return <Post userId={userId} postDate={postDate} />
}
