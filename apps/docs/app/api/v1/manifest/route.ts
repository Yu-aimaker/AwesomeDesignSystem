import { NextResponse } from "next/server";

import {
  AGENT_API_CACHE_CONTROL,
  AGENT_API_NO_STORE,
  buildAgentApiError,
  buildManifestPayload,
} from "../../../../lib/agent-api";
import { getAtlas } from "../../../../lib/content";

export const revalidate = 3600;

export async function GET() {
  try {
    const atlas = await getAtlas();
    return NextResponse.json(buildManifestPayload(atlas), {
      headers: { "Cache-Control": AGENT_API_CACHE_CONTROL },
    });
  } catch (error) {
    const response = buildAgentApiError(error, "/api/v1/manifest");
    return NextResponse.json(response.body, {
      status: response.status,
      headers: { "Cache-Control": AGENT_API_NO_STORE },
    });
  }
}
