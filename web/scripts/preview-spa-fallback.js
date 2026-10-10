// wrangler preview uploads this in place of templates/no-op-worker.js.
// The stock no-op answers 404 for every path that is not a file, so
// not_found_handling never runs. `/` is the asset document (200).
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.pathname = "/";
    url.search = "";
    return fetch(url, { method: "GET", redirect: "manual" });
  },
};
