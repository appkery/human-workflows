import Calendar from '~/app/_components/calendar'

export default function UserId({ params }: { params: { userId: string } }) {
  const { userId } = params

  return <Calendar userId={userId} />
}
