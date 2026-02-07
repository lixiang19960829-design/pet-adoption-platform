import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if user profile exists, create if not
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: profile } = await supabase
                    .from('users_profile')
                    .select('id')
                    .eq('id', user.id)
                    .single()

                if (!profile) {
                    // Create new user profile
                    await supabase.from('users_profile').insert({
                        id: user.id,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                        avatar_url: user.user_metadata?.avatar_url || null,
                        role: 'user',
                    })
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Return to home with error
    return NextResponse.redirect(`${origin}/?error=auth-callback-error`)
}
