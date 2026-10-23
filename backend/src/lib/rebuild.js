// Asks Vercel to rebuild the website so the SEO link-preview pages match the database.
// Needs the VERCEL_DEPLOY_HOOK environment variable; without it (local development) nothing happens.
// Several quick edits are merged into one rebuild: we wait until 30 seconds pass with no new change.
const WAIT_MS = 30 * 1000;
let timer = null;

export function requestRebuild() {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) return;

  clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      const res = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(10000) });
      if (!res.ok) console.error('Rebuild request failed: HTTP', res.status);
    } catch (err) {
      // Never print the hook address: it works like a password.
      console.error('Rebuild request failed:', err.name);
    }
  }, WAIT_MS);
}
