// Small markdown subset for the no-JS pages. Text is escaped, and href/src
// only keep http, https, mailto, or a relative path. Every loop consumes a line.

export function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escAttr(text) {
  return esc(text).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function fromCode(code) {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

/** Decode entities and percent-encoding enough times to see a hidden scheme. */
function decodedScheme(value) {
  let current = String(value);
  for (let pass = 0; pass < 3; pass += 1) {
    const entities = current
      .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => fromCode(Number.parseInt(hex, 16)))
      .replace(/&#(\d+);?/g, (_, num) => fromCode(Number(num)))
      .replace(/&colon;/gi, ":")
      .replace(/&tab;|&#0*9;?/gi, "")
      .replace(/&newline;|&#0*10;?/gi, "")
      .replace(/&amp;/gi, "&");
    let decoded = entities;
    try {
      decoded = decodeURIComponent(entities.replace(/\+/g, "%20"));
    } catch {
      decoded = entities;
    }
    if (decoded === current) break;
    current = decoded;
  }
  return current.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
}

/** http, https, mailto, or a same-document path. javascript: and data: are dropped. */
export function safeUrl(raw) {
  const value = String(raw).trim();
  if (!value || /[\u0000-\u001f\u007f]/.test(value) || /["'<>`]/.test(value)) return null;
  const scheme = decodedScheme(value);
  if (/^(javascript|data|vbscript):/.test(scheme)) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^mailto:/i.test(value)) return value;
  if (value.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  if (value.startsWith("/") || value.startsWith("#") || value.startsWith("./") || value.startsWith("../") || !value.includes(":")) {
    return value;
  }
  return null;
}

function inline(raw) {
  const parts = [];
  const re = /!\[([^\]]*)\]\(([^)\s]+)\)|\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const match of String(raw).matchAll(re)) {
    parts.push(esc(raw.slice(last, match.index)));
    if (match[0].startsWith("!")) {
      const url = safeUrl(match[2]);
      parts.push(url ? `<img src="${escAttr(url)}" alt="${escAttr(match[1])}" />` : esc(match[1]));
    } else if (match[3] !== undefined) {
      const url = safeUrl(match[4]);
      parts.push(url ? `<a href="${escAttr(url)}">${esc(match[3])}</a>` : esc(match[3]));
    } else if (match[5] !== undefined) {
      parts.push(`<code>${esc(match[5])}</code>`);
    } else {
      parts.push(`<strong>${esc(match[6])}</strong>`);
    }
    last = match.index + match[0].length;
  }
  parts.push(esc(raw.slice(last)));
  return parts.join("");
}

function isHeading(line) {
  return /^#{1,6}(?:\s|$)/.test(line);
}

export function mdToHtml(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const start = i;
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (isHeading(line)) {
      const heading = /^(#{1,6})\s+(\S.*)$/.exec(line);
      i += 1;
      if (heading) out.push(`<h${heading[1].length}>${inline(heading[2].trim())}</h${heading[1].length}>`);
      if (i === start) i += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const buf = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
      if (i === start) i += 1;
      continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|\s*-+/.test(lines[i])) {
          rows.push(
            lines[i]
              .split("|")
              .slice(1, -1)
              .map((cell) => `<td>${inline(cell.trim())}</td>`)
              .join(""),
          );
        }
        i += 1;
      }
      if (rows.length) out.push(`<table>${rows.map((row) => `<tr>${row}</tr>`).join("")}</table>`);
      if (i === start) i += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i += 1;
      }
      out.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`);
      if (i === start) i += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`);
        i += 1;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      if (i === start) i += 1;
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\. /, ""))}</li>`);
        i += 1;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      if (i === start) i += 1;
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !isHeading(lines[i]) && !/^(```|\||> |- |\d+\. )/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    if (i === start) i += 1;
  }
  return out.join("\n");
}
