import Head from "next/head";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import {
    FaSearch,
    FaPlay,
    FaPause,
    FaDownload,
    FaTimes,
    FaSearchPlus,
    FaSearchMinus,
    FaChevronLeft,
    FaChevronRight,
    FaYoutube,
    FaUser,
    FaFilm,
    FaMusic,
    FaImages,
    FaScroll,
    FaMicrophone,
    FaShieldAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";

import { FACTIONS } from "../constants/characters";
import { SEASONS } from "../constants/episodes";
import { TIMELINE } from "../constants/infos";
import { LOGOS } from "../constants/logos";
import { OSTS } from "../constants/osts";
import { SONGS } from "../constants/songs";
import { AUTHOR, WIT_STUDIO_STAFF, VOICE_ACTORS } from "../constants/team";
import {
    WALLS,
    WALL_MARIA_PLACES,
    WALL_ROSE_PLACES,
    WALL_SINA_PLACES,
    SPECIAL_SITES,
    WORLD_PLACES,
} from "../constants/world";

const normalize = (str) =>
    (str || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function scoreItem(item, tokens, fullQuery) {
    const title = normalize(item.title);
    const subtitle = normalize(item.subtitle);
    const desc = normalize(item.desc);
    const extra = normalize(item.extra);
    let score = 0;

    if (fullQuery && title === fullQuery) score += 200;
    else if (fullQuery && title.startsWith(fullQuery)) score += 120;
    else if (fullQuery && title.includes(fullQuery)) score += 80;

    tokens.forEach((tok) => {
        if (!tok) return;
        if (title.includes(tok)) score += 30;
        if (subtitle.includes(tok)) score += 18;
        if (desc.includes(tok)) score += 8;
        if (extra.includes(tok)) score += 10;

        title.split(/\s+/).forEach((w) => {
            if (w.length >= 4 && tok.length >= 4) {
                const dist = levenshtein(w, tok);
                if (dist <= 1) score += 14;
                else if (dist === 2 && tok.length >= 6) score += 6;
            }
        });
    });

    return score;
}

function highlight(text, query) {
    if (!text) return text;
    const q = (query || "").trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-red-700/40 text-stone-100 rounded px-0.5">
                {text.slice(idx, idx + q.length)}
            </mark>
            {text.slice(idx + q.length)}
        </>
    );
}

function buildIndex(gallery) {
    const items = [];

    FACTIONS.forEach((faction) => {
        faction.characters.forEach((c, i) => {
            items.push({
                id: `char-${faction.id}-${i}`,
                type: "character",
                title: c.name,
                subtitle: c.role,
                desc: c.desc,
                extra: faction.name,
                img: c.img,
            });
        });
    });

    SEASONS.forEach((season) => {
        season.episodes.forEach((e) => {
            items.push({
                id: `ep-${season.season}-${e.ep}`,
                type: "episode",
                title: e.title,
                subtitle: `${season.label} · Episode ${e.ep}`,
                desc: `Rating ${e.rating.toFixed ? e.rating.toFixed(1) : e.rating} · ${e.date}`,
                extra: season.label,
                img: e.img,
            });
        });
    });

    TIMELINE.forEach((t, i) => {
        items.push({
            id: `timeline-${i}`,
            type: "timeline",
            title: `Year ${t.year}`,
            subtitle: "Timeline",
            desc: t.text,
            extra: "history event",
            img: null,
        });
    });

    LOGOS.forEach((l, i) => {
        items.push({
            id: `logo-${i}`,
            type: "logo",
            title: l.name,
            subtitle: "Emblem",
            desc: l.desc,
            extra: "faction symbol emblem",
            img: l.img,
        });
    });

    OSTS.forEach((o, i) => {
        items.push({
            id: `ost-${i}`,
            type: "ost",
            title: o.name,
            subtitle: o.artist,
            desc: `Rating ${o.rating} · ${o.time}`,
            extra: "soundtrack ost music score",
            img: null,
            raw: o,
        });
    });

    SONGS.forEach((s) => {
        items.push({
            id: `song-${s.id}`,
            type: "song",
            title: s.title,
            subtitle: s.artist,
            desc: `${s.season} · ${s.type === "opening" ? "Opening" : "Ending"} · ${s.episodes}`,
            extra: `${s.type} music video theme song`,
            img: s.cover,
            raw: s,
        });
    });

    items.push({
        id: "team-author",
        type: "team",
        title: AUTHOR.name,
        subtitle: AUTHOR.role,
        desc: AUTHOR.desc,
        extra: "author creator manga",
        img: `/team/${AUTHOR.name}.jpg`,
    });
    WIT_STUDIO_STAFF.forEach((m, i) => {
        items.push({
            id: `staff-${i}`,
            type: "team",
            title: m.name,
            subtitle: m.role,
            desc: m.desc,
            extra: "wit studio crew staff",
            img: `/team/${m.name}.jpg`,
        });
    });
    VOICE_ACTORS.forEach((v, i) => {
        items.push({
            id: `va-${i}`,
            type: "team",
            title: v.name,
            subtitle: `Voice of ${v.character}`,
            desc: v.desc,
            extra: `voice actor seiyu ${v.character}`,
            img: `/team/${v.name}.jpg`,
        });
    });

    WALLS.forEach((w, i) => {
        items.push({
            id: `wall-${i}`,
            type: "world",
            title: w.name,
            subtitle: w.subtitle,
            desc: w.desc,
            extra: "wall rampart",
            img: w.img,
        });
    });
    [WALL_MARIA_PLACES, WALL_ROSE_PLACES, WALL_SINA_PLACES].forEach((arr) =>
        arr.forEach((p, i) => {
            items.push({
                id: `place-${p.name}-${i}`,
                type: "world",
                title: p.name,
                subtitle: "District",
                desc: p.desc,
                extra: "district town place",
                img: p.img,
            });
        })
    );
    SPECIAL_SITES.forEach((p, i) => {
        items.push({
            id: `special-${i}`,
            type: "world",
            title: p.name,
            subtitle: "Special Site",
            desc: p.desc,
            extra: "site location",
            img: p.img,
        });
    });
    WORLD_PLACES.forEach((p, i) => {
        items.push({
            id: `worldplace-${i}`,
            type: "world",
            title: p.name,
            subtitle: "Nation / Territory",
            desc: p.desc,
            extra: "world nation territory",
            img: p.img,
        });
    });

    if (gallery) {
        Object.entries(gallery).forEach(([folder, urls]) => {
            (urls || []).forEach((url, i) => {
                items.push({
                    id: `gallery-${folder}-${i}`,
                    type: "image",
                    title: `${folder} #${i + 1}`,
                    subtitle: folder,
                    desc: "",
                    extra: `gallery image ${folder}`,
                    img: url,
                });
            });
        });
    }

    return items;
}

const CATEGORY_META = {
    character: { label: "Characters", icon: FaUser, page: "characters" },
    episode: { label: "Episodes", icon: FaFilm, page: "episodes" },
    song: { label: "Openings & Endings", icon: FaYoutube, page: "songs" },
    ost: { label: "Soundtracks", icon: FaMusic, page: "osts" },
    team: { label: "Cast & Crew", icon: FaMicrophone, page: "team" },
    world: { label: "World & Places", icon: FaMapMarkerAlt, page: "map" },
    logo: { label: "Emblems", icon: FaShieldAlt, page: null },
    timeline: { label: "Timeline", icon: FaScroll, page: null },
    image: { label: "Gallery Images", icon: FaImages, page: "gallery" },
};

const CATEGORY_ORDER = [
    "character",
    "episode",
    "song",
    "ost",
    "team",
    "world",
    "logo",
    "timeline",
    "image",
];

function ImageLightbox({ images, index, onClose, onNavigate }) {
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
    const current = images[index];

    useEffect(() => {
        setZoom(1);
        setPos({ x: 0, y: 0 });
    }, [index]);

    const zoomIn = () => setZoom((z) => Math.min(5, +(z + 0.5).toFixed(2)));
    const zoomOut = () =>
        setZoom((z) => {
            const n = Math.max(1, +(z - 0.5).toFixed(2));
            if (n === 1) setPos({ x: 0, y: 0 });
            return n;
        });

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
    };

    const handleDown = (e) => {
        if (zoom <= 1) return;
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    };
    const handleMove = (e) => {
        if (!dragging) return;
        setPos({
            x: dragStart.current.px + (e.clientX - dragStart.current.x),
            y: dragStart.current.py + (e.clientY - dragStart.current.y),
        });
    };
    const handleUp = () => setDragging(false);

    const handleDownload = async () => {
        try {
            const res = await fetch(current.img);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = current.img.split("/").pop();
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            window.open(current.img, "_blank", "noopener,noreferrer");
        }
    };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft") onNavigate(-1);
            else if (e.key === "ArrowRight") onNavigate(1);
            else if (e.key === "+" || e.key === "=") zoomIn();
            else if (e.key === "-") zoomOut();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, onNavigate]);

    if (!current) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/10 shrink-0">
                <span className="font-gothic text-stone-300 text-xs sm:text-sm tracking-widest uppercase">
                    {current.subtitle} &middot; {index + 1} / {images.length}
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={zoomOut}
                        disabled={zoom <= 1}
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
                        disabled={zoom >= 5}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        aria-label="Zoom in"
                    >
                        <FaSearchPlus className="text-stone-200 text-sm" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        aria-label="Download"
                    >
                        <FaDownload className="text-stone-200 text-sm" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="text-stone-200 text-sm" />
                    </button>
                </div>
            </div>

            <div
                className="flex-1 relative overflow-hidden flex items-center justify-center select-none"
                style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
                onWheel={handleWheel}
                onMouseDown={handleDown}
                onMouseMove={handleMove}
                onMouseUp={handleUp}
                onMouseLeave={handleUp}
            >
                <img
                    src={current.img}
                    alt={current.title}
                    draggable={false}
                    style={{
                        transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
                        transition: dragging ? "none" : "transform 0.15s ease-out",
                    }}
                    className="max-w-full max-h-full select-none"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => onNavigate(-1)}
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        >
                            <FaChevronLeft className="text-stone-200" />
                        </button>
                        <button
                            onClick={() => onNavigate(1)}
                            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        >
                            <FaChevronRight className="text-stone-200" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [ready, setReady] = useState(false);
    const [gallery, setGallery] = useState(null);

    const [currentOst, setCurrentOst] = useState(null);
    const [ostPlaying, setOstPlaying] = useState(false);
    const audioRef = useRef(null);

    const [expandedSong, setExpandedSong] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        fetch("/api/gallery")
            .then((r) => r.json())
            .then(setGallery)
            .catch(() => setGallery({}));
    }, []);

    useEffect(() => {
        if (router.isReady && !ready) {
            setQuery(typeof router.query.key === "string" ? router.query.key : "");
            setReady(true);
        }
    }, [router.isReady, ready, router.query.key]);

    useEffect(() => {
        if (!ready) return;
        const t = setTimeout(() => {
            router.replace(
                { pathname: "/search", query: query.trim() ? { key: query.trim() } : {} },
                undefined,
                { shallow: true }
            );
        }, 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, ready]);

    useEffect(() => {
        if (currentOst && audioRef.current) {
            audioRef.current.load();
            if (ostPlaying) audioRef.current.play();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOst]);

    const toggleOst = (ost) => {
        if (currentOst?.name === ost.name) {
            if (ostPlaying) {
                audioRef.current.pause();
                setOstPlaying(false);
            } else {
                audioRef.current.play();
                setOstPlaying(true);
            }
        } else {
            setCurrentOst(ost);
            setOstPlaying(true);
        }
    };

    const index = useMemo(() => buildIndex(gallery), [gallery]);

    const results = useMemo(() => {
        const q = normalize(query.trim());
        if (!q) return [];
        const tokens = q.split(/\s+/).filter(Boolean);
        return index
            .map((item) => ({ item, score: scoreItem(item, tokens, q) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((r) => r.item);
    }, [index, query]);

    const grouped = useMemo(() => {
        const g = {};
        results.forEach((r) => {
            if (!g[r.type]) g[r.type] = [];
            g[r.type].push(r);
        });
        return g;
    }, [results]);

    const imageResults = grouped.image || [];

    const navigateLightbox = useCallback(
        (dir) => {
            setLightboxIndex((i) => {
                if (i === null) return i;
                const n = (i + dir + imageResults.length) % imageResults.length;
                return n;
            });
        },
        [imageResults.length]
    );

    return (
        <>
            <Head>
                <title>{query ? `"${query}" — Search — AOT Wiki` : "Search — AOT Wiki"}</title>
                <meta name="description" content="Search across every character, episode, soundtrack, opening, ending, and archive on AOT Wiki." />
                <meta name="robots" content="noindex, follow" />
            </Head>

            <style jsx global>{`
        .font-gothic { font-family: 'Cinzel Decorative', serif; }
        .font-metal { font-family: 'Metal Mania', serif; }
        .torn-border {
          border: 2px solid rgba(153, 27, 27, 0.55);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 25px rgba(140,10,10,0.25), inset 0 0 30px rgba(0,0,0,0.6);
        }
      `}</style>

            <main className="min-h-screen bg-[#0a0908] text-stone-200 font-sans antialiased selection:bg-red-900/60 overflow-x-hidden">
                <audio
                    ref={audioRef}
                    src={currentOst?.url}
                    onEnded={() => setOstPlaying(false)}
                    onPause={() => setOstPlaying(false)}
                    onPlay={() => setOstPlaying(true)}
                />

                <section className="relative border-b border-white/5 py-14 sm:py-20 px-4 sm:px-6 lg:px-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,10,10,0.28),transparent_60%)]" />
                    <div className="relative max-w-[1000px] mx-auto">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <GiCrossedSwords className="text-red-700 text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold">
                                Search the Archives
                            </span>
                        </div>

                        <div className="relative">
                            <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-red-600 text-sm sm:text-base" />
                            <input
                                type="text"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search characters, episodes, music, places..."
                                className="w-full bg-black/50 torn-border rounded-sm pl-12 sm:pl-14 pr-4 py-3.5 sm:py-4 text-sm sm:text-base text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-red-700"
                            />
                        </div>

                        {query.trim() && (
                            <p className="mt-4 text-xs sm:text-sm text-stone-500">
                                {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                                <span className="text-red-500 font-semibold">&quot;{query}&quot;</span>
                            </p>
                        )}
                    </div>
                </section>

                {!query.trim() && (
                    <div className="max-w-[1000px] mx-auto text-center py-20 sm:py-28 px-4">
                        <p className="text-stone-500 text-sm sm:text-base">
                            Start typing to search across characters, episodes, soundtracks, openings &amp; endings, cast &amp; crew, world locations, and the gallery.
                        </p>
                    </div>
                )}

                {query.trim() && results.length === 0 && (
                    <div className="max-w-[1000px] mx-auto text-center py-20 sm:py-28 px-4">
                        <p className="text-stone-500 text-sm sm:text-base">
                            No results found for &quot;{query}&quot;. Try a different spelling or a shorter term.
                        </p>
                    </div>
                )}

                {CATEGORY_ORDER.map((cat) => {
                    const items = grouped[cat];
                    if (!items || items.length === 0) return null;
                    const meta = CATEGORY_META[cat];
                    const Icon = meta.icon;

                    return (
                        <section key={cat} className="relative border-t border-white/5 py-10 sm:py-14 px-4 sm:px-6 lg:px-10">
                            <div className="max-w-[1600px] mx-auto">
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <Icon className="text-red-600 text-lg sm:text-xl shrink-0" />
                                    <h2 className="font-gothic text-xl sm:text-2xl lg:text-3xl font-black text-stone-100">
                                        {meta.label}
                                    </h2>
                                    <span className="text-xs sm:text-sm text-stone-500 font-medium">
                                        ({items.length})
                                    </span>
                                    {meta.page && (
                                        <button
                                            onClick={() => router.push(meta.page)}
                                            className="ml-auto text-red-500 font-bold uppercase text-[10px] sm:text-xs tracking-wide hover:text-red-400 transition-colors"
                                        >
                                            View Page
                                        </button>
                                    )}
                                </div>

                                {cat === "ost" && (
                                    <div className="flex flex-col gap-3">
                                        {items.map((item) => {
                                            const active = currentOst?.name === item.raw.name;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`rounded-xl border p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-colors ${active
                                                        ? "border-red-600 bg-red-900/10"
                                                        : "border-white/10 bg-white/[0.03] hover:border-red-700/40"
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => toggleOst(item.raw)}
                                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-700 hover:bg-red-600 transition flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(200,40,40,.5)]"
                                                    >
                                                        {active && ostPlaying ? (
                                                            <FaPause className="text-sm" />
                                                        ) : (
                                                            <FaPlay className="text-sm translate-x-0.5" />
                                                        )}
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-stone-100 text-sm sm:text-base truncate">
                                                            {highlight(item.title, query)}
                                                        </p>
                                                        <p className="text-xs text-stone-500 truncate">
                                                            {item.subtitle} &middot; {item.desc}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={item.raw.url}
                                                        download
                                                        className="text-stone-500 hover:text-red-500 transition shrink-0 p-2"
                                                        title="Download"
                                                    >
                                                        <FaDownload />
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {cat === "song" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {items.map((item) => {
                                            const isOpen = expandedSong === item.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="rounded-xl overflow-hidden torn-border bg-black/40 backdrop-blur-md transition-all duration-300"
                                                >
                                                    <button
                                                        onClick={() => setExpandedSong(isOpen ? null : item.id)}
                                                        className="w-full text-left flex items-center gap-3 sm:gap-4 p-3 sm:p-4"
                                                    >
                                                        <img
                                                            src={item.img}
                                                            alt={item.title}
                                                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-stone-100 text-sm sm:text-base truncate">
                                                                {highlight(item.title, query)}
                                                            </p>
                                                            <p className="text-xs text-stone-500 truncate mt-1">
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                        <FaYoutube className="text-red-600 text-lg sm:text-xl shrink-0" />
                                                    </button>
                                                    {isOpen && (
                                                        <div className="aspect-video w-full bg-black">
                                                            <iframe
                                                                className="w-full h-full"
                                                                src={`https://www.youtube.com/embed/${item.raw.youtubeId}?autoplay=1`}
                                                                title={item.title}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {cat === "image" && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                                        {items.map((item, i) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setLightboxIndex(i)}
                                                className="group relative rounded-sm overflow-hidden torn-border aspect-square shadow-lg hover:shadow-[0_0_35px_rgba(150,0,0,0.5)] transition-all duration-500"
                                            >
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <FaSearchPlus className="text-stone-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 truncate">
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {!["ost", "song", "image"].includes(cat) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                                        {items.map((item) => {
                                            const clickable = Boolean(meta.page);
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={clickable ? () => router.push(meta.page) : undefined}
                                                    className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 flex gap-3 sm:gap-4 hover:border-red-700/40 transition-colors ${clickable ? "cursor-pointer" : ""
                                                        }`}
                                                >
                                                    {item.img && (
                                                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 torn-border">
                                                            <img
                                                                src={item.img}
                                                                alt={item.title}
                                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-stone-100 text-sm sm:text-base leading-tight">
                                                            {highlight(item.title, query)}
                                                        </p>
                                                        {item.subtitle && (
                                                            <p className="text-[10px] sm:text-[11px] text-red-500 uppercase tracking-wider font-bold mt-1">
                                                                {item.subtitle}
                                                            </p>
                                                        )}
                                                        {item.desc && (
                                                            <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed line-clamp-3">
                                                                {item.desc}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </main>

            {lightboxIndex !== null && (
                <ImageLightbox
                    images={imageResults}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNavigate={navigateLightbox}
                />
            )}
        </>
    );
}