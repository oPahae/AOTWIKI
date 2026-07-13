"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaMusic,
    FaSearch,
    FaDownload,
    FaRedo,
    FaStepForward,
    FaStar,
} from "react-icons/fa";
import { OSTS } from "../constants/osts";

export default function OstsPage() {
    const audioRef = useRef(null);

    const sortedOsts = useMemo(
        () => [...OSTS].sort((a, b) => b.rating - a.rating),
        []
    );

    const [search, setSearch] = useState("");
    const [currentTrack, setCurrentTrack] = useState(sortedOsts[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [autoplayNext, setAutoplayNext] = useState(true);
    const [loop, setLoop] = useState(false);

    const filteredOsts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return sortedOsts;
        return sortedOsts.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.artist.toLowerCase().includes(q)
        );
    }, [search, sortedOsts]);

    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(() => { });
        }
    }, [currentTrack]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const playTrack = (track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const changeVolume = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current) audioRef.current.volume = v;
    };

    const seekAudio = (e) => {
        const t = parseFloat(e.target.value);
        setCurrentTime(t);
        if (audioRef.current) audioRef.current.currentTime = t;
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const parseTime = (str) => {
        const [m, s] = str.split(":").map(Number);
        return m * 60 + s;
    };

    const handleEnded = () => {
        if (loop) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
        }
        if (autoplayNext) {
            const idx = filteredOsts.findIndex(
                (t) => t.name === currentTrack.name
            );
            const next = filteredOsts[idx + 1] || filteredOsts[0];
            if (next) {
                setCurrentTrack(next);
                setIsPlaying(true);
                return;
            }
        }
        setIsPlaying(false);
    };

    const handleDownload = (e, track) => {
        e.stopPropagation();
        const a = document.createElement("a");
        a.href = track.url;
        a.download = `${track.name}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <section className="relative bg-[#0d0c0b] border-t border-white/5 py-6 sm:py-8 px-4 sm:px-6 lg:px-10 h-screen overflow-hidden flex flex-col">
            <audio
                ref={audioRef}
                src={currentTrack.url}
                loop={loop}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                onEnded={handleEnded}
            />

            <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 flex-1 min-h-0">
                {/* RECTANGLE WITH BG IMAGE + PLAYER (original structure) */}
                <div className="order-2 lg:order-1 relative rounded-sm overflow-hidden torn-border shadow-2xl h-[300px] sm:h-full">
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

                            <div className="w-full flex gap-2">
                                <button
                                    onClick={() => { setAutoplayNext((v) => !v); setLoop((v) => !v); }}
                                    title="Autoplay next track"
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold text-[11px] sm:text-xs tracking-wider shadow-lg ${autoplayNext
                                        ? "border-red-700 bg-white/10 hover:bg-white/20 shadow-red-900/40 text-stone-300"
                                        : "border-transparent bg-white/10 hover:bg-white/20 shadow-black/20 text-stone-300"
                                        }`}
                                >
                                    <FaStepForward className="text-[10px]" /> AUTO
                                </button>
                                <button
                                    onClick={() => { setAutoplayNext((v) => !v); setLoop((v) => !v); }}
                                    title="Loop track"
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold text-[11px] sm:text-xs tracking-wider shadow-lg ${loop
                                        ? "border-red-700 bg-white/10 hover:bg-white/20 shadow-red-900/40 text-stone-300"
                                        : "border-transparent bg-white/10 hover:bg-white/20 shadow-black/20 text-stone-300"
                                        }`}
                                >
                                    <FaRedo className="text-[10px]" />
                                    LOOP
                                </button>
                                <button
                                    onClick={(e) => handleDownload(e, currentTrack)}
                                    title="Download this track"
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition font-bold text-[11px] sm:text-xs tracking-wider shadow-lg shadow-black/20 text-stone-300"
                                >
                                    <FaDownload className="text-[10px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: header + search + scrollable list */}
                <div className="order-1 lg:order-2 flex flex-col min-h-0">
                    <div className="flex items-center gap-3 mb-3 shrink-0">
                        <span className="h-[2px] w-8 bg-red-600" />
                        <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                            Soundtrack
                        </span>
                    </div>

                    <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-4 shrink-0">
                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-4xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                            Original Soundtrack
                        </h2>
                        <span className="text-xs text-stone-500 font-medium">
                            {filteredOsts.length} track
                            {filteredOsts.length > 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* SEARCH */}
                    <div className="relative mb-4 shrink-0">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 text-sm" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search a title, an artist..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 pl-11 pr-4 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-red-700/60 transition"
                        />
                    </div>

                    {/* SCROLLABLE LIST - only this part scrolls */}
                    <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                        {filteredOsts.length === 0 && (
                            <p className="text-stone-500 text-sm py-10 text-center">
                                No results for "{search}"
                            </p>
                        )}

                        {filteredOsts.map((track) => {
                            const active = currentTrack.name === track.name;
                            return (
                                <button
                                    key={track.name}
                                    onClick={() => playTrack(track)}
                                    className={`group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border transition-all duration-300 text-left shrink-0 ${active
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
                                    <span className="text-xs text-red-500 font-bold shrink-0 sm:flex gap-1 justify-center items-center">
                                        <FaStar /> {track.rating}
                                    </span>
                                    <span className="text-xs text-stone-500 shrink-0">
                                        {track.time}
                                    </span>
                                    <span
                                        onClick={(e) => handleDownload(e, track)}
                                        className="text-stone-500 hover:text-red-500 transition shrink-0 cursor-pointer"
                                        title="Download"
                                    >
                                        <FaDownload className="text-sm" />
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}