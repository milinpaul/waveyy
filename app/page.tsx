import WaveStrip from "@/components/wave/WaveStrip";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white pt-20 sm:pt-28">
      <main className="flex flex-col items-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
          Waveyy
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-500">
          A hero background, woven from layered silk.
        </p>
      </main>

      <div className="relative mt-10 h-56 w-full sm:mt-12 sm:h-80 lg:h-[26rem]">
        <WaveStrip />
      </div>
    </div>
  );
}
