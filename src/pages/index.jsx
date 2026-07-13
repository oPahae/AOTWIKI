import Head from "next/head";
import {
    FaPlay,
    FaArrowRight,
    FaMusic,
    FaPause,
    FaSkullCrossbones,
    FaVolumeUp,
    FaGamepad
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";

import { TIMELINE, GALLERY, SOCIAL_LINKS } from "../constants/infos";
import { TOP_EPS_S1, TOP_EPS_S2, TOP_EPS_S3, TOP_EPS_S4 } from "../constants/episodes";
import { OSTS_LANDING } from "../constants/osts";
import { LOGOS } from "../constants/logos";
import { CHARACTERS_LANDING } from "../constants/characters";
import { AUTHOR, WIT_STUDIO_STAFF } from "../constants/team";
import { SONGS } from "../constants/songs";
import { useRouter } from "next/router";
import Link from "next/link";

const fallbackAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7f1d1d&color=f5f5f4&size=256&bold=true`;

const TEAM_PREVIEW = [AUTHOR, ...WIT_STUDIO_STAFF.slice(0, 4)];

export default function Home() {
    const router = useRouter();
    const audioRef = useRef(null);

    const [currentTrack, setCurrentTrack] = useState(OSTS_LANDING[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [booted, setBooted] = useState(false);

    const nextSectionRef = useRef(null);

    const scrollToNextSection = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        const t = setTimeout(() => setBooted(true), 150);
        return () => clearTimeout(t);
    }, []);

    const formatTime = (time) => {
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const parseTime = (time) => {
        const [m, s] = time.split(":").map(Number);
        return m * 60 + s;
    };

    const playTrack = (track) => {
        setCurrentTrack(track);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 50);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    const jumpToBestPart = () => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = parseTime(currentTrack.bestPart);
    };

    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.load();

        if (isPlaying) {
            audioRef.current.play();
        }
    }, [currentTrack]);

    // Ferme le menu mobile automatiquement si on repasse en desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const progress =
        duration === 0 ? 0 : (currentTime / duration) * 100;

    const seekAudio = (e) => {
        const value = Number(e.target.value);

        audioRef.current.currentTime = value;
        setCurrentTime(value);
    };

    const [volume, setVolume] = useState(1);

    const changeVolume = (e) => {
        const value = Number(e.target.value);

        setVolume(value);

        if (audioRef.current) {
            audioRef.current.volume = value;
        }
    };

    return (
        <>
            <Head>
                <title>AOT Wiki — Dedicated to Freedom</title>
                <meta
                    name="description"
                    content="AOT Wiki, your ultimate source for everything about Attack on Titan."
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
                <section className="relative min-h-[100svh] w-full overflow-hidden">
                    <div className="scene-flicker absolute inset-0 bg-cover bg-center scale-105 grayscale-[15%] contrast-125 hero3" />
                    <div className="absolute inset-0 bg-linear-to-t from-transparent via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,10,10,0.35),transparent_60%)]" />
                    <div className="absolute inset-0 shadow-[inset_0_0_220px_140px_rgba(0,0,0,0.95)]" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.05%22/></svg>')] pointer-events-none" />

                    <div className="relative z-10 max-w-[1600px] mx-auto min-h-[100svh] px-4 sm:px-6 lg:px-10 flex flex-col justify-center pt-24 pb-16 sm:pt-20 sm:pb-0">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <GiCrossedSwords className="text-red-700 text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold horror-flicker">
                                Scout Regiment Archives
                            </span>
                        </div>

                        <h1 className="relative font-scream text-4xl leading-[0.95] sm:text-6xl lg:text-8xl xl:text-[7.5rem] tracking-tight text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85),0_0_45px_rgba(90,0,0,0.6),0_6px_0_rgba(0,0,0,0.9)]">
                            AOT{" "}
                            <span className="text-red-700 [text-shadow:0_0_25px_rgba(180,10,10,0.9),0_0_60px_rgba(150,0,0,0.7)]">
                                WIKI
                            </span>
                            <span className="drip absolute -bottom-2 left-6"></span>
                            <span className="drip absolute -bottom-2 left-1/2" style={{ animationDelay: "1.2s" }}></span>
                        </h1>

                        <div className="mt-4 sm:mt-5 flex items-center gap-3">
                            <span className="h-[2px] w-8 sm:w-10 bg-red-700" />
                            <p className="font-gothic uppercase tracking-[0.2em] sm:tracking-[0.3em] text-red-600 font-bold text-xs sm:text-base">
                                Dedicated to Freedom
                            </p>
                        </div>

                        <p className="mt-5 sm:mt-6 max-w-xl text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                            Welcome to AOT Wiki, your ultimate source for everything about
                            Attack on Titan. Explore characters, Titans, story, locations,
                            and more.
                        </p>

                        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                            <button onClick={scrollToNextSection} className="font-gothic group flex items-center justify-center gap-2 bg-gradient-to-b from-red-700 to-red-950 hover:from-red-600 hover:to-red-900 transition-all duration-300 px-5 sm:px-7 py-3 sm:py-3.5 rounded-sm border border-red-900/60 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(120,0,0,0.6)] hover:shadow-[0_0_50px_rgba(180,0,0,0.85)] w-full sm:w-auto">
                                Explore Wiki
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link href="quiz" className="font-gothic flex items-center justify-center gap-2 border border-red-900/50 bg-black/40 backdrop-blur-md hover:bg-red-950/30 transition-colors pl-5 pr-6 sm:px-7 py-3 sm:py-3.5 rounded-sm font-bold uppercase text-xs sm:text-sm tracking-wider text-stone-300 w-full sm:w-auto">
                                <FaGamepad className="text-lg text-red-600" />
                                Quiz
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            {SOCIAL_LINKS.map(social => (
                                <a
                                    key={social.id}
                                    href={social.link}
                                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-red-700/80 hover:border-red-700 transition-colors text-sm"
                                >
                                    <social.icon className='text-red-600' />
                                </a>
                            )
                            )}
                        </div>

                        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-6 sm:gap-8 lg:gap-14">
                            {[
                                { n: "139", l: "Chapters" },
                                { n: "89", l: "Episodes" },
                                { n: "50+", l: "Osts" },
                                { n: "120+", l: "Characters" },
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

                    <div className="hidden lg:flex flex-col items-center gap-3 absolute bottom-10 right-10 z-10">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 rotate-90 origin-right mb-2">
                            By Pahae Attackontitan
                        </span>
                    </div>
                </section>

                <section ref={nextSectionRef} className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?auto=format&fit=crop&w=1800&q=80')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black/90 to-[#0a0908]" />
                    <div className="relative max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-[2px] w-8 bg-red-600" />
                                <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                    Geography
                                </span>
                            </div>
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-4 sm:mb-6">
                                World Map
                            </h2>
                            <p className="text-stone-400 leading-relaxed mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
                                From the three concentric Walls of Paradis to the distant
                                shores of Marley, trace humanity's territory and the paths of
                                war across the known world.
                            </p>

                            <img src="/eyecatch/map.png" alt="" className="w-full h-auto rounded-sm" />

                            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                                <Link href="map" className="font-gothic group flex items-center justify-center gap-2 bg-gradient-to-b from-red-700 to-red-950 hover:from-red-600 hover:to-red-900 transition-all duration-300 px-5 sm:px-7 py-3 sm:py-3.5 rounded-sm border border-red-900/60 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(120,0,0,0.6)] hover:shadow-[0_0_50px_rgba(180,0,0,0.85)] w-full sm:w-auto">
                                    Explore Places
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="relative rounded-sm overflow-hidden torn-border shadow-2xl aspect-square">
                            <img src="/general/map.jpg" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#0a0908] border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="mx-auto grid grid-cols-1 gap-10 lg:gap-14">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-[2px] w-8 bg-red-600" />
                                <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                    Cast
                                </span>
                            </div>

                            <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-12">
                                <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                    Main Characters
                                </h2>
                                <Link href="characters" className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs sm:text-sm tracking-wide hover:gap-3 transition-all">
                                    View All <FaArrowRight />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                                {CHARACTERS_LANDING.map((ch) => (
                                    <div
                                        key={ch.name}
                                        className="jagged-frame group relative overflow-hidden torn-border aspect-[3/4] shadow-lg hover:shadow-[0_0_45px_rgba(150,0,0,0.55)] transition-all duration-500 hover:-translate-y-1 grayscale-[20%] hover:grayscale-0"
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            style={{ backgroundImage: `url(${ch.img})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 p-2.5 sm:p-4">
                                            <p className="font-black uppercase text-stone-100 text-xs sm:text-sm lg:text-base leading-tight">
                                                {ch.name}
                                            </p>
                                            <p className="text-[9px] sm:text-[11px] text-red-500 uppercase tracking-wider font-bold mt-1">
                                                {ch.role}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#0d0c0b] border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <audio
                        ref={audioRef}
                        src={currentTrack.url}
                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                        onEnded={() => setIsPlaying(false)}
                    />
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <div className="order-2 lg:order-1 relative rounded-sm overflow-hidden torn-border shadow-2xl h-auto min-h-[300px] sm:h-[380px]">
                            <div className="absolute inset-0 bg-cover bg-center soundtrack" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="relative sm:absolute sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-0">
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <button
                                        onClick={togglePlay}
                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-700 hover:bg-red-600 transition flex items-center justify-center shadow-[0_0_30px_rgba(200,40,40,.6)] shrink-0"
                                    >
                                        {isPlaying ? (
                                            <FaPause className="text-lg sm:text-xl" />
                                        ) : (
                                            <FaPlay className="text-lg sm:text-xl translate-x-0.5" />
                                        )}
                                    </button>
                                    <div className="flex-1 min-w-[120px]">
                                        <p className="font-black text-base sm:text-lg text-stone-100 truncate">
                                            {currentTrack.name}
                                        </p>
                                        <p className="text-xs sm:text-sm text-stone-400 truncate">
                                            {currentTrack.artist}
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-3">
                                        <FaVolumeUp className="text-red-500" />
                                        <input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={volume}
                                            onChange={changeVolume}
                                            className="ost-range ost-range--sm"
                                            style={{ "--range-progress": `${volume * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex sm:hidden items-center gap-3 mb-4">
                                    <FaVolumeUp className="text-red-500 shrink-0" />
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={volume}
                                        onChange={changeVolume}
                                        className="ost-range ost-range--sm w-full"
                                        style={{ "--range-progress": `${volume * 100}%` }}
                                    />
                                </div>

                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={seekAudio}
                                    className="ost-range ost-range--seek w-full"
                                    style={{ "--range-progress": `${progress}%` }}
                                />
                                <div className="flex justify-between text-xs text-stone-400 mt-2">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{currentTrack.time}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {currentTrack.bestParts.map((part, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                audioRef.current.currentTime = parseTime(part);
                                            }}
                                            className="px-3 sm:px-4 py-2 rounded-full bg-red-700 hover:bg-red-600 transition font-bold text-[11px] sm:text-xs tracking-wider shadow-lg shadow-red-900/40"
                                        >
                                            {currentTrack.bestParts.length === 1
                                                ? "BEST PART"
                                                : `BEST PART ${index + 1}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="w-full flex flex-wrap justify-between items-start gap-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="h-[2px] w-8 bg-red-600" />
                                    <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                        Soundtrack
                                    </span>
                                </div>
                                <Link href="osts" className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs sm:text-sm tracking-wide hover:gap-3 transition-all">
                                    View All <FaArrowRight />
                                </Link>
                            </div>

                            <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-12">
                                <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                    Original Soundtrack
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                {OSTS_LANDING.map((track) => {
                                    const active = currentTrack.name === track.name;
                                    return (
                                        <button
                                            key={track.name}
                                            onClick={() => playTrack(track)}
                                            className={`group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border transition-all duration-300 text-left ${active
                                                ? "border-red-600 bg-red-900/20 shadow-lg shadow-red-900/20"
                                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-red-700/40"
                                                }`}
                                        >
                                            <div
                                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${active
                                                    ? "bg-red-700 text-white"
                                                    : "bg-white/5 text-red-500 group-hover:bg-red-900/30"
                                                    }`}
                                            >
                                                {active && isPlaying ? (
                                                    <FaPause />
                                                ) : (
                                                    <FaMusic />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-stone-200 text-sm sm:text-base truncate">
                                                    {track.name}
                                                </p>
                                                <p className="text-xs text-stone-500 truncate">
                                                    {track.artist}
                                                </p>
                                            </div>
                                            <span className="text-xs text-stone-500 shrink-0">
                                                {track.time}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#0d0c0b] border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="h-[2px] w-8 bg-red-600" />
                                    <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                        Watch
                                    </span>
                                </div>
                                <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                    Episodes Ratings
                                </h2>
                            </div>
                            <Link href="episodes" className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs sm:text-sm tracking-wide hover:gap-3 transition-all">
                                View All <FaArrowRight />
                            </Link>
                        </div>

                        {[1, 2, 3, 4].map(s => (
                            <>
                                <span className="font-metal uppercase text-sm sm:text-md tracking-[0.35em] text-red-600 font-bold">
                                    Top episodes in season {s}
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-4">
                                    {[TOP_EPS_S1, TOP_EPS_S2, TOP_EPS_S3, TOP_EPS_S4][s - 1].map((e) => (
                                        <div
                                            key={e.title}
                                            className="group relative rounded-sm overflow-hidden torn-border aspect-[21/9] shadow-lg hover:shadow-[0_0_40px_rgba(150,0,0,0.55)] transition-all duration-500"
                                        >
                                            <div
                                                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                                                style={{ backgroundImage: `url(${e.img})` }}
                                            />

                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black to-transparent">
                                                <span className="text-xs sm:text-md uppercase tracking-widest text-red-500 font-bold">
                                                    {e.ep}
                                                </span>
                                                <p className="font-bold text-stone-100 mt-1 text-xs sm:text-sm">
                                                    {e.title}
                                                </p>
                                            </div>

                                            {/* IMDB Rating */}
                                            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg">
                                                <span className="font-black text-black text-[10px] sm:text-xs tracking-wider">
                                                    IMDB
                                                </span>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black"
                                                >
                                                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321 1.01l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.386a.562.562 0 01-.84.61L12 18.354l-4.718 2.848a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557L3.34 10.407a.562.562 0 01.321-1.01l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                </svg>

                                                <span className="font-bold text-black text-xs sm:text-sm">
                                                    {e.rating}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ))}
                    </div>
                </section>

                <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 border-t border-white/5 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1800&q=80')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-orange-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-orange-600 font-bold">
                                Emblems
                            </span>
                        </div>

                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-8 sm:mb-12">
                            Military & Faction Symbols
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                            {LOGOS.map((logo) => (
                                <div
                                    key={logo.name}
                                    className="group relative overflow-hidden rounded-2xl border border-orange-900/40 bg-stone-950/70 backdrop-blur-md shadow-2xl hover:shadow-[0_0_45px_rgba(180,80,0,0.45)] transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative flex flex-col items-center p-6 sm:p-8">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black/50 border border-orange-700/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <img
                                                src={logo.img}
                                                alt={logo.name}
                                                className="w-18 h-18 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_15px_rgba(255,180,0,0.4)]"
                                            />
                                        </div>

                                        <h3 className="mt-5 sm:mt-6 text-lg sm:text-2xl font-black uppercase text-stone-100 text-center">
                                            {logo.name}
                                        </h3>

                                        <div className="w-16 h-[2px] bg-orange-600 my-3 sm:my-4 rounded-full" />

                                        <p className="text-center text-stone-400 leading-6 sm:leading-7 text-sm">
                                            {logo.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,10,10,0.2),transparent_60%)]" />
                    <div className="relative max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-[2px] w-8 bg-red-600" />
                                <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                    Archives
                                </span>
                            </div>
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-4 sm:mb-6">
                                The Eyecatches
                            </h2>
                            <p className="text-stone-400 leading-relaxed mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
                                Toutes les cartes d&apos;information diffusées entre les
                                scènes, classées par saison et par épisode.
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="eyecatch" className="font-gothic group flex items-center justify-center gap-2 bg-gradient-to-b from-red-700 to-red-950 hover:from-red-600 hover:to-red-900 transition-all duration-300 px-5 sm:px-7 py-3 sm:py-3.5 rounded-sm border border-red-900/60 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(120,0,0,0.6)] hover:shadow-[0_0_50px_rgba(180,0,0,0.85)] w-full sm:w-auto">
                                    Browse Archives
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {["S1E3-2", "S1E4-2", "S1E8-1", "S1E17-1"].map((e) => (
                                <div
                                    key={e}
                                    onClick={() => router.push('eyecatch')}
                                    className="cursor-pointer group relative rounded-sm overflow-hidden torn-border aspect-video shadow-lg hover:shadow-[0_0_35px_rgba(150,0,0,0.5)] transition-all duration-500 bg-black/40 flex items-center justify-center"
                                >
                                    <img src={`/eyecatch/${e}.jpg`} alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-red-800/60 to-transparent hidden lg:block" />
                    <div className="relative max-w-[1000px] mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                History
                            </span>
                        </div>
                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)] mb-10 sm:mb-16 text-center">
                            Timeline of Events
                        </h2>

                        <div className="flex flex-col gap-8 sm:gap-10">
                            {TIMELINE.map((t, i) => (
                                <div
                                    key={t.year}
                                    className={`relative flex flex-col lg:flex-row items-center gap-4 sm:gap-6 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""
                                        }`}
                                >
                                    <div className="font-gothic w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-b from-red-800 to-black flex items-center justify-center font-black text-stone-100 shadow-[0_0_30px_rgba(150,0,0,0.7)] border-4 border-[#0a0908] z-10 text-xs sm:text-sm order-1 lg:order-none">
                                        {t.year}
                                    </div>
                                    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6 shadow-lg hover:border-red-700/50 transition-colors order-2 lg:order-none">
                                        <p className="text-sm text-stone-400 leading-relaxed">
                                            {t.text}
                                        </p>
                                    </div>
                                    <div className="flex-1 hidden lg:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#0d0c0b] border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Gallery
                            </span>
                        </div>

                        <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-12">
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                Visual Archives
                            </h2>
                            <Link href="gallery" className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs sm:text-sm tracking-wide hover:gap-3 transition-all">
                                View More <FaArrowRight />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {GALLERY.map((img, i) => (
                                <div
                                    key={i}
                                    className="group relative rounded-sm overflow-hidden torn-border aspect-video shadow-lg hover:shadow-[0_0_35px_rgba(150,0,0,0.5)] transition-all duration-500"
                                >
                                    <img
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-115 transition-transform duration-700"
                                        src={img}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#0d0c0b] border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Music Videos
                            </span>
                        </div>

                        <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-12">
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                Openings &amp; Endings
                            </h2>
                            <button onClick={() => router.push('songs')} className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs sm:text-sm tracking-wide hover:gap-3 transition-all">
                                Watch All <FaArrowRight />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {SONGS.slice(0, 4).map((song) => (
                                <button
                                    key={song.id}
                                    onClick={() => router.push('songs')}
                                    className="group relative rounded-sm overflow-hidden torn-border aspect-video shadow-lg hover:shadow-[0_0_35px_rgba(150,0,0,0.5)] transition-all duration-500 text-left"
                                >
                                    <img
                                        src={song.cover}
                                        alt={song.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-700/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(200,40,40,.7)]">
                                            <FaPlay className="text-sm translate-x-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 p-3 sm:p-4">
                                        <p className="font-black text-stone-100 text-xs sm:text-sm leading-tight truncate">
                                            {song.title}
                                        </p>
                                        <p className="text-[10px] sm:text-[11px] text-red-500 uppercase tracking-wider font-bold mt-1">
                                            {song.season}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#0a0908] border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[2px] w-8 bg-red-600" />
                            <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                Behind the Walls
                            </span>
                        </div>

                        <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-12">
                            <h2 className="font-gothic text-2xl sm:text-3xl lg:text-5xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                Cast &amp; Crew
                            </h2>
                            <Link href="team" className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs sm:text-sm tracking-wide hover:gap-3 transition-all">
                                Meet Everyone <FaArrowRight />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
                            {TEAM_PREVIEW.map((person) => (
                                <div
                                    key={person.name}
                                    onClick={() => router.push('team')}
                                    className="cursor-pointer jagged-frame group relative overflow-hidden torn-border aspect-[3/4] shadow-lg hover:shadow-[0_0_45px_rgba(150,0,0,0.55)] transition-all duration-500 hover:-translate-y-1 grayscale-[20%] hover:grayscale-0"
                                >
                                    <img
                                        src={`/team/${person.name}.jpg`}
                                        alt={person.name}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = fallbackAvatar(person.name);
                                        }}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 p-2.5 sm:p-4">
                                        <p className="font-black uppercase text-stone-100 text-xs sm:text-sm leading-tight">
                                            {person.name}
                                        </p>
                                        <p className="text-[9px] sm:text-[11px] text-red-500 uppercase tracking-wider font-bold mt-1 leading-snug">
                                            {person.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative border-t border-white/5 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10 lg:gap-14">
                        <div className="flex flex-col gap-6">
                            <div className="torn-border rounded-sm bg-gradient-to-br from-red-950/50 to-black/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                                <p className="font-blackletter text-4xl sm:text-5xl text-red-800 mb-2 [text-shadow:0_0_18px_rgba(150,0,0,0.7)]">"</p>
                                <p className="font-blackletter text-2xl sm:text-3xl text-stone-100 leading-snug">
                                    心臓を捧げよ
                                </p>
                                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-red-700 font-bold font-gothic">
                                    Dedicate Your Heart
                                </p>
                            </div>

                            <div className="torn-border rounded-sm bg-black/60 backdrop-blur-md p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
                                <FaSkullCrossbones className="text-3xl sm:text-4xl text-red-700 mb-4 drop-shadow-[0_0_12px_rgba(150,0,0,0.7)]" />
                                <p className="uppercase tracking-[0.25em] text-xs text-stone-400 mb-1">
                                    Survey Corps
                                </p>
                                <p className="font-gothic text-stone-200 font-black">
                                    Sacrifice for Humanity
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}