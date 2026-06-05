import { anthropic } from '@ai-sdk/anthropic';
import { streamText, type CoreMessage } from 'ai';
import { getReport } from '@/lib/reports';
import { buildSystemPrompt } from '@/lib/system-prompt';
import type { Mode } from '@/lib/mode';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: CoreMessage[];
    reportId: string;
    mode: Mode;
  };
  const report = getReport(body.reportId);
  if (!report) {
    return new Response(JSON.stringify({ error: 'Informe no encontrado' }), { status: 404 });
  }

  const system = buildSystemPrompt(report, body.mode);

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system,
    messages: body.messages,
    temperature: 0.4,
    maxTokens: 600,
  });

  return result.toDataStreamResponse();
}
