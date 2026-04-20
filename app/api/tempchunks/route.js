export async function PUT(req) {
  const { chunkSize } = await req.json();

  let speed = Number((Math.random() * 10240).toFixed(0)) * 1024;
  const stream = new ReadableStream({
    async start(controller) {
      let sent = 0;

      let lastUpdate = Date.now();
      while (sent < chunkSize) {
        let chunk = Math.min(64 * 1024, chunkSize - sent); // 64KB chunks
        let now = Date.now();
        if (now - lastUpdate > 800) {
          speed = Number((Math.random() * 1536).toFixed(0)) * 1024;
          lastUpdate = now;
        }
        // fake data
        const buffer = new Uint8Array(chunk);

        controller.enqueue(buffer);
        sent += chunk;

        // simulate speed
        await new Promise((r) => setTimeout(r, (chunk / speed) * 1000));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}
