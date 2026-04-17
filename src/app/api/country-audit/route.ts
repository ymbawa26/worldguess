import { NextResponse } from "next/server";

import {
  type AuditQuestionPayload,
  verifyCountryAnswersOnline,
} from "@/lib/online-country-audit";

export const dynamic = "force-dynamic";

type AuditRequestBody = {
  revealedCountryName?: string;
  questions?: AuditQuestionPayload[];
};

export async function POST(request: Request) {
  let body: AuditRequestBody;

  try {
    body = (await request.json()) as AuditRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid audit payload." },
      { status: 400 },
    );
  }

  if (!body.revealedCountryName || !Array.isArray(body.questions)) {
    return NextResponse.json(
      { error: "Audit payload is missing the revealed country or question history." },
      { status: 400 },
    );
  }

  try {
    const result = await verifyCountryAnswersOnline(
      body.revealedCountryName,
      body.questions,
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        available: false,
        resolvedCountryName: body.revealedCountryName,
        checks: [],
        note: "The online references could not be reached for this audit.",
      },
      { status: 200 },
    );
  }
}
