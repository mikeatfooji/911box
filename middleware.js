// Password gate for the whole site (Vercel Routing Middleware).
// Set SITE_PASSWORD in Vercel > Project > Settings > Environment Variables, then redeploy.
// Viewers get the browser's sign-in prompt: any username, that password.
import { next } from '@vercel/functions';

export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (password && scheme === 'Basic' && encoded) {
    const decoded = atob(encoded);
    if (decoded.slice(decoded.indexOf(':') + 1) === password) return next();
  }
  return new Response('Password required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="9-1-1 Lava Cake Box", charset="UTF-8"' },
  });
}
