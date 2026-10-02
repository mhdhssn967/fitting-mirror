import { useCallback, useEffect, useRef, useState } from "react";
import { garments } from "../garments";
import { connectDecart, getCamera, garmentBlob, switchGarment, type RT } from "../services/decart";
import GarmentSelector from "./GarmentSelector";
import StatusIndicator from "./StatusIndicator";

type Phase = "starting" | "live" | "demo" | "camera-error" | "connect-error";
const DEMO_FALLBACK = import.meta.env.VITE_DEMO_MODE === "true";
const DEMO_FORCED = new URLSearchParams(location.search).has("demo"); // open /?demo=1 to skip Decart

export default function VirtualMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rtRef = useRef<RT | null>(null);
  const [phase, setPhase] = useState<Phase>("starting");
  const [remote, setRemote] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoVideoOk, setDemoVideoOk] = useState(true);
  const [activeId, setActiveId] = useState(garments[0].id);
  const [toast, setToast] = useState("");

  const cleanup = () => {
    rtRef.current?.disconnect();
    rtRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = useCallback(async () => {
    cleanup();
    setPhase("starting"); setRemote(false); setGenerating(false); setActiveId(garments[0].id);

    let stream: MediaStream;
    try { stream = await getCamera(); } catch { setPhase("camera-error"); return; }
    streamRef.current = stream;
    if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
    garments.forEach((g) => garmentBlob(g.image)); // preload so switching is instant

    if (DEMO_FORCED) { setPhase("demo"); return; }
    try {
      const rt = await connectDecart(stream, garments[0], (s) => {
        if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play().catch(() => {}); }
        setRemote(true);
      });
      rtRef.current = rt;
      rt.on("connectionChange", (s) => {
        setGenerating(s === "generating");
        if (s === "disconnected") setPhase("connect-error");
      });
      setPhase("live");
    } catch (e) {
      console.error(e);
      rtRef.current?.disconnect(); rtRef.current = null;
      setPhase(DEMO_FALLBACK ? "demo" : "connect-error");
    }
  }, []);

  useEffect(() => { start(); return cleanup; }, [start]);

  const pick = async (id: string) => {
    const g = garments.find((x) => x.id === id)!;
    if (phase === "demo") return setActiveId(id);
    if (phase !== "live" || !rtRef.current || busy) return;
    setBusy(true);
    try { await switchGarment(rtRef.current, g); setActiveId(id); }
    catch (e) {
      console.error(e); setToast("Couldn't switch outfits. Please try again.");
      setTimeout(() => setToast(""), 3500);
    } finally { setBusy(false); }
  };

  const label = phase === "starting" ? "Preparing your virtual fitting mirror..."
    : busy || (phase === "live" && !generating) ? "AI fitting in progress..." : "LIVE TRY-ON";
  const demoOn = phase === "demo" && demoVideoOk;
  const failed = phase === "camera-error" || phase === "connect-error";

  return (
    <main className="h-full flex flex-col">
      <header className="pt-5 pb-3 flex flex-col items-center text-center">
        <img src="/logo_transp.png" alt="Company Logo" className="h-10 mb-2 invert" />
        <p className="text-sm text-neutral-500">See how it looks on you — live.</p>
      </header>

      <div className="flex-1 min-h-0 flex justify-center px-6">
        <div className="relative h-full aspect-[3/4] max-w-full overflow-hidden rounded-[2rem] border border-line bg-neutral-200">
          <video ref={videoRef} autoPlay playsInline muted
            className={`h-full w-full object-cover ${remote ? "" : "-scale-x-100"}`} />
          {demoOn && (
            <video src="/demo/tryon-demo.mp4" autoPlay loop muted playsInline
              onError={() => setDemoVideoOk(false)} className="absolute inset-0 h-full w-full object-cover" />
          )}
          {!failed && (
            <div className="absolute left-4 top-4 flex gap-2">
              <StatusIndicator label={label} live={phase === "live" && generating && !busy} />
              {demoOn && <span className="rounded-full bg-ink text-white px-3 py-2 text-xs tracking-widest">DEMO</span>}
            </div>
          )}
          {toast && <div className="absolute inset-x-6 bottom-6 rounded-full bg-ink text-white py-3 text-center text-sm">{toast}</div>}
          {failed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white/95 p-8 text-center">
              <p className="text-xl">{phase === "camera-error"
                ? "Camera access is required for the virtual fitting mirror."
                : "We couldn't start the virtual fitting mirror."}</p>
              <button onClick={start} className="rounded-full bg-ink text-white px-12 py-4 text-lg tracking-widest">
                {phase === "camera-error" ? "Try Again" : "Retry"}
              </button>
            </div>
          )}
        </div>
      </div>

      <GarmentSelector activeId={activeId} busy={busy || phase === "starting"} onPick={pick} />
    </main>
  );
}
