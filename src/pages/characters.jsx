import Head from "next/head";
import {
    FaSkullCrossbones,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";

import { FACTIONS } from '../constants/characters';

export default function CharactersPage() {
    const totalCharacters = FACTIONS.reduce((sum, f) => sum + f.characters.length, 0);
    return (
        <>
            <Head>
                <title>Characters — AOT Wiki</title>
                <meta
                    name="description"
                    content="Every Attack on Titan character, organized by faction: Scout Regiment, Military Police, Garrison, Cadet Corps, Marley, the Warriors, House Reiss, the Tybur family, and more."
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
                <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,10,10,0.35),transparent_60%)]" />
                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <GiCrossedSwords className="text-red-700 text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold horror-flicker">
                                Faces of the War
                            </span>
                        </div>

                        <h1 className="font-scream text-4xl sm:text-6xl lg:text-7xl tracking-tight text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85),0_0_45px_rgba(90,0,0,0.6)]">
                            ALL <span className="text-red-700 [text-shadow:0_0_25px_rgba(180,10,10,0.9),0_0_60px_rgba(150,0,0,0.7)]">CHARACTERS</span>
                        </h1>

                        <p className="mt-5 sm:mt-6 max-w-2xl text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                            From the Scout Regiment's fallen heroes to Marley's Warrior
                            candidates, the hidden Reiss bloodline, and every soldier,
                            civilian, and legend in between — {totalCharacters} characters,
                            grouped by the faction they served. Hover over a portrait to
                            reveal their story.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {FACTIONS.map((f) => (
                                <a
                                    key={f.id}
                                    href={`#${f.id}`}
                                    className="text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-red-500 hover:border-red-700/50 transition-colors"
                                >
                                    {f.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FACTIONS */}
                {FACTIONS.map((faction, fi) => (
                    <section
                        id={faction.id}
                        key={faction.id}
                        className={`relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 ${fi % 2 === 1 ? "bg-[#0d0c0b]" : "bg-[#0a0908]"
                            }`}
                    >
                        <div className="max-w-[1600px] mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 mb-10 sm:mb-14">
                                <img
                                    src={faction.logo}
                                    alt={faction.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                                />
                                <div>
                                    <span className={`font-metal uppercase text-xs tracking-[0.35em] font-bold ${faction.chipColor}`}>
                                        {faction.tagline}
                                    </span>
                                    <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                        {faction.name}
                                    </h2>
                                    <p className="text-stone-400 leading-relaxed max-w-2xl text-sm sm:text-base mt-2">
                                        {faction.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-6">
                                {faction.characters.map((c) => (
                                    <div
                                        key={c.name}
                                        tabIndex={0}
                                        className={`jagged-frame group relative overflow-hidden torn-border aspect-[3/4] shadow-lg transition-all duration-500 hover:-translate-y-1 grayscale-[20%] hover:grayscale-0 focus:grayscale-0 ${faction.accent}`}
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 group-focus:scale-110 transition-transform duration-700"
                                            style={{ backgroundImage: `url(${c.img})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                        {/* default label */}
                                        <div className="absolute bottom-0 p-2.5 sm:p-4 transition-opacity duration-300 group-hover:opacity-0 group-focus:opacity-0">
                                            <p className="font-black uppercase text-stone-100 text-xs sm:text-sm lg:text-base leading-tight">
                                                {c.name}
                                            </p>
                                            <p className={`text-[9px] sm:text-[8px] uppercase tracking-wider font-bold mt-1 ${faction.chipColor}`}>
                                                {c.role}
                                            </p>
                                        </div>

                                        {/* hover description */}
                                        <div className="absolute inset-0 bg-black/92 backdrop-blur-[2px] p-3 sm:p-4 flex flex-col justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0 transition-all duration-300">
                                            <p className="font-black uppercase text-stone-100 text-xs sm:text-sm leading-tight mb-1">
                                                {c.name}
                                            </p>
                                            <p className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mb-2 ${faction.chipColor}`}>
                                                {c.role}
                                            </p>
                                            <p className="text-[10px] sm:text-[11.5px] text-stone-300 leading-relaxed">
                                                {c.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}

                {/* CLOSING QUOTE */}
                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="torn-border rounded-sm bg-gradient-to-br from-red-950/50 to-black/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                            <p className="font-blackletter text-4xl sm:text-5xl text-red-800 mb-2 [text-shadow:0_0_18px_rgba(150,0,0,0.7)]">"</p>
                            <p className="font-blackletter text-2xl sm:text-3xl text-stone-100 leading-snug">
                                心臓を捧げよ
                            </p>
                            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-red-700 font-bold font-gothic">
                                Dedicate your heart
                            </p>
                        </div>

                        <div className="torn-border rounded-sm bg-black/60 backdrop-blur-md p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center">
                            <FaSkullCrossbones className="text-3xl sm:text-4xl text-red-700 mb-4 drop-shadow-[0_0_12px_rgba(150,0,0,0.7)]" />
                            <p className="uppercase tracking-[0.25em] text-xs text-stone-400 mb-1">
                                Every side of the war
                            </p>
                            <p className="font-gothic text-stone-200 font-black">
                                Scouts, Warriors, and Kings alike
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}