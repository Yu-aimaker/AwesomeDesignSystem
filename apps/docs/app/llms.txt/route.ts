import {
  AGENT_API_CACHE_CONTROL,
  AGENT_API_NO_STORE,
  AtlasIntegrityError,
  buildLlmsText,
} from "../../lib/agent-api";
import { getAtlas } from "../../lib/content";

export const revalidate = 3600;

export async function GET() {
  try {
    const atlas = await getAtlas();
    return new Response(buildLlmsText(atlas), {
      headers: {
        "Cache-Control": AGENT_API_CACHE_CONTROL,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    const message =
      error instanceof AtlasIntegrityError
        ? error.message
        : "The AwesomeDS Atlas is temporarily unavailable.";
    return new Response(`# Awesome Design System\n\nError: ${message}\n`, {
      status: 503,
      headers: {
        "Cache-Control": AGENT_API_NO_STORE,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
