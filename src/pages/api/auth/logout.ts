import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createClient(cookies);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return redirect('/');
};
