import { createDecartClient, models } from "@decartai/sdk";
import type { Garment } from "../garments";

export const model = models.realtime("lucy-vton-latest");

export const getCamera = () =>
  navigator.mediaDevices.getUserMedia({
    video: { frameRate: model.fps, width: model.width, height: model.height },
  });

const blobs = new Map<string, Promise<Blob>>();
export const garmentBlob = (url: string) => {
  if (!blobs.has(url)) blobs.set(url, fetch(url).then((r) => r.blob()));
  return blobs.get(url)!;
};

export async function connectDecart(stream: MediaStream, g: Garment, onRemote: (s: MediaStream) => void) {
  // 1. short-lived client token from our server (permanent key never reaches the browser)
  const res = await fetch("/api/tokens", { method: "POST" });
  if (!res.ok) throw new Error("token");
  const { apiKey } = await res.json();

  // 2. WebRTC connection; first garment is applied before the first frame
  const client = createDecartClient({ apiKey });
  return client.realtime.connect(stream, {
    model,
    mirror: true, // desktop webcams: output comes back in mirror orientation
    onRemoteStream: onRemote,
    initialState: { prompt: { text: g.prompt, enhance: false }, image: await garmentBlob(g.image) },
  });
}

export type RT = Awaited<ReturnType<typeof connectDecart>>;

// Swap garment on the live session — no reconnect, camera keeps running.
export async function switchGarment(rt: RT, g: Garment) {
  await rt.set({ prompt: g.prompt, image: await garmentBlob(g.image), enhance: false });
}
