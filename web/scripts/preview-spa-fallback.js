// Preview Worker only (wrangler.preview.jsonc). Missing paths reach this
// script; env.ASSETS.fetch applies not_found_handling and returns index.html.
// Non-production hosts stay out of the index. Production wrangler.jsonc has
// no main script, so it does not send this header.
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
