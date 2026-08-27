import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../utils/assets.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/closing_quote.dart';
import '../widgets/common.dart';

/// Port of pages/map.jsx — full-bleed eyecatch hero with stats, a "Three
/// circles of survival" intro, one section per wall (image + desc + a
/// notable-places grid), a "Buried Secrets" special-sites grid, a "Beyond
/// the Walls" world-places grid, and the closing quote pair.
class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      route: AppRoutes.map,
      title: 'World Map',
      body: Column(
        children: [
          const _MapHero(),
          _IntroDuo(
            kicker: 'Structure',
            title: 'Three circles of survival',
            body:
                "The territory of Paradis is organized into three concentric rings: Wall Maria on the outside, Wall Rose at the center, and Wall Sina at the heart of the kingdom, protecting the capital Mitras. The closer a resident lives to the center, the further they are from danger — and the more privileged their standing tends to be.",
            webPath: '/general/map.jpg',
          ),
          for (var wi = 0; wi < Repo.walls.length; wi++)
            Container(
              color: wi.isOdd ? const Color(0xFF0D0C0B) : AppColors.background,
              child: _WallSection(
                wall: Repo.walls[wi],
                places: [Repo.wallMariaPlaces, Repo.wallRosePlaces, Repo.wallSinaPlaces][wi],
              ),
            ),
          _IconGridSection(
            kicker: 'Buried Secrets',
            title: 'Key Places of the Plot',
            places: Repo.specialSites,
          ),
          Container(
            color: const Color(0xFF0D0C0B),
            child: _IconGridSection(
              kicker: 'Beyond the Walls',
              title: 'Paradis Island & The Wider World',
              intro:
                  "The three walls only ever protected a fraction of Paradis Island, and Paradis itself is only a fraction of the world. Once the ocean is reached, the story widens far past anything the walls' inhabitants were ever told.",
              places: Repo.worldPlaces,
            ),
          ),
          const ClosingQuoteCards(
            japanese: 'この壁の向こうに',
            englishCaption: 'Beyond this wall',
            icon: Icons.warning_amber_rounded,
            kicker: 'Survey Corps',
            title: 'Mapping the world',
          ),
        ],
      ),
    );
  }
}

class _MapHero extends StatelessWidget {
  const _MapHero();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 88, 20, 32),
      child: Stack(
        fit: StackFit.expand,
        children: [
          AotImage('/eyecatch/S1E1-1.jpg', fit: BoxFit.cover),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.black.withOpacity(0.5), Colors.transparent, AppColors.background],
              ),
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.topRight,
                radius: 1.1,
                colors: [AppColors.red900.withOpacity(0.35), Colors.transparent],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  children: [
                    const Icon(Icons.public, color: AppColors.red700, size: 20),
                    const SizedBox(width: 10),
                    Text('CARTOGRAPHY OF PARADIS',
                        style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 3)),
                  ],
                ),
                const SizedBox(height: 14),
                RichText(
                  text: TextSpan(
                    style: AppFonts.scream(size: 36).copyWith(
                      height: 0.98,
                      shadows: [Shadow(color: AppColors.red900.withOpacity(0.9), blurRadius: 20)],
                    ),
                    children: [
                      const TextSpan(text: 'THE WORLD '),
                      TextSpan(
                        text: 'BEHIND THE WALLS',
                        style: TextStyle(color: AppColors.red700, shadows: [Shadow(color: AppColors.red700.withOpacity(0.9), blurRadius: 26)]),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Container(width: 28, height: 2, color: AppColors.red700),
                    const SizedBox(width: 10),
                    Text('MARIA · ROSE · SINA',
                        style: AppFonts.gothic(size: 13, color: AppColors.red600).copyWith(letterSpacing: 2)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'For more than a century, humanity has survived locked behind three concentric walls standing fifty meters tall. Explore every wall, every district, and every landmark revealed throughout the story.',
                  style: AppFonts.body(size: 13, color: AppColors.stone300).copyWith(height: 1.5),
                ),
                const SizedBox(height: 24),
                Wrap(
                  spacing: 24,
                  runSpacing: 16,
                  children: const [
                    _StatBlock(n: '3', l: 'Concentric Walls'),
                    _StatBlock(n: '50m', l: 'Official Height'),
                    _StatBlock(n: '845', l: 'Fall of Shiganshina'),
                    _StatBlock(n: '850', l: 'Fall of Trost'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatBlock extends StatelessWidget {
  final String n;
  final String l;
  const _StatBlock({required this.n, required this.l});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(n, style: AppFonts.body(size: 22, color: AppColors.stone100, weight: FontWeight.w900)),
        Text(l.toUpperCase(), style: AppFonts.body(size: 9, color: AppColors.stone500).copyWith(letterSpacing: 1.2)),
      ],
    );
  }
}

/// Text + image duo, ported from the "Three circles of survival" block.
class _IntroDuo extends StatelessWidget {
  final String kicker;
  final String title;
  final String body;
  final String webPath;

  const _IntroDuo({required this.kicker, required this.title, required this.body, required this.webPath});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionKicker(label: kicker),
          const SizedBox(height: 10),
          SectionTitle(title: title, size: 22),
          const SizedBox(height: 12),
          Text(body, style: AppFonts.body(size: 13, color: AppColors.stone400).copyWith(height: 1.6)),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: AspectRatio(aspectRatio: 1, child: AotImage(webPath)),
          ),
        ],
      ),
    );
  }
}

class _WallSection extends StatelessWidget {
  final WallInfo wall;
  final List<WorldPlace> places;
  const _WallSection({required this.wall, required this.places});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionKicker(label: wall.subtitle),
          const SizedBox(height: 10),
          SectionTitle(title: wall.name, size: 22),
          const SizedBox(height: 10),
          Text(wall.desc, style: AppFonts.body(size: 13, color: AppColors.stone400).copyWith(height: 1.6)),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: Container(
              decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
              child: AspectRatio(aspectRatio: 16 / 9, child: AotImage(wall.img)),
            ),
          ),
          const SizedBox(height: 22),
          Row(
            children: [
              const Icon(Icons.place, color: AppColors.red600, size: 14),
              const SizedBox(width: 8),
              Text('NOTABLE PLACES OF ${wall.name.toUpperCase()}',
                  style: AppFonts.metal(size: 11, color: AppColors.stone400).copyWith(letterSpacing: 1.5)),
            ],
          ),
          const SizedBox(height: 14),
          ...places.map((p) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: Container(
                    decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        AspectRatio(aspectRatio: 4 / 3, child: AotImage(p.img)),
                        Container(
                          width: double.infinity,
                          color: Colors.black.withOpacity(0.6),
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p.name.toUpperCase(),
                                  style: AppFonts.body(size: 13, color: AppColors.stone100, weight: FontWeight.w900)),
                              const SizedBox(height: 4),
                              Text(p.desc, style: AppFonts.body(size: 12, color: AppColors.stone400).copyWith(height: 1.5)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              )),
        ],
      ),
    );
  }
}

/// "Buried Secrets" / "Beyond the Walls" card grid: image with a small
/// icon badge top-left, title + desc below.
class _IconGridSection extends StatelessWidget {
  final String kicker;
  final String title;
  final String? intro;
  final List<WorldPlace> places;

  const _IconGridSection({required this.kicker, required this.title, this.intro, required this.places});

  @override
  Widget build(BuildContext context) {
    if (places.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionKicker(label: kicker),
          const SizedBox(height: 10),
          SectionTitle(title: title, size: 22),
          if (intro != null) ...[
            const SizedBox(height: 10),
            Text(intro!, style: AppFonts.body(size: 13, color: AppColors.stone400).copyWith(height: 1.6)),
          ],
          const SizedBox(height: 18),
          ...places.map((p) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.surface.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.red900.withOpacity(0.55)),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Stack(
                        children: [
                          AspectRatio(aspectRatio: 16 / 9, child: AotImage(p.img)),
                          Positioned(
                            top: 10,
                            left: 10,
                            child: Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.black.withOpacity(0.6),
                                border: Border.all(color: AppColors.red800.withOpacity(0.5)),
                              ),
                              child: Icon(mapReactIcon(p.icon), color: AppColors.red600, size: 16),
                            ),
                          ),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(p.name.toUpperCase(),
                                style: AppFonts.body(size: 14, color: AppColors.stone100, weight: FontWeight.w900)),
                            const SizedBox(height: 6),
                            Text(p.desc, style: AppFonts.body(size: 12, color: AppColors.stone400).copyWith(height: 1.5)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }
}
