import { kindeAuthClient, type SessionManager } from '@kinde-oss/kinde-auth-sveltekit';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ request }: RequestEvent) {
  const isAuthenticated = await kindeAuthClient.isAuthenticated(
    request as unknown as SessionManager
  );
  const user = isAuthenticated
    ? await kindeAuthClient.getUser(request as unknown as SessionManager)
    : null;
  return { isAuthenticated, user };
}
