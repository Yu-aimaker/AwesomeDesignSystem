// Preview Worker only (wrangler.preview.jsonc). Missing paths reach this
// script; env.ASSETS.fetch applies not_found_handling and returns index.html.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
