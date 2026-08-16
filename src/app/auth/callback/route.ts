import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getBrotherByUmichEmail } from '@/lib/brothers'
import { checkIsAdmin } from '@/lib/supabase/auth-helpers'

function safeNext(value: string | null) {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value
  return null
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const email = user?.email?.toLowerCase() ?? ''
  const brother = email ? await getBrotherByUmichEmail(email) : null

  const explicitNext = safeNext(requestUrl.searchParams.get('next'))
  if (brother) {
    if (explicitNext?.startsWith('/apply')) {
      const nextUrl = new URL(explicitNext, origin)
      if (nextUrl.searchParams.get('preview') === '1' && (await checkIsAdmin())) {
        return NextResponse.redirect(`${origin}${explicitNext}`)
      }
      return NextResponse.redirect(`${origin}/apply`)
    }
    return NextResponse.redirect(`${origin}${explicitNext ?? '/portal'}`)
  }

  return NextResponse.redirect(`${origin}${explicitNext ?? '/apply'}`)
}
