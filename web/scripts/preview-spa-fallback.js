// Preview Worker only (wrangler.preview.jsonc). assets.run_worker_first sends
// every preview request here, including files that exist. env.ASSETS.fetch
// applies not_found_handling and returns index.html for missing paths.
// Production wrangler.jsonc has no main script and no run_worker_first.
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
