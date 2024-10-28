import authConfig from 'auth.config'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/signin')
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
