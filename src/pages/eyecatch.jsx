// pages/eyecatch.jsx
//
// Page 100% statique (getStaticProps, généré au build) qui liste les images
// présentes dans public/eyecatch/, les parse (S{saison}E{épisode}-{n}.ext ou
// OVA{épisode}-{n}.ext) et les affiche groupées par saison puis par épisode.
// Aucun appel réseau/API côté client : tout est calculé au build.

import Head from "next/head";
import fs from "fs";
import path from "path";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FaTimes,
    FaSearchPlus,
    FaSearchMinus,
    FaDownload,
    FaChevronLeft,
    FaChevronRight,
    FaExpand,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";

const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.5;

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

async function downloadImage(url, filename) {
    try {
        const res = await fetch(url, { mode: "cors" });
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        window.open(url, "_blank", "noopener,noreferrer");
    }
}

// ---- Lightbox --------------------------------------------------------------

function Lightbox({ images, index, onClose, onNavigate }) {
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
    const pinchStart = useRef(null);

    const current = images[index];
    const src = current?.src;
    const imageCount = images.length;

    const resetView = useCallback(() => {
        setZoom(1);
        setPos({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        resetView();
    }, [index, resetView]);

    const zoomIn = () => setZoom((z) => clamp(+(z + ZOOM_STEP).toFixed(2), ZOOM_MIN, ZOOM_MAX));
    const zoomOut = () =>
        setZoom((z) => {
            const next = clamp(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN, ZOOM_MAX);
            if (next === 1) setPos({ x: 0, y: 0 });
            return next;
        });

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
    };

    const handleDoubleClick = () => {
        if (zoom > 1) resetView();
        else setZoom(2.5);
    };

    const handlePointerDown = (e) => {
        if (zoom <= 1) return;
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    };

    const handlePointerMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
    };

    const stopDrag = () => setDragging(false);

    const touchDist = (touches) => {
        const [a, b] = touches;
        return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            pinchStart.current = { dist: touchDist(e.touches), zoom };
        } else if (e.touches.length === 1 && zoom > 1) {
            setDragging(true);
            dragStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                px: pos.x,
                py: pos.y,
            };
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && pinchStart.current) {
            const newDist = touchDist(e.touches);
            const ratio = newDist / pinchStart.current.dist;
            setZoom(clamp(+(pinchStart.current.zoom * ratio).toFixed(2), ZOOM_MIN, ZOOM_MAX));
        } else if (e.touches.length === 1 && dragging) {
            const dx = e.touches[0].clientX - dragStart.current.x;
            const dy = e.touches[0].clientY - dragStart.current.y;
            setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
        }
    };

    const handleTouchEnd = () => {
        pinchStart.current = null;
        setDragging(false);
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft") onNavigate(-1);
            else if (e.key === "ArrowRight") onNavigate(1);
            else if (e.key === "+" || e.key === "=") zoomIn();
            else if (e.key === "-") zoomOut();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose, onNavigate]);

    const handleDownload = async () => {
        setDownloading(true);
        const filename = src.split("/").pop().split("?")[0] || "eyecatch.jpg";
        await downloadImage(src, filename);
        setDownloading(false);
    };

    if (!current) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/10 shrink-0">
                <span className="font-gothic text-stone-300 text-xs sm:text-sm tracking-widest uppercase">
                    {current.label} &middot; {index + 1} / {imageCount}
                </span>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={zoomOut}
                        disabled={zoom <= ZOOM_MIN}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        aria-label="Zoom out"
                    >
                        <FaSearchMinus className="text-stone-200 text-sm" />
                    </button>
                    <span className="text-stone-400 text-xs sm:text-sm w-12 text-center font-semibold tabular-nums">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        disabled={zoom >= ZOOM_MAX}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        aria-label="Zoom in"
                    >
                        <FaSearchPlus className="text-stone-200 text-sm" />
                    </button>
                    <button
                        onClick={resetView}
                        className="hidden sm:flex w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 items-center justify-center transition-colors"
                        aria-label="Reset zoom"
                        title="Reset"
                    >
                        <FaExpand className="text-stone-200 text-sm" />
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-2 px-3 sm:px-4 h-9 sm:h-10 rounded-full bg-gradient-to-b from-red-700 to-red-950 hover:from-red-600 hover:to-red-900 border border-red-900/60 text-xs sm:text-sm font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(120,0,0,0.5)] transition-all disabled:opacity-60"
                    >
                        <FaDownload className="text-xs" />
                        <span className="hidden sm:inline">
                            {downloading ? "..." : "Download"}
                        </span>
                    </button>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 hover:bg-red-900/40 hover:border-red-700/50 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="text-stone-200 text-sm" />
                    </button>
                </div>
            </div>

            {/* Image stage */}
            <div
                className="relative flex-1 overflow-hidden select-none"
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDrag}
                onPointerLeave={stopDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
            >
                <img
                    src={src}
                    alt={current.label}
                    draggable={false}
                    className="absolute top-1/2 left-1/2 max-w-[92vw] max-h-[80vh] object-contain pointer-events-none"
                    style={{
                        transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
                        transition: dragging ? "none" : "transform 150ms ease-out",
                    }}
                />

                {imageCount > 1 && (
                    <>
                        <button
                            onClick={() => onNavigate(-1)}
                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 border border-white/10 hover:bg-red-900/50 hover:border-red-700/50 flex items-center justify-center transition-colors"
                            aria-label="Previous image"
                        >
                            <FaChevronLeft className="text-stone-200" />
                        </button>
                        <button
                            onClick={() => onNavigate(1)}
                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 border border-white/10 hover:bg-red-900/50 hover:border-red-700/50 flex items-center justify-center transition-colors"
                            aria-label="Next image"
                        >
                            <FaChevronRight className="text-stone-200" />
                        </button>
                    </>
                )}
            </div>

            <p className="hidden sm:block text-center text-stone-600 text-[11px] tracking-wide py-3 border-t border-white/10">
                Scroll / buttons to zoom &middot; drag to move &middot; double-click to reset &middot; &larr; &rarr; to navigate &middot; Esc to close
            </p>
        </div>
    );
}

// ---- Page -------------------------------------------------------------------

const SEASON_TITLES = {
    S1: "Saison 1",
    S2: "Saison 2",
    S3: "Saison 3",
    S4: "Saison 4",
    OVA: "OVA",
};

export default function EyecatchGallery({ seasons, flat }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeSeason, setActiveSeason] = useState(seasons[0]?.key ?? null);

    const currentSeason = seasons.find((s) => s.key === activeSeason) ?? seasons[0];

    // La navigation dans la lightbox reste circonscrite à la saison affichée
    // (les autres saisons étant masquées, pas seulement scrollées hors-champ).
    const seasonFlat = useMemo(() => {
        if (!currentSeason) return [];
        return currentSeason.episodes.flatMap((ep) => ep.images);
    }, [currentSeason]);

    const seasonLookup = useMemo(() => {
        const lookup = new Map();
        seasonFlat.forEach((item, i) => lookup.set(item.src, i));
        return lookup;
    }, [seasonFlat]);

    const openBySrc = (src) => setActiveIndex(seasonLookup.get(src) ?? 0);
    const close = () => setActiveIndex(null);
    const navigate = (delta) => {
        setActiveIndex((i) =>
            i === null ? i : (i + delta + seasonFlat.length) % seasonFlat.length
        );
    };

    // Revenir à la première image quand on change de saison pendant que la
    // lightbox est ouverte (évite un index qui pointe vers l'ancienne saison).
    useEffect(() => {
        setActiveIndex(null);
    }, [activeSeason]);

    return (
        <>
            <Head>
                <title>Eyecatches &mdash; AOT Wiki</title>
                <meta
                    name="description"
                    content="Toutes les cartes d'information (eyecatch) d'Attack on Titan, classées par saison et par épisode."
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
        .font-scream { font-family: 'Nosifer', 'Cinzel Decorative', serif; }
        .font-gothic { font-family: 'Cinzel Decorative', serif; }
        .font-blackletter { font-family: 'UnifrakturMaguntia', serif; }
        .font-metal { font-family: 'Metal Mania', serif; }
        .torn-border {
          border: 2px solid rgba(153, 27, 27, 0.55);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 25px rgba(140,10,10,0.25), inset 0 0 30px rgba(0,0,0,0.6);
        }
        .crack-overlay {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><path d=%22M10 10 L80 60 L60 120 L140 100 L120 200 L200 180 L180 280%22 stroke=%22rgba(255,255,255,0.06)%22 stroke-width=%221%22 fill=%22none%22/><path d=%22M280 20 L220 90 L260 140 L190 170 L230 250%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%221%22 fill=%22none%22/></svg>');
        }
      `}</style>

            <main className="min-h-screen bg-[#0a0908] text-stone-200 font-sans antialiased selection:bg-red-900/60 crack-overlay overflow-x-hidden">
                {/* Header */}
                <section className="relative py-24 px-4 sm:px-6 lg:px-10 border-b border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,10,10,0.25),transparent_60%)]" />
                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <GiCrossedSwords className="text-red-700 text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold">
                                Currently Publicly Available Information
                            </span>
                        </div>
                        <h1 className="font-scream text-3xl sm:text-5xl lg:text-6xl text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85),0_0_45px_rgba(90,0,0,0.6)]">
                            The <span className="text-red-700">Eyecatches</span>
                        </h1>
                        <p className="mt-4 max-w-xl text-stone-400 text-sm sm:text-base leading-relaxed">
                            Toutes les cartes d&apos;information diffusées entre les
                            scènes, classées par saison et par épisode.
                        </p>
                    </div>
                </section>

                {/* Season selector (exclusif : masque les autres saisons, pas de scroll) */}
                <section className="relative px-4 sm:px-6 lg:px-10 -mt-8 sm:-mt-10 mb-8 sm:mb-12">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            {seasons.map(({ key }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveSeason(key)}
                                    aria-pressed={activeSeason === key}
                                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                                        activeSeason === key
                                            ? "bg-red-700 text-white shadow-[0_0_15px_rgba(120,0,0,0.5)]"
                                            : "bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10 hover:border-red-700/50"
                                    }`}
                                >
                                    {SEASON_TITLES[key] || key}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Saison active uniquement */}
                {currentSeason && (
                    <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-10 border-t border-white/5">
                        <div className="max-w-[1600px] mx-auto">
                            <h2 className="font-gothic text-xl sm:text-2xl lg:text-3xl text-stone-100 uppercase tracking-widest mb-8 sm:mb-10 flex items-center gap-3">
                                <GiCrossedSwords className="text-red-700 text-base sm:text-lg" />
                                {SEASON_TITLES[currentSeason.key] || currentSeason.key}
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-14">
                                {currentSeason.episodes.map(({ episode, images }) => (
                                    <div key={episode}>
                                        <h3 className="font-metal text-red-600 text-sm sm:text-base uppercase tracking-widest mb-3 sm:mb-4">
                                            {currentSeason.key === "OVA" ? "OVA" : "Épisode"} {episode}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {images.map((item) => (
                                                <button
                                                    key={item.src}
                                                    onClick={() => openBySrc(item.src)}
                                                    className="group relative rounded-sm overflow-hidden torn-border shadow-lg hover:shadow-[0_0_35px_rgba(150,0,0,0.5)] transition-all duration-500 block aspect-video"
                                                >
                                                    <img
                                                        src={item.src}
                                                        alt={item.label}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                                        <FaSearchPlus className="text-stone-100 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {flat.length === 0 && (
                    <p className="text-center text-stone-500 py-24">
                        Aucun eyecatch trouvé dans public/eyecatch.
                    </p>
                )}
            </main>

            {activeIndex !== null && (
                <Lightbox
                    images={seasonFlat}
                    index={activeIndex}
                    onClose={close}
                    onNavigate={navigate}
                />
            )}
        </>
    );
}

// ---- Génération statique (build time) ---------------------------------------

export async function getStaticProps() {
    const dir = path.join(process.cwd(), "public", "eyecatch");

    let files = [];
    try {
        files = fs
            .readdirSync(dir)
            .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
    } catch (err) {
        files = [];
    }

    const seasonRe = /^S(\d+)E(\d+)-(\d+)\.\w+$/i;
    const ovaRe = /^OVA(\d+)-(\d+)\.\w+$/i;

    const parsed = [];
    for (const file of files) {
        let m = seasonRe.exec(file);
        if (m) {
            const [, s, e, n] = m;
            parsed.push({
                file,
                seasonKey: `S${s}`,
                seasonOrder: parseInt(s, 10),
                episode: parseInt(e, 10),
                n: parseInt(n, 10),
                label: `S${s}E${e}-${n}`,
            });
            continue;
        }
        m = ovaRe.exec(file);
        if (m) {
            const [, e, n] = m;
            parsed.push({
                file,
                seasonKey: "OVA",
                seasonOrder: 999,
                episode: parseInt(e, 10),
                n: parseInt(n, 10),
                label: `OVA${e}-${n}`,
            });
        }
    }

    parsed.sort((a, b) => {
        if (a.seasonOrder !== b.seasonOrder) return a.seasonOrder - b.seasonOrder;
        if (a.episode !== b.episode) return a.episode - b.episode;
        return a.n - b.n;
    });

    // Regroupement saison -> épisode -> images
    const seasonMap = new Map();
    for (const item of parsed) {
        if (!seasonMap.has(item.seasonKey)) seasonMap.set(item.seasonKey, new Map());
        const episodeMap = seasonMap.get(item.seasonKey);
        if (!episodeMap.has(item.episode)) episodeMap.set(item.episode, []);
        episodeMap.get(item.episode).push({
            src: `/eyecatch/${item.file}`,
            label: item.label,
        });
    }

    const seasons = Array.from(seasonMap.entries()).map(([key, episodeMap]) => ({
        key,
        episodes: Array.from(episodeMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([episode, images]) => ({ episode, images })),
    }));

    const flat = parsed.map((item) => ({
        src: `/eyecatch/${item.file}`,
        label: item.label,
    }));

    return {
        props: { seasons, flat },
    };
}