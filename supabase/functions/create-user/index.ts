
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // This is needed if you're calling the function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, fullName, role } = await req.json()

    if (!email || !password || !fullName || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, password, fullName, and role are required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Set to true for production, can be false for testing
      user_metadata: { full_name: fullName },
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
        return new Response(JSON.stringify({ error: "User could not be created in authentication system." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
    }

    // The `handle_new_user` trigger creates the profile. Now, we update its role.
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: role })
      .eq('id', authData.user.id)

    if (profileError) {
      // If updating the profile fails, delete the auth user to avoid orphaned users.
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
