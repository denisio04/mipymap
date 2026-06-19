import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const stream = new ReadableStream({
    async start(controller) {
      let lastCount: number | null = null;

      async function checkAndSend() {
        try {
          const mipyme = await prisma.mipyme.findUnique({
            where: { id },
            select: { interactions: true },
          });
          if (mipyme && mipyme.interactions !== lastCount) {
            const data = `data: ${JSON.stringify({ interactions: mipyme.interactions })}\n\n`;
            controller.enqueue(new TextEncoder().encode(data));
            lastCount = mipyme.interactions;
          }
        } catch {
          /* connection closed */
        }
      }

      await checkAndSend();

      const interval = setInterval(checkAndSend, 5000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
