import Head from "next/head";
import { useState } from "react";
import { FaArrowRight, FaFeatherAlt, FaFilm, FaMicrophone, FaSearch } from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { useRouter } from "next/router";

import { AUTHOR, WIT_STUDIO_STAFF, VOICE_ACTORS } from "../constants/team";

const fallbackAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7f1d1d&color=f5f5f4&size=256&bold=true`;

const slugifyChars = (str) =>
    (str || "")
        .split(" ")[0]
        .toLowerCase()

const slugifyCharacters = (str) =>
    (str || "")
        .toLowerCase()
        .replace(" ", "-")

function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-red-700 text-xs" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-black/40 torn-border rounded-sm pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-red-700"
            />
        </div>
    );
}

export default function Team() {
    const router = useRouter();

    const [authorSearch, setAuthorSearch] = useState("");
    const [staffSearch, setStaffSearch] = useState("");
    const [vaSearch, setVaSearch] = useState("");

    const authorMatches =
        AUTHOR.name.toLowerCase().includes(authorSearch.toLowerCase()) ||
        AUTHOR.role.toLowerCase().includes(authorSearch.toLowerCase());

    const filteredStaff = WIT_STUDIO_STAFF.filter(
        (member) =>
            member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
            member.role.toLowerCase().includes(staffSearch.toLowerCase())
    );

    const filteredVA = VOICE_ACTORS.filter(
        (va) =>
            va.name.toLowerCase().includes(vaSearch.toLowerCase()) ||
            va.character.toLowerCase().includes(vaSearch.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>AOT Wiki — Cast & Crew</title>
                <meta
                    name="description"
                    content="Meet the people behind Attack on Titan: creator Hajime Isayama, the WIT Studio crew, and the voice actors who brought the story to life."
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
        .horror-flicker { animation: flicker 5s infinite; }
        .font-scream { font-family: 'Nosifer', 'Cinzel Decorative', serif; }
        .font-gothic { font-family: 'Cinzel Decorative', serif; }
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
                <section className="relative border-b border-white/5 py-20 sm:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,10,10,0.28),transparent_60%)]" />
                    <div className="relative max-w-[1600px] mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                            <GiCrossedSwords className="text-red-700 text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold horror-flicker">
                                Behind the Walls
                            </span>
                        </div>
                        <h1 className="font-scream text-4xl leading-[0.95] sm:text-6xl lg:text-7xl tracking-tight text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85),0_0_45px_rgba(90,0,0,0.6)]">
                            CAST &amp; <span className="text-red-700 [text-shadow:0_0_25px_rgba(180,10,10,0.9)]">CREW</span>
                        </h1>
                        <p className="mt-5 max-w-2xl mx-auto text-stone-400 text-sm sm:text-base lg:text-lg leading-relaxed">
                            The mangaka, the WIT Studio crew, and the voice cast who dedicated
                            their hearts to bringing Attack on Titan to life.
                        </p>
                    </div>
                </section>

                <section className="relative border-b border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Creator
                            </span>
                        </div>
                        <div className="w-full flex flex-wrap justify-between items-end gap-4 mb-8 sm:mb-12">
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                Original Author
                            </h2>
                            <SearchInput
                                value={authorSearch}
                                onChange={setAuthorSearch}
                                placeholder="Rechercher l'auteur..."
                            />
                        </div>

                        {authorMatches ? (
                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 sm:gap-10 items-center rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                                <div className="jagged-frame torn-border overflow-hidden aspect-square w-full max-w-[220px] mx-auto md:mx-0 shadow-lg">
                                    <img
                                        src={`/team/${AUTHOR.name}.jpg`}
                                        alt={AUTHOR.name}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = fallbackAvatar(AUTHOR.name);
                                        }}
                                        className="w-full h-full object-cover grayscale-[10%]"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaFeatherAlt className="text-red-600" />
                                        <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-red-500 font-bold">
                                            {AUTHOR.role}
                                        </p>
                                    </div>
                                    <h3 className="font-gothic text-2xl sm:text-3xl font-black text-stone-100 mb-3">
                                        {AUTHOR.name}
                                    </h3>
                                    <p className="text-stone-400 leading-relaxed text-sm sm:text-base max-w-2xl">
                                        {AUTHOR.desc}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-stone-600 text-sm italic">Aucun résultat.</p>
                        )}
                    </div>
                </section>

                <section className="relative bg-[#0d0c0b] border-b border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Animation Studio
                            </span>
                        </div>
                        <div className="w-full flex flex-wrap justify-between items-end gap-4 mb-8 sm:mb-12">
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                WIT Studio Crew
                            </h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <p className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm uppercase tracking-wider">
                                    <FaFilm className="text-red-600" /> Seasons 1 – 3
                                </p>
                                <SearchInput
                                    value={staffSearch}
                                    onChange={setStaffSearch}
                                    placeholder="Rechercher un membre..."
                                />
                            </div>
                        </div>

                        {filteredStaff.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredStaff.map((member) => (
                                    <div
                                        key={member.name}
                                        className="group relative rounded-xl overflow-hidden torn-border bg-black/40 backdrop-blur-md p-4 sm:p-5 shadow-lg hover:shadow-[0_0_35px_rgba(150,0,0,0.4)] transition-all duration-500 hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden torn-border shrink-0 grayscale-[15%] group-hover:grayscale-0 transition-all duration-500">
                                                <img
                                                    src={`/team/${member.name}.jpg`}
                                                    alt={member.name}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = fallbackAvatar(member.name);
                                                    }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-stone-100 text-sm sm:text-base leading-tight">
                                                    {member.name}
                                                </p>
                                                <p className="text-[10px] sm:text-[11px] text-red-500 uppercase tracking-wider font-bold mt-1 leading-snug">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-stone-500 text-xs sm:text-[13px] leading-relaxed">
                                            {member.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-stone-600 text-sm italic">Aucun résultat.</p>
                        )}
                    </div>
                </section>

                <section className="relative border-b border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,10,10,0.18),transparent_60%)]" />
                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Voice Cast
                            </span>
                        </div>
                        <div className="w-full flex flex-wrap justify-between items-end gap-4 mb-8 sm:mb-12">
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                Voice Actors
                            </h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <p className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm uppercase tracking-wider">
                                    <FaMicrophone className="text-red-600" /> Original Japanese Cast
                                </p>
                                <SearchInput
                                    value={vaSearch}
                                    onChange={setVaSearch}
                                    placeholder="Rechercher un acteur ou personnage..."
                                />
                            </div>
                        </div>

                        {filteredVA.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {filteredVA.map((va) => (
                                    <div
                                        key={va.name}
                                        className="group relative rounded-xl overflow-hidden torn-border bg-black/40 backdrop-blur-md shadow-lg hover:shadow-[0_0_45px_rgba(150,0,0,0.55)] transition-all duration-500 hover:-translate-y-1"
                                    >
                                        <div className="grid grid-cols-2">
                                            <div className="relative aspect-[3/4] overflow-hidden grayscale-[20%] group-hover:grayscale-0 transition-all duration-500">
                                                <img
                                                    src={`/team/${va.name}.jpg`}
                                                    alt={va.name}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                                                    <p className="text-[9px] sm:text-[11px] text-stone-400 uppercase tracking-wider font-bold">
                                                        Voice
                                                    </p>
                                                    <p className="font-black uppercase text-stone-100 text-xs sm:text-sm leading-tight">
                                                        {va.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="relative aspect-[3/4] overflow-hidden grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 border-l border-red-900/40">
                                                <img
                                                    src={`/chars/${slugifyChars(va.character)}.png`}
                                                    alt={va.character}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = `/characters/${slugifyCharacters(va.character)}.png`;
                                                    }}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                                                    <p className="text-[9px] sm:text-[11px] text-red-500 uppercase tracking-wider font-bold">
                                                        Character
                                                    </p>
                                                    <p className="font-black uppercase text-stone-100 text-xs sm:text-sm leading-tight">
                                                        {va.character}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-stone-600 text-sm italic">Aucun résultat.</p>
                        )}

                        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => router.push("characters")}
                                className="font-gothic group flex items-center justify-center gap-2 bg-gradient-to-b from-red-700 to-red-950 hover:from-red-600 hover:to-red-900 transition-all duration-300 px-5 sm:px-7 py-3 sm:py-3.5 rounded-sm border border-red-900/60 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(120,0,0,0.6)] hover:shadow-[0_0_50px_rgba(180,0,0,0.85)] w-full sm:w-auto"
                            >
                                Meet the Characters
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
