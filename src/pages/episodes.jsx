import Head from "next/head";
import { useMemo, useState } from "react";
import {
    FaClock,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";

import { SEASONS } from "../constants/episodes";

function buildSmoothPath(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 === points.length ? i + 1 : i + 2];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

const RATING_MIN = 7.5;
const RATING_MAX = 9.5;

function SeasonRatingChart({ episodes, seasonId }) {
    const [hover, setHover] = useState(null);

    // Fixed logical coordinate space — the SVG scales to whatever width the
    // container gives it (width 100%, no horizontal scroll needed).
    const W = 1000;
    const H = 240;
    const PAD_X = 16;
    const PAD_TOP = 22;
    const PAD_BOTTOM = 30;

    const points = useMemo(() => {
        const innerW = W - PAD_X * 2;
        const innerH = H - PAD_TOP - PAD_BOTTOM;
        return episodes.map((e, i) => {
            const t = episodes.length === 1 ? 0 : i / (episodes.length - 1);
            const x = PAD_X + t * innerW;
            const norm = Math.min(1, Math.max(0, (e.rating - RATING_MIN) / (RATING_MAX - RATING_MIN)));
            const y = PAD_TOP + (1 - norm) * innerH;
            return { x, y, ...e };
        });
    }, [episodes]);

    const linePath = buildSmoothPath(points);
    const areaPath =
        linePath +
        ` L ${points[points.length - 1].x} ${H - PAD_BOTTOM} L ${points[0].x} ${H - PAD_BOTTOM} Z`;

    const gradId = `grad-${seasonId}`;

    return (
        <div className="relative w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="block w-full h-[180px] sm:h-[220px] lg:h-[260px]"
                onMouseLeave={() => setHover(null)}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* horizontal axis */}
                <line
                    x1={PAD_X}
                    x2={W - PAD_X}
                    y1={H - PAD_BOTTOM}
                    y2={H - PAD_BOTTOM}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                />

                {/* gradient fill down to axis */}
                <path d={areaPath} fill={`url(#${gradId})`} />

                {/* smooth rating curve */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px rgba(220,38,38,0.65))" }}
                />

                {/* episode points */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r={hover === i ? 5.5 : 3.5}
                            fill={hover === i ? "#fecaca" : "#f87171"}
                            stroke="#7f1d1d"
                            strokeWidth="1.5"
                            className="transition-all duration-150 cursor-pointer"
                            onMouseEnter={() => setHover(i)}
                        />
                        <rect
                            x={p.x - 15}
                            y={PAD_TOP}
                            width="30"
                            height={H - PAD_TOP - PAD_BOTTOM}
                            fill="transparent"
                            onMouseEnter={() => setHover(i)}
                            className="cursor-pointer"
                        />
                        <text
                            x={p.x}
                            y={H - PAD_BOTTOM + 16}
                            textAnchor="middle"
                            className="fill-stone-600"
                            fontSize="9"
                        >
                            {p.ep}
                        </text>
                    </g>
                ))}
            </svg>

            {hover !== null && (
                <div
                    className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-md border border-red-800/60 bg-black/90 px-3 py-2 shadow-xl"
                    style={{ left: `${(points[hover].x / W) * 100}%` }}
                >
                    <p className="text-[11px] font-bold text-stone-100 whitespace-nowrap">
                        E{points[hover].ep} · {points[hover].title}
                    </p>
                    <p className="text-[10px] text-red-500 font-bold mt-0.5">
                        ★ {points[hover].rating.toFixed(1)}
                    </p>
                </div>
            )}
        </div>
    );
}

function RatingBadge({ rating }) {
    return (
        <div className="flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg shrink-0">
            <span className="font-black text-black text-[9px] sm:text-[10px] tracking-wider">
                IMDB
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black"
            >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321 1.01l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.386a.562.562 0 01-.84.61L12 18.354l-4.718 2.848a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557L3.34 10.407a.562.562 0 01.321-1.01l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span className="font-bold text-black text-[11px] sm:text-xs">
                {rating.toFixed(1)}
            </span>
        </div>
    );
}

export default function Episodes() {
    return (
        <>
            <Head>
                <title>Episodes — AOT Wiki</title>
                <meta
                    name="description"
                    content="Every Attack on Titan episode across all 4 seasons, with real ratings and runtimes."
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
                <section className="relative pt-24 px-4 sm:px-6 lg:px-10 border-b border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,10,10,0.25),transparent_60%)]" />
                    <div className="relative max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <GiCrossedSwords className="text-red-700 text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(150,10,10,0.7)]" />
                            <span className="font-metal uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-red-600 font-bold">
                                Broadcast Archives
                            </span>
                        </div>
                        <h1 className="font-scream text-3xl sm:text-5xl lg:text-6xl text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85),0_0_45px_rgba(90,0,0,0.6)]">
                            All <span className="text-red-700">Episodes</span>
                        </h1>
                        <p className="mt-4 max-w-xl text-stone-400 text-sm sm:text-base leading-relaxed">
                            87 episodes across 4 seasons — every rating, runtime and title,
                            straight from the front lines.
                        </p>
                    </div>
                </section>

                {SEASONS.map((s) => (
                    <section
                        key={s.season}
                        className="relative border-b border-white/5 py-14 sm:py-20 px-4 sm:px-6 lg:px-10"
                    >
                        <div className="max-w-[1600px] mx-auto">
                            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="h-[2px] w-8 bg-red-600" />
                                        <span className="font-metal uppercase text-xs tracking-[0.35em] text-red-600 font-bold">
                                            {s.range}
                                        </span>
                                    </div>
                                    <h2 className="font-gothic text-2xl sm:text-4xl font-black text-stone-100 [text-shadow:0_0_15px_rgba(120,0,0,0.5)]">
                                        {s.label}
                                    </h2>
                                </div>
                                <span className="text-xs sm:text-sm text-stone-500 font-semibold uppercase tracking-wider">
                                    {s.episodes.length} episodes
                                </span>
                            </div>

                            {/* Rating chart */}
                            <SeasonRatingChart episodes={s.episodes} seasonId={s.season} />

                            {/* Episode list */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
                                {s.episodes.map((e) => (
                                    <div
                                        key={e.ep}
                                        className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 sm:p-3 hover:bg-white/[0.06] hover:border-red-700/40 transition-colors"
                                    >
                                        <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-md overflow-hidden torn-border shrink-0">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                                                style={{ backgroundImage: `url(${e.img})` }}
                                            />
                                            <span className="absolute bottom-0.5 left-1 text-[9px] sm:text-[10px] font-black text-stone-100 [text-shadow:0_0_4px_black]">
                                                E{e.ep}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-stone-100 group-hover:text-red-500 transition-colors leading-snug text-xs sm:text-sm line-clamp-2">
                                                {e.title}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] sm:text-xs text-stone-500">
                                                <FaClock className="text-red-700" />
                                                <span>{e.duration}</span>
                                                <span className="text-stone-700">•</span>
                                                <span>{e.date}</span>
                                            </div>
                                        </div>

                                        <RatingBadge rating={e.rating} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </main>
        </>
    );
}