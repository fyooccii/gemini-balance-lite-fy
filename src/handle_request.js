import { handleVerification } from './verify_keys.js';

export async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const search = url.search;

  if (pathname === '/' || pathname === '/index.html') {
    return new Response('Proxy is Running!', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (pathname === '/verify' && request.method === 'POST') {
    return handleVerification(request);
  }

  const targetUrl = `https://generativelanguage.googleapis.com${pathname}${search}`;

  try {
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key.trim().toLowerCase() === 'x-goog-api-key') {
        const apiKeys = value
          .split(',')
          .map(k => k.trim())
          .filter(k => k);
        if (apiKeys.length > 0) {
          const selectedKey =
            apiKeys[Math.floor(Math.random() * apiKeys.length)];
          console.log(`Gemini Selected API Key: ${selectedKey}`);
          headers.set('x-goog-api-key', selectedKey);
        }
      } else {
        if (key.trim().toLowerCase() === 'content-type') {
          headers.set(key, value);
        }
      }
    }

    console.log('Request Sending to Gemini');
    console.log('targetUrl:' + targetUrl);
    console.log(headers);

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
    });

    console.log('Call Gemini Success');

    const responseHeaders = new Headers(response.headers);

    console.log('Header from Gemini:');
    console.log(responseHeaders);

    responseHeaders.delete('transfer-encoding');
    responseHeaders.delete('connection');
    responseHeaders.delete('keep-alive');
    responseHeaders.delete('content-encoding');
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Failed to fetch:', error);
    return new Response('Internal Server Error\n' + error?.stack, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
