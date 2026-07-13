"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import {
    FaPlay,
    FaPause,
    FaRedo,
    FaStepForward,
    FaMusic,
    FaFilm,
    FaYoutube,
    FaExternalLinkAlt,
} from "react-icons/fa";
import { SONGS } from "../constants/songs";

const PLAYER_ELEMENT_ID = "yt-song-player";

export default function SongsPage() {
    const [tab, setTab] = useState("opening");

    const filteredSongs = useMemo(
        () => SONGS.filter((s) => s.type === tab),
        [tab]
    );

    const [currentSong, setCurrentSong] = useState(filteredSongs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoplayNext, setAutoplayNext] = useState(true);
    const [loop, setLoop] = useState(false);
    const [apiReady, setApiReady] = useState(false);

    const playerRef = useRef(null);
    const currentSongRef = useRef(currentSong);
    const loopRef = useRef(loop);
    const autoplayRef = useRef(autoplayNext);
    const filteredRef = useRef(filteredSongs);

    useEffect(() => {
        currentSongRef.current = currentSong;
    }, [currentSong]);

    useEffect(() => {
        loopRef.current = loop;
    }, [loop]);

    useEffect(() => {
        autoplayRef.current = autoplayNext;
    }, [autoplayNext]);

    useEffect(() => {
        filteredRef.current = filteredSongs;
    }, [filteredSongs]);

    useEffect(() => {
        if (!filteredSongs.find((s) => s.id === currentSong?.id)) {
            const next = filteredSongs[0];
            setCurrentSong(next);
            if (next && playerRef.current && playerRef.current.loadVideoById) {
                playerRef.current.loadVideoById(next.youtubeId);
            }
        }
    }, [tab]);

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setApiReady(true);
            return;
        }
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => setApiReady(true);
    }, []);

    const onPlayerStateChange = useCallback((event) => {
        const YT = window.YT;
        if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
        if (event.data === YT.PlayerState.PAUSED) setIsPlaying(false);
        if (event.data === YT.PlayerState.ENDED) {
            if (loopRef.current) {
                playerRef.current.seekTo(0);
                playerRef.current.playVideo();
                return;
            }
            if (autoplayRef.current) {
                const list = filteredRef.current;
                const idx = list.findIndex((s) => s.id === currentSongRef.current.id);
                const next = list[idx + 1] || list[0];
                if (next) {
                    setCurrentSong(next);
                    playerRef.current.loadVideoById(next.youtubeId);
                    return;
                }
            }
            setIsPlaying(false);
        }
    }, []);

    useEffect(() => {
        if (!apiReady || playerRef.current || !window.YT) return;
        playerRef.current = new window.YT.Player(PLAYER_ELEMENT_ID, {
            height: "100%",
            width: "100%",
            videoId: currentSongRef.current?.youtubeId,
            playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
    }, [apiReady, onPlayerStateChange]);

    const playSong = (song) => {
        setCurrentSong(song);
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(song.youtubeId);
        }
    };

    const handleAutoplayToggle = () => {
        setAutoplayNext((prev) => {
            const next = !prev;
            if (next) setLoop(false);
            return next;
        });
    };

    const handleLoopToggle = () => {
        setLoop((prev) => {
            const next = !prev;
            if (next) setAutoplayNext(false);
            return next;
        });
    };

    if (!currentSong) return null;

    const youtubeUrl = `https://www.youtube.com/watch?v=${currentSong.youtubeId}`;

    return (
        <section className="relative bg-[#0d0c0b] border-t border-white/5 py-6 sm:py-8 px-4 sm:px-6 lg:px-10 h-screen overflow-hidden flex flex-col">
            <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 h-[90%]">
                <div className="order-2 lg:order-1 flex flex-col gap-4 h-[324px] lg:h-full">
                    <div
                        className={`relative w-full rounded-sm overflow-hidden torn-border shadow-2xl bg-black flex items-center justify-center h-[42vh] sm:h-[52vh] lg:h-[68vh] lg:max-h-[560px]`}
                    >
                        <div className="relative h-full aspect-video max-w-full">
                            <div id={PLAYER_ELEMENT_ID} className="absolute inset-0 w-full h-full" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-[120px]">
                            <p className="font-black text-base sm:text-lg text-stone-100 truncate">
                                {currentSong.title}
                            </p>
                            <p className="text-xs sm:text-sm text-stone-400 truncate">
                                {currentSong.artist} — {currentSong.season}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleAutoplayToggle}
                            title="Autoplay next song"
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold text-[11px] sm:text-xs tracking-wider shadow-lg ${autoplayNext
                                ? "border-red-700 bg-white/10 hover:bg-white/20 shadow-red-900/40 text-stone-300"
                                : "border-transparent bg-white/10 hover:bg-white/20 shadow-black/20 text-stone-300"
                                }`}
                        >
                            <FaStepForward className="text-[10px]" /> AUTO
                        </button>
                        <button
                            onClick={handleLoopToggle}
                            title="Loop this video"
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold text-[11px] sm:text-xs tracking-wider shadow-lg ${loop
                                ? "border-red-700 bg-white/10 hover:bg-white/20 shadow-red-900/40 text-stone-300"
                                : "border-transparent bg-white/10 hover:bg-white/20 shadow-black/20 text-stone-300"
                                }`}
                        >
                            <FaRedo className="text-[10px]" /> LOOP
                        </button>
                        <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Watch on YouTube"
                            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition font-bold text-[11px] sm:text-xs tracking-wider shadow-lg shadow-black/20 text-stone-300"
                        >
                            <FaYoutube className="text-[12px] text-red-500" /> WATCH ON YOUTUBE
                        </a>
                    </div>
                </div>

                <div className={`order-1 lg:order-2 flex flex-col h-full overflow-y-scroll scrollbar-none`}>
                    <div className="flex items-center gap-3 mb-3 shrink-0">
                        <span className="h-[2px] w-8 bg-red-600" />
                        <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                            Music Videos
                        </span>
                    </div>

                    <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-4 shrink-0">
                        <h2 className="font-gothic text-2xl sm:text-3xl lg:text-4xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                            Openings &amp; Endings
                        </h2>
                        <span className="text-xs text-stone-500 font-medium">
                            {filteredSongs.length} track
                            {filteredSongs.length > 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="flex gap-2 mb-4 shrink-0">
                        <button
                            onClick={() => setTab("opening")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 font-gothic uppercase text-xs sm:text-sm tracking-wider font-bold transition-all ${tab === "opening"
                                ? "border-red-700 bg-red-900/20 text-stone-100 shadow-lg shadow-red-900/20"
                                : "border-white/10 bg-white/[0.03] text-stone-500 hover:bg-white/[0.06]"
                                }`}
                        >
                            <FaFilm /> Openings
                        </button>
                        <button
                            onClick={() => setTab("ending")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 font-gothic uppercase text-xs sm:text-sm tracking-wider font-bold transition-all ${tab === "ending"
                                ? "border-red-700 bg-red-900/20 text-stone-100 shadow-lg shadow-red-900/20"
                                : "border-white/10 bg-white/[0.03] text-stone-500 hover:bg-white/[0.06]"
                                }`}
                        >
                            <FaMusic /> Endings
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                        {filteredSongs.map((song) => {
                            const active = currentSong.id === song.id;
                            return (
                                <button
                                    key={song.id}
                                    onClick={() => playSong(song)}
                                    className={`group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl border transition-all duration-300 text-left shrink-0 ${active
                                        ? "border-red-600 bg-red-900/20 shadow-lg shadow-red-900/20"
                                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-red-700/40"
                                        }`}
                                >
                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 torn-border">
                                        <img
                                            src={song.cover}
                                            alt={song.title}
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                            className="w-full h-full object-cover"
                                        />
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center ${active
                                                ? "bg-red-900/50"
                                                : "bg-black/40 group-hover:bg-black/20"
                                                }`}
                                        >
                                            {active && isPlaying ? (
                                                <FaPause className="text-xs text-white" />
                                            ) : (
                                                <FaPlay className="text-xs text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-stone-200 text-sm sm:text-base truncate">
                                            {song.title}
                                        </p>
                                        <p className="text-xs text-stone-500 truncate">
                                            {song.artist}
                                        </p>
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-red-500 font-bold uppercase tracking-wider shrink-0 text-right leading-tight">
                                        {song.season}
                                    </span>
                                    <a
                                        href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-stone-500 hover:text-red-500 transition shrink-0"
                                        title="Watch on YouTube"
                                    >
                                        <FaExternalLinkAlt className="text-sm" />
                                    </a>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}