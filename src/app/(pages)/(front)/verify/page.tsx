import Link from 'next/link'

export default function Verify() {
  return (
    <>
      <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <p className='text-base font-semibold text-indigo-600'>성공</p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            이메일을 보냈습니다.
          </h1>
          <p className='mt-6 text-base leading-7 text-gray-600'>
            이메일을 열고, 로그인 링크를 눌러 로그인해 주세요.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link
              href='/'
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              scroll={false}>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
