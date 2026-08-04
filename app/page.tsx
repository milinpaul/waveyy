import WaveStrip from "@/components/wave/WaveStrip";

const LOGOS = ["Northwind", "Contoso", "Initech", "Globex", "Umbrella", "Soylent"];

const FEATURES = [
  {
    title: "Layered silk",
    body: "Three translucent ribbons share a single twist, so the surface reads as one piece of fabric rather than stacked planes.",
  },
  {
    title: "Two-sided colour",
    body: "The face is champagne, the reverse cornflower. Colour is placed by geometry — it appears wherever the band folds over on itself.",
  },
  {
    title: "One shader pass",
    body: "Displacement, shading and film grain all resolve on the GPU in a single custom material. No textures, no post-processing.",
  },
];

const STATS = [
  { value: "60fps", label: "on integrated graphics" },
  { value: "3", label: "draw calls" },
  { value: "0", label: "texture fetches" },
];

export default function Home() {
  return (
    <div className="min-h-svh bg-white text-zinc-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">Waveyy</span>
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 sm:flex">
          <a className="transition-colors hover:text-zinc-900" href="#features">
            Features
          </a>
          <a className="transition-colors hover:text-zinc-900" href="#craft">
            Craft
          </a>
          <a className="transition-colors hover:text-zinc-900" href="#start">
            Docs
          </a>
        </nav>
        <a
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          href="#start"
        >
          Get started
        </a>
      </header>

      <main>
        {/* Hero — fills the viewport, with the wave anchored along its base. */}
        <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-10 text-center">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
              Waveyy
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-500">
              A hero background, woven from layered silk.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                href="#start"
              >
                Get started
              </a>
              <a
                className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                href="#features"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="relative h-56 w-full shrink-0 sm:h-72 lg:h-80">
            <WaveStrip />
          </div>
        </section>

        <section className="border-y border-zinc-100 bg-zinc-50/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6 py-10">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-base font-semibold tracking-tight text-zinc-400"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#1F6FE0]">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for the front of the page
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-500">
              Everything renders in real time, sized to its container, and
              composites cleanly onto a light background.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-100 bg-white p-7"
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-zinc-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="craft" className="border-y border-zinc-100 bg-zinc-50/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-12 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="start" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Drop it into your next project
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-500">
              One component, a handful of props, and a container to size it.
            </p>
            <a
              className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              href="#start"
            >
              Read the docs
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-zinc-500 sm:flex-row">
          <span>Waveyy</span>
          <span>Built with Three.js and React Three Fiber.</span>
        </div>
      </footer>
    </div>
  );
}
