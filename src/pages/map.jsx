import Head from "next/head";
import {
    FaSkullCrossbones,
    FaMapMarkerAlt,
    FaLock,
    FaGlobeAmericas,
} from "react-icons/fa";
import { GiWorld } from "react-icons/gi";

import { WALLS, WALL_MARIA_PLACES, WALL_ROSE_PLACES, WALL_SINA_PLACES, SPECIAL_SITES, WORLD_PLACES } from "../constants/world";

export default function MapPage() {
    return (
        <>
            <Head>
                <title>World Map — AOT Wiki</title>
                <meta
                    name="description"
                    content="Explore in detail the world behind Wall Maria, Wall Rose, and Wall Sina, along with Paradis Island and the wider world beyond it, in Attack on Titan."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Nosifer&family=Cinzel+Decorative:wght@400;700;900&family=UnifrakturMaguntia&family=Metal+Mania&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style jsx global>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 55%, 57%, 100% { opacity: 1; }
          20%, 22%, 56% { opacity: 0.72; }
        }
        @keyframes bloodDrip {
          0% { height: 0; opacity: 0; }
          40% { opacity: 1; }
          100% { height: 22px; opacity: 1; }
        }
        @keyframes flicker-light {
          0%, 100% { filter: brightness(1) contrast(1.05); }
          50% { filter: brightness(0.88) contrast(1.15); }
        }
        .horror-flicker { animation: flicker 5s infinite; }
        .scene-flicker { animation: flicker-light 6s ease-in-out infinite; }
        .font-scream { font-family: 'Nosifer', 'Cinzel Decorative', serif; }
        .font-gothic { font-family: 'Cinzel Decorative', serif; }
        .font-blackletter { font-family: 'UnifrakturMaguntia', serif; }
        .font-metal { font-family: 'Metal Mania', serif; }
        .drip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          width: 3px;
          background: linear-gradient(to bottom, #7f1d1d, transparent);
          animation: bloodDrip 3s ease-in infinite;
        }
        .jagged-frame {
          clip-path: polygon(
            0% 4%, 2% 0%, 98% 0%, 100% 3%, 99% 12%, 100% 22%, 98% 34%, 100% 46%,
            99% 58%, 100% 70%, 98% 82%, 100% 92%, 97% 100%, 88% 98%, 76% 100%,
            64% 98%, 52% 100%, 40% 98%, 28% 100%, 16% 98%, 4% 100%, 0% 96%,
            2% 84%, 0% 72%, 2% 60%, 0% 48%, 2% 36%, 0% 24%, 2% 12%
          );
        }
        .torn-border {
          border: 2px solid rgba(153, 27, 27, 0.55);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 25px rgba(140,10,10,0.25), inset 0 0 30px rgba(0,0,0,0.6);
        }
        .crack-overlay {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><path d=%22M10 10 L80 60 L60 120 L140 100 L120 200 L200 180 L180 280%22 stroke=%22rgba(255,255,255,0.06)%22 stroke-width=%221%22 fill=%22none%22/><path d=%22M280 20 L220 90 L260 140 L190 170 L230 250%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%221%22 fill=%22none%22/></svg>');
        }
      `}</style>

            <main className="min-h-screen bg-[#0a0908] text-stone-200 font-sans antialiased selection:bg-red-900/60 crack-overlay overflow-x-hidden">
                {/* HERO */}
                <section className="relative min-h-[90svh] w-full overflow-hidden">
                    <div className="scene-flicker absolute inset-0 bg-cover bg-center scale-105 grayscale-[15%] contrast-125"
                        style={{ backgroundImage: "url('/eyecatch/S1E1-1.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a0908] via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,10,10,0.35),transparent_60%)]" />
                    <div className="absolute inset-0 shadow-[inset_0_0_220px_140px_rgba(0,0,0,0.95)]" />

                    <div className="relative z-10 max-w-[1600px] mx-auto min-h-[90svh] px-4 sm:px-6 lg:px-10 flex flex-col justify-center pt-24 pb-16">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <GiWorld className="text-red-700 text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold horror-flicker">
                                Cartography of Paradis
                            </span>
                        </div>

                        <h1 className="relative font-scream text-4xl leading-[0.95] sm:text-6xl lg:text-7xl xl:text-[6.5rem] tracking-tight text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85),0_0_45px_rgba(90,0,0,0.6),0_6px_0_rgba(0,0,0,0.9)]">
                            THE WORLD{" "}
                            <span className="text-red-700 [text-shadow:0_0_25px_rgba(180,10,10,0.9),0_0_60px_rgba(150,0,0,0.7)]">
                                BEHIND THE WALLS
                            </span>
                            <span className="drip absolute -bottom-2 left-6"></span>
                        </h1>

                        <div className="mt-4 sm:mt-5 flex items-center gap-3">
                            <span className="h-[2px] w-8 sm:w-10 bg-red-700" />
                            <p className="font-gothic uppercase tracking-[0.2em] sm:tracking-[0.3em] text-red-600 font-bold text-xs sm:text-base">
                                Maria · Rose · Sina
                            </p>
                        </div>

                        <p className="mt-5 sm:mt-6 max-w-2xl text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                            For more than a century, humanity has survived locked behind three
                            concentric walls standing fifty meters tall. Explore every wall,
                            every district, and every landmark revealed throughout the story —
                            and beyond, to Paradis Island itself and the wider world across the sea.
                        </p>

                        <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:flex sm:flex-wrap gap-6 sm:gap-8 lg:gap-14">
                            {[
                                { n: "3", l: "Concentric Walls" },
                                { n: "50m", l: "Official Height" },
                                { n: "845", l: "Fall of Shiganshina" },
                                { n: "850", l: "Fall of Trost" },
                            ].map((s) => (
                                <div key={s.l} className="flex flex-col">
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-100">
                                        {s.n}
                                    </span>
                                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-500 mt-1">
                                        {s.l}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* THE THREE WALLS DIAGRAM */}
                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black/90 to-[#0a0908]" />
                    <div className="relative max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-[2px] w-8 bg-red-600" />
                                <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                    Structure
                                </span>
                            </div>
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-4 sm:mb-6">
                                Three circles of survival
                            </h2>
                            <p className="text-stone-400 leading-relaxed mb-4 max-w-md text-sm sm:text-base">
                                The territory of Paradis is organized into three concentric rings:
                                Wall Maria on the outside, Wall Rose at the center, and Wall Sina at
                                the heart of the kingdom, protecting the capital Mitras. The closer
                                a resident lives to the center, the further they are from danger —
                                and the more privileged their standing tends to be.
                            </p>
                            <p className="text-stone-400 leading-relaxed max-w-md text-sm sm:text-base">
                                This ring-shaped layout isn't only about defense: it mirrors the
                                island's entire social hierarchy, from the nobles of Mitras to the
                                refugees crowded into the outskirts of Wall Rose, down to the
                                forgotten souls of the Underground City.
                            </p>
                        </div>

                        <div className="relative aspect-square flex items-center justify-center">
                            <img src="/eyecatch/walls.png" alt="" />
                        </div>
                    </div>
                </section>

                {/* WALL DETAILS + DISTRICTS */}
                {WALLS.map((wall, wi) => {
                    const places = [WALL_MARIA_PLACES, WALL_ROSE_PLACES, WALL_SINA_PLACES][wi];
                    return (
                        <section
                            key={wall.name}
                            className={`relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 ${wi % 2 === 1 ? "bg-[#0d0c0b]" : "bg-[#0a0908]"
                                }`}
                        >
                            <div className="max-w-[1600px] mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-10 sm:mb-14">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="h-[2px] w-8 bg-red-600" />
                                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                                {wall.subtitle}
                                            </span>
                                        </div>
                                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-4 sm:mb-6">
                                            {wall.name}
                                        </h2>
                                        <p className="text-stone-400 leading-relaxed max-w-xl text-sm sm:text-base">
                                            {wall.desc}
                                        </p>
                                    </div>
                                    <div className={`relative rounded-sm overflow-hidden torn-border shadow-2xl aspect-video`}>
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-80"
                                            style={{ backgroundImage: `url(${wall.img})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <FaMapMarkerAlt className="text-red-600" />
                                    <span className="font-metal uppercase text-xs tracking-[0.3em] text-stone-400 font-bold">
                                        Notable places of {wall.name}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {places.map((p) => (
                                        <div
                                            key={p.name}
                                            className="jagged-frame group relative overflow-hidden torn-border shadow-lg hover:shadow-[0_0_45px_rgba(150,0,0,0.55)] transition-all duration-500 hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-[4/3]">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                                    style={{ backgroundImage: `url(${p.img})` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            </div>
                                            <div className="p-4 sm:p-5 bg-black/60">
                                                <p className="font-black uppercase text-stone-100 text-sm sm:text-base leading-tight mb-2">
                                                    {p.name}
                                                </p>
                                                <p className="text-xs sm:text-[13px] text-stone-400 leading-relaxed">
                                                    {p.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}

                {/* BURIED SECRETS / SPECIAL PLACES */}
                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{ backgroundImage: "url('/eyecatch/secrets.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <FaLock className="text-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Buried Secrets
                            </span>
                        </div>

                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-8 sm:mb-12">
                            Key Places of the Plot
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                            {SPECIAL_SITES.map((site) => {
                                const Icon = site.icon;
                                return (
                                    <div
                                        key={site.name}
                                        className="group relative overflow-hidden rounded-2xl torn-border bg-stone-950/70 backdrop-blur-md shadow-2xl hover:shadow-[0_0_45px_rgba(150,0,0,0.45)] transition-all duration-500"
                                    >
                                        <div className="relative aspect-video">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center grayscale-[25%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                                style={{ backgroundImage: `url(${site.img})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                            <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/60 border border-red-800/50 flex items-center justify-center">
                                                <Icon className="text-red-600 text-lg" />
                                            </div>
                                        </div>
                                        <div className="p-5 sm:p-6">
                                            <h3 className="text-base sm:text-lg font-black uppercase text-stone-100 mb-2">
                                                {site.name}
                                            </h3>
                                            <p className="text-stone-400 leading-relaxed text-xs sm:text-sm">
                                                {site.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* BEYOND THE WALLS — PARADIS ISLAND & THE WIDER WORLD */}
                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 bg-[#0d0c0b] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-15"
                        style={{ backgroundImage: "url('/world/world-map.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d0c0b] via-black/85 to-[#0d0c0b]" />

                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <FaGlobeAmericas className="text-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Beyond the Walls
                            </span>
                        </div>

                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-4 sm:mb-6">
                            Paradis Island &amp; The Wider World
                        </h2>
                        <p className="text-stone-400 leading-relaxed max-w-2xl text-sm sm:text-base mb-8 sm:mb-12">
                            The three walls only ever protected a fraction of Paradis Island, and
                            Paradis itself is only a fraction of the world. Once the ocean is
                            reached, the story widens far past anything the walls' inhabitants
                            were ever told — revealing a mainland nation, an entire global order
                            built on fear of the Titans, and other peoples who watched Paradis
                            from across the sea.
                        </p>

                        <div className="relative rounded-sm overflow-hidden torn-border shadow-2xl aspect-[21/9] mb-10 sm:mb-14">
                            <div
                                className="absolute inset-0 bg-cover bg-center fullworld"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                                <span className="font-gothic text-stone-100 font-black uppercase tracking-wide text-sm sm:text-base [text-shadow:0_0_10px_rgba(0,0,0,0.9)]">
                                    Full World Map
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                            {WORLD_PLACES.map((place) => {
                                const Icon = place.icon;
                                return (
                                    <div
                                        key={place.name}
                                        className="group relative overflow-hidden rounded-2xl torn-border bg-stone-950/70 backdrop-blur-md shadow-2xl hover:shadow-[0_0_45px_rgba(150,0,0,0.45)] transition-all duration-500"
                                    >
                                        <div className="relative aspect-video">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center grayscale-[25%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                                style={{ backgroundImage: `url(${place.img})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                            <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/60 border border-red-800/50 flex items-center justify-center">
                                                <Icon className="text-red-600 text-lg" />
                                            </div>
                                        </div>
                                        <div className="p-5 sm:p-6">
                                            <h3 className="text-base sm:text-lg font-black uppercase text-stone-100 mb-2">
                                                {place.name}
                                            </h3>
                                            <p className="text-stone-400 leading-relaxed text-xs sm:text-sm">
                                                {place.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CLOSING QUOTE */}
                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="torn-border rounded-sm bg-gradient-to-br from-red-950/50 to-black/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                            <p className="font-blackletter text-4xl sm:text-5xl text-red-800 mb-2 [text-shadow:0_0_18px_rgba(150,0,0,0.7)]">"</p>
                            <p className="font-blackletter text-2xl sm:text-3xl text-stone-100 leading-snug">
                                この壁の向こうに
                            </p>
                            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-red-700 font-bold font-gothic">
                                Beyond this wall
                            </p>
                        </div>

                        <div className="torn-border rounded-sm bg-black/60 backdrop-blur-md p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center">
                            <FaSkullCrossbones className="text-3xl sm:text-4xl text-red-700 mb-4 drop-shadow-[0_0_12px_rgba(150,0,0,0.7)]" />
                            <p className="uppercase tracking-[0.25em] text-xs text-stone-400 mb-1">
                                Survey Corps
                            </p>
                            <p className="font-gothic text-stone-200 font-black">
                                Mapping the world
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}