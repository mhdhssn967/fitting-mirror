export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="h-full flex flex-col items-center justify-center text-center px-8">
      <img src="/logo_transp.png" alt="Company Logo" className="h-24 md:h-32 mb-6 invert" />
      <p className="mt-6 text-xl md:text-2xl text-neutral-500">Stand in front of the camera and choose an outfit.</p>
      <button onClick={onStart}
        className="mt-14 rounded-full bg-ink text-white px-16 py-6 text-2xl font-medium tracking-widest active:scale-95 transition-transform">
        START MIRROR
      </button>
    </main>
  );
}
