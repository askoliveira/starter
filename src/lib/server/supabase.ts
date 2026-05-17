import { createClient } from '@supabase/supabase-js';
import { kindeAuthClient, type SessionManager } from '@kinde-oss/kinde-auth-sveltekit';
import jwt from 'jsonwebtoken';
import { KINDE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

export async function getSupabase(request: Request) {
  const isAuthenticated = await kindeAuthClient.isAuthenticated(
    request as unknown as SessionManager
  );

  let authToken: string;

  if (isAuthenticated) {
    const user = await kindeAuthClient.getUser(request as unknown as SessionManager);
    authToken = jwt.sign(
      { sub: user.id, role: 'authenticated' },
      KINDE_CLIENT_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );
  } else {
    authToken = PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }

  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
