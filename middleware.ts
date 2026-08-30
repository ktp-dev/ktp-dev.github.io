import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run session refresh only on real app routes — not static files from /public.
     * Skips _next assets plus common binary/text extensions (Life app JS/WASM, fonts, etc.).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|SVG|png|PNG|jpe?g|JPE?G|gif|GIF|webp|WEBP|ico|ICO|js|JS|css|CSS|wasm|WASM|json|JSON|xml|XML|txt|TXT|map|MAP|woff2?|WOFF2?|ttf|TTF|otf|OTF|html|HTML|csv|CSV)$).*)',
  ],
}

