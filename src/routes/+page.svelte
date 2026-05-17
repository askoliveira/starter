<script lang="ts">
  import { resolve } from '$app/paths';
  let { data } = $props();
</script>

<!-- Replace this h1 with your app's landing page. Keep the auth block below. -->
<h1>App</h1>

{#if data.isAuthenticated}
  <p>Signed in.</p>
  <pre>{JSON.stringify(data.user, null, 2)}</pre>
  <a href={resolve('/api/auth/logout')}>Sign out</a>
{:else}
  <p>Not signed in.</p>
  <a href={resolve('/api/auth/login')}>Sign in</a>
  |
  <a href={resolve('/api/auth/register')}>Sign up</a>
{/if}
