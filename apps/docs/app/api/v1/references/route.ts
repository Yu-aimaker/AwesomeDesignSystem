import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AGENT_API_CACHE_CONTROL,
  AGENT_API_NO_STORE,
  buildAgentApiError,
  buildReferenceAtlasPayload,
  parseReferenceFilters,
} from "../../../../lib/agent-api";
import { getAtlas } from "../../../../lib/content";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const filters = parseReferenceFilters(request.nextUrl.searchParams);
    const { references } = await getAtlas();
    return NextResponse.json(buildReferenceAtlasPayload(references, filters), {
      headers: { "Cache-Control": AGENT_API_CACHE_CONTROL },
    });
  } catch (error) {
    const response = buildAgentApiError(error, "/api/v1/references");
    return NextResponse.json(response.body, {
      status: response.status,
      headers: { "Cache-Control": AGENT_API_NO_STORE },
    });
  }
}
