import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';

/// Port of pages/episodes.jsx — "Broadcast Archives" header, then one
/// section per season (kicker/title + smooth rating curve + episode
/// rows with an IMDB-style gradient rating badge). The real site stacks
/// all 4 seasons vertically on one long page; this app keeps that content
/// but reaches it via tabs, since that's a lot of scrolling on a phone.
class EpisodesScreen extends StatefulWidget {
  const EpisodesScreen({super.key});

  @override
  State<EpisodesScreen> createState() => _EpisodesScreenState();
}

class _EpisodesScreenState extends State<EpisodesScreen> with TickerProviderStateMixin {
  late TabController _tab;
  final seasons = Repo.seasons;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: seasons.length, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final totalEpisodes = seasons.fold<int>(0, (sum, s) => sum + s.episodes.length);
    return AppScaffold(
      route: AppRoutes.episodes,
      title: 'Episodes',
      showFooter: false,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.close, color: AppColors.red700, size: 18),
                    const SizedBox(width: 8),
                    Text('BROADCAST ARCHIVES',
                        style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 2)),
                  ],
                ),
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: AppFonts.scream(size: 30).copyWith(
                      shadows: [Shadow(color: AppColors.red900.withOpacity(0.85), blurRadius: 16)],
                    ),
                    children: [
                      const TextSpan(text: 'All '),
                      TextSpan(text: 'Episodes', style: TextStyle(color: AppColors.red700)),
                    ],
                  ),
                ),
                const SizedBox(height: 6),
                Text('$totalEpisodes episodes across ${seasons.length} seasons — every rating, runtime and title.',
                    style: AppFonts.body(size: 12, color: AppColors.stone400)),
              ],
            ),
          ),
          TabBar(
            controller: _tab,
            isScrollable: true,
            labelColor: AppColors.red500,
            unselectedLabelColor: AppColors.stone500,
            indicatorColor: AppColors.red700,
            tabs: seasons.map((s) => Tab(text: s.title)).toList(),
          ),
          Expanded(
            child: TabBarView(
              controller: _tab,
              children: seasons.map((s) => _SeasonView(season: s)).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _SeasonView extends StatelessWidget {
  final Season season;
  const _SeasonView({required this.season});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SectionKicker(label: season.years),
            Text('${season.episodes.length} episodes',
                style: AppFonts.body(size: 11, color: AppColors.stone500, weight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.black.withOpacity(0.4),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: SizedBox(
            height: 160,
            width: double.infinity,
            child: CustomPaint(painter: _RatingChartPainter(season.episodes)),
          ),
        ),
        const SizedBox(height: 16),
        ...season.episodes.map((e) => _EpisodeRow(episode: e)),
      ],
    );
  }
}

class _EpisodeRow extends StatelessWidget {
  final Episode episode;
  const _EpisodeRow({required this.episode});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Colors.white.withOpacity(0.03),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: Stack(
                children: [
                  SizedBox(
                    width: 84,
                    height: 56,
                    child: episode.img != null
                        ? Image.network(episode.img!,
                            fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: AppColors.surface))
                        : Container(color: AppColors.surface),
                  ),
                  Positioned(
                    left: 3,
                    bottom: 1,
                    child: Text('E${episode.ep}',
                        style: AppFonts.body(size: 9, color: AppColors.stone100, weight: FontWeight.w900)),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(episode.title,
                      style: AppFonts.body(size: 12, color: AppColors.stone100, weight: FontWeight.bold),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.access_time, size: 10, color: AppColors.red700),
                      const SizedBox(width: 4),
                      Text(episode.duration, style: AppFonts.body(size: 10, color: AppColors.stone500)),
                      const SizedBox(width: 6),
                      Text('•', style: AppFonts.body(size: 10, color: AppColors.stone600)),
                      const SizedBox(width: 6),
                      Text(episode.date, style: AppFonts.body(size: 10, color: AppColors.stone500)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            _RatingBadge(rating: episode.rating),
          ],
        ),
      ),
    );
  }
}

/// The IMDB-style gradient rating badge, ported 1:1 from RatingBadge().
class _RatingBadge extends StatelessWidget {
  final double rating;
  const _RatingBadge({required this.rating});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(6),
        gradient: const LinearGradient(colors: [Color(0xFFFDE68A), Color(0xFFFACC15), Color(0xFFEAB308)]),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('IMDB', style: AppFonts.body(size: 9, color: Colors.black, weight: FontWeight.w900)),
          const SizedBox(width: 4),
          const Icon(Icons.star, size: 11, color: Colors.black),
          const SizedBox(width: 3),
          Text(rating.toStringAsFixed(1), style: AppFonts.body(size: 11, color: Colors.black, weight: FontWeight.bold)),
        ],
      ),
    );
  }
}

/// Smooth Catmull-Rom style rating curve, ported from the site's
/// `buildSmoothPath()` SVG helper.
class _RatingChartPainter extends CustomPainter {
  final List<Episode> episodes;
  static const double ratingMin = 7.5;
  static const double ratingMax = 9.5;

  _RatingChartPainter(this.episodes);

  @override
  void paint(Canvas canvas, Size size) {
    if (episodes.isEmpty) return;
    const padX = 8.0, padTop = 10.0, padBottom = 20.0;
    final innerW = size.width - padX * 2;
    final innerH = size.height - padTop - padBottom;

    final points = <Offset>[];
    for (var i = 0; i < episodes.length; i++) {
      final t = episodes.length == 1 ? 0.0 : i / (episodes.length - 1);
      final x = padX + t * innerW;
      final norm = ((episodes[i].rating - ratingMin) / (ratingMax - ratingMin)).clamp(0.0, 1.0);
      final y = padTop + (1 - norm) * innerH;
      points.add(Offset(x, y));
    }

    final path = Path()..moveTo(points.first.dx, points.first.dy);
    for (var i = 0; i < points.length - 1; i++) {
      final p0 = points[i == 0 ? i : i - 1];
      final p1 = points[i];
      final p2 = points[i + 1];
      final p3 = points[i + 2 == points.length ? i + 1 : i + 2];
      final cp1 = Offset(p1.dx + (p2.dx - p0.dx) / 6, p1.dy + (p2.dy - p0.dy) / 6);
      final cp2 = Offset(p2.dx - (p3.dx - p1.dx) / 6, p2.dy - (p3.dy - p1.dy) / 6);
      path.cubicTo(cp1.dx, cp1.dy, cp2.dx, cp2.dy, p2.dx, p2.dy);
    }

    final areaPath = Path.from(path)
      ..lineTo(points.last.dx, size.height - padBottom)
      ..lineTo(points.first.dx, size.height - padBottom)
      ..close();

    canvas.drawPath(
      areaPath,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppColors.red600.withOpacity(0.55), AppColors.red600.withOpacity(0.0)],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height)),
    );

    canvas.drawPath(
      path,
      Paint()
        ..color = AppColors.red500
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5
        ..strokeCap = StrokeCap.round,
    );

    for (final p in points) {
      canvas.drawCircle(p, 2.5, Paint()..color = AppColors.red500);
    }
  }

  @override
  bool shouldRepaint(covariant _RatingChartPainter oldDelegate) => oldDelegate.episodes != episodes;
}
