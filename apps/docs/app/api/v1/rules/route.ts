import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AGENT_API_CACHE_CONTROL,
  AGENT_API_NO_STORE,
  buildAgentApiError,
  buildRulesPayload,
  parseRuleFilters,
} from "../../../../lib/agent-api";
import { getAtlas } from "../../../../lib/content";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const filters = parseRuleFilters(request.nextUrl.searchParams);
    const { rules } = await getAtlas();
    return NextResponse.json(buildRulesPayload(rules, filters), {
      headers: { "Cache-Control": AGENT_API_CACHE_CONTROL },
    });
  } catch (error) {
    const response = buildAgentApiError(error, "/api/v1/rules");
    return NextResponse.json(response.body, {
      status: response.status,
      headers: { "Cache-Control": AGENT_API_NO_STORE },
    });
  }
}
