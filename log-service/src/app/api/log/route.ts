import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Container } from "../../../ioc/container";
import { LogService } from "../../../services/log.service";
import { env } from "../../../config/env";

const logSchema = z.object({
  severity: z.enum(["info", "warn", "error", "debug"]),
  message: z.string(),
  timestamp: z.string().datetime(),
  serviceId: z.string(),
});

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = logSchema.parse(body);

    const logService = Container.get(LogService);
    await logService.createLog(validatedData);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
