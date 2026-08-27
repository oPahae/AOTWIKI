import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../data/episodes_data.dart' show topEpsS1Data, topEpsS2Data, topEpsS3Data, topEpsS4Data;
import '../models/models.dart';
import '../routes/app_router.dart';
import '../state/audio_provider.dart';
import '../utils/assets.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/closing_quote.dart';
import '../widgets/common.dart';

/// Port of pages/index.jsx, section by section, in the same order as the
/// real site: Hero → World Map teaser → Main Characters → Soundtrack
/// player → Episodes Ratings (top eps/season) → Faction Symbols → Eyecatch
/// teaser → Timeline → Visual Archives (gallery) → Music Videos (songs) →
/// Cast & Crew → quote cards.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      route: AppRoutes.home,
      title: 'AOT Wiki',
      body: Column(
        children: const [
          _Hero(),
          _WorldMapTeaser(),
          _MainCharacters(),
          _SoundtrackPlayer(),
          _EpisodesRatings(),
          _FactionSymbols(),
          _EyecatchTeaser(),
          _Timeline(),
          _VisualArchives(),
          _MusicVideos(),
          _CastAndCrew(),
          _QuoteCards(),
        ],
      ),
    );
  }
}

/// ---- Hero ----------------------------------------------------------

class _Hero extends StatelessWidget {
  const _Hero();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.92,
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 88, 20, 32),
      child: Stack(
        fit: StackFit.expand,
        children: [
          AotImage('/general/hero3.jpg', fit: BoxFit.cover),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [Colors.black, Colors.black.withOpacity(0.5), Colors.transparent],
              ),
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.black.withOpacity(0.55), Colors.transparent, Colors.black.withOpacity(0.65)],
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
                    const Icon(Icons.close, color: AppColors.red700, size: 20),
                    const SizedBox(width: 10),
                    Text('SCOUT REGIMENT ARCHIVES',
                        style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 3)),
                  ],
                ),
                const SizedBox(height: 14),
                RichText(
                  text: TextSpan(
                    style: AppFonts.scream(size: 52).copyWith(
                      height: 0.95,
                      shadows: [
                        Shadow(color: AppColors.red900.withOpacity(0.9), blurRadius: 20),
                        Shadow(color: AppColors.red900.withOpacity(0.6), blurRadius: 50),
                      ],
                    ),
                    children: [
                      const TextSpan(text: 'AOT '),
                      TextSpan(
                        text: 'WIKI',
                        style: TextStyle(
                          color: AppColors.red700,
                          shadows: [Shadow(color: AppColors.red700.withOpacity(0.9), blurRadius: 30)],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Container(width: 32, height: 2, color: AppColors.red700),
                    const SizedBox(width: 12),
                    Text('DEDICATED TO FREEDOM',
                        style: AppFonts.gothic(size: 13, color: AppColors.red600).copyWith(letterSpacing: 3)),
                  ],
                ),
                const SizedBox(height: 18),
                Text(
                  'Welcome to AOT Wiki, your ultimate source for everything about Attack on Titan. Explore characters, Titans, story, locations, and more.',
                  style: AppFonts.body(size: 14, color: AppColors.stone300).copyWith(height: 1.5),
                ),
                const SizedBox(height: 26),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    GradientCtaButton(
                      label: 'Explore Wiki',
                      onTap: () => Navigator.pushNamed(context, AppRoutes.characters),
                    ),
                    GradientCtaButton(
                      label: 'Quiz',
                      icon: Icons.videogame_asset,
                      outlined: true,
                      onTap: () => Navigator.pushNamed(context, AppRoutes.quiz),
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                Row(
                  children: Repo.socialLinks
                      .map((l) => Padding(
                            padding: const EdgeInsets.only(right: 10),
                            child: CircleIconButton(
                              icon: mapReactIcon(l.icon),
                              size: 36,
                              onTap: () =>
                                  launchUrl(Uri.parse(l.link), mode: LaunchMode.externalApplication),
                            ),
                          ))
                      .toList(),
                ),
                const SizedBox(height: 24),
                Row(
                  children: const [
                    _HeroStat(n: '139', l: 'Chapters'),
                    SizedBox(width: 28),
                    _HeroStat(n: '89', l: 'Episodes'),
                    SizedBox(width: 28),
                    _HeroStat(n: '50+', l: 'Osts'),
                    SizedBox(width: 28),
                    _HeroStat(n: '120+', l: 'Characters'),
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

class _HeroStat extends StatelessWidget {
  final String n;
  final String l;
  const _HeroStat({required this.n, required this.l});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(n, style: AppFonts.body(size: 22, color: AppColors.stone100, weight: FontWeight.w900)),
        Text(l.toUpperCase(),
            style: AppFonts.body(size: 9, color: AppColors.stone500).copyWith(letterSpacing: 1.5)),
      ],
    );
  }
}

/// ---- World Map teaser -----------------------------------------------

class _WorldMapTeaser extends StatelessWidget {
  const _WorldMapTeaser();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHead(kicker: 'Geography', title: 'World Map'),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              "From the three concentric Walls of Paradis to the distant shores of Marley, trace humanity's territory and the paths of war across the known world.",
              style: AppFonts.body(size: 13, color: AppColors.stone400).copyWith(height: 1.5),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(3),
              child: AspectRatio(
                aspectRatio: 1,
                child: Container(
                  decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                  child: AotImage('/general/map.jpg'),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: GradientCtaButton(
                label: 'Explore Places', onTap: () => Navigator.pushNamed(context, AppRoutes.map)),
          ),
        ],
      ),
    );
  }
}

/// ---- Main Characters --------------------------------------------------

class _MainCharacters extends StatelessWidget {
  const _MainCharacters();

  @override
  Widget build(BuildContext context) {
    final chars = Repo.charactersLanding;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHead(
          kicker: 'Cast',
          title: 'Main Characters',
          actionLabel: 'View All',
          onAction: () => Navigator.pushNamed(context, AppRoutes.characters),
        ),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.75,
          ),
          itemCount: chars.length,
          itemBuilder: (context, i) {
            final c = chars[i];
            return PortraitTile(
              webPath: c.img,
              name: c.name,
              subtitle: c.role,
              onTap: () => Navigator.pushNamed(context, AppRoutes.characters),
            );
          },
        ),
      ],
    );
  }
}

/// ---- Soundtrack player -------------------------------------------------

class _SoundtrackPlayer extends StatefulWidget {
  const _SoundtrackPlayer();

  @override
  State<_SoundtrackPlayer> createState() => _SoundtrackPlayerState();
}

class _SoundtrackPlayerState extends State<_SoundtrackPlayer> {
  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioProvider>();
    final landing = Repo.ostsLanding;
    final track = audio.currentTrack ?? (landing.isNotEmpty ? landing.first : null);

    return Container(
      color: const Color(0xFF0D0C0B),
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (track != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 28, 16, 16),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: Container(
                  decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                  child: Stack(
                    children: [
                      SizedBox(height: 260, width: double.infinity, child: AotImage('/general/soundtrack.jpg')),
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Colors.transparent, Colors.black.withOpacity(0.85)],
                              stops: const [0.3, 1],
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 16,
                        right: 16,
                        bottom: 14,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Row(
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    audio.setQueue(landing);
                                    if (audio.currentTrack?.name != track.name) {
                                      audio.playTrack(track);
                                    } else {
                                      audio.togglePlay();
                                    }
                                  },
                                  child: Container(
                                    width: 52,
                                    height: 52,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppColors.red700,
                                      boxShadow: [BoxShadow(color: AppColors.red600.withOpacity(0.6), blurRadius: 24)],
                                    ),
                                    child: Icon(audio.isPlaying ? Icons.pause : Icons.play_arrow, color: Colors.white),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(track.name,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: AppFonts.body(size: 15, color: AppColors.stone100, weight: FontWeight.w900)),
                                      Text(track.artist,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: AppFonts.body(size: 12, color: AppColors.stone400)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            SliderTheme(
                              data: SliderTheme.of(context)
                                  .copyWith(trackHeight: 3, thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6)),
                              child: Slider(
                                activeColor: AppColors.red600,
                                inactiveColor: Colors.white.withOpacity(0.12),
                                value: audio.duration.inMilliseconds > 0
                                    ? audio.position.inMilliseconds.clamp(0, audio.duration.inMilliseconds).toDouble()
                                    : 0,
                                max: audio.duration.inMilliseconds > 0 ? audio.duration.inMilliseconds.toDouble() : 1,
                                onChanged: (v) => audio.seek(Duration(milliseconds: v.toInt())),
                              ),
                            ),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: track.bestParts.asMap().entries.map((entry) {
                                final label = track.bestParts.length == 1 ? 'BEST PART' : 'BEST PART ${entry.key + 1}';
                                return GestureDetector(
                                  onTap: () {
                                    final parts = entry.value.split(':');
                                    if (parts.length == 2) {
                                      audio.seek(
                                          Duration(minutes: int.tryParse(parts[0]) ?? 0, seconds: int.tryParse(parts[1]) ?? 0));
                                    }
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(color: AppColors.red700, borderRadius: BorderRadius.circular(999)),
                                    child: Text(label,
                                        style: AppFonts.body(size: 10, color: Colors.white, weight: FontWeight.bold)
                                            .copyWith(letterSpacing: 0.5)),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          SectionHead(
            kicker: 'Soundtrack',
            title: 'Original Soundtrack',
            actionLabel: 'View All',
            onAction: () => Navigator.pushNamed(context, AppRoutes.osts),
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: landing.map((t) {
                final active = audio.currentTrack?.name == t.name;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: InkWell(
                    onTap: () {
                      audio.setQueue(landing);
                      audio.playTrack(t);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: active ? AppColors.red900.withOpacity(0.2) : Colors.white.withOpacity(0.03),
                        border: Border.all(color: active ? AppColors.red600 : Colors.white.withOpacity(0.1)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: active ? AppColors.red700 : Colors.white.withOpacity(0.05),
                            ),
                            child: Icon(active && audio.isPlaying ? Icons.pause : Icons.music_note,
                                size: 15, color: active ? Colors.white : AppColors.red500),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(t.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppFonts.body(size: 13, color: AppColors.stone200, weight: FontWeight.w600)),
                                Text(t.artist,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppFonts.body(size: 11, color: AppColors.stone500)),
                              ],
                            ),
                          ),
                          Text(t.time, style: AppFonts.body(size: 11, color: AppColors.stone500)),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

/// ---- Episodes Ratings ---------------------------------------------------

class _EpisodesRatings extends StatelessWidget {
  const _EpisodesRatings();

  @override
  Widget build(BuildContext context) {
    final tops = [topEpsS1Data, topEpsS2Data, topEpsS3Data, topEpsS4Data];
    return Container(
      color: const Color(0xFF0D0C0B),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHead(
            kicker: 'Watch',
            title: 'Episodes Ratings',
            actionLabel: 'View All',
            onAction: () => Navigator.pushNamed(context, AppRoutes.episodes),
          ),
          for (var s = 0; s < 4; s++) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text('TOP EPISODES IN SEASON ${s + 1}',
                  style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 2)),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 130,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: tops[s].length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (context, i) {
                  final e = Map<String, dynamic>.from(tops[s][i]);
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: Container(
                      width: 220,
                      decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.network(e['img'] ?? '',
                              fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: AppColors.surface)),
                          DecoratedBox(decoration: BoxDecoration(color: Colors.black.withOpacity(0.35))),
                          Positioned(
                            left: 10,
                            right: 10,
                            bottom: 10,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text('${e['ep']}',
                                    style: AppFonts.body(size: 11, color: AppColors.red500, weight: FontWeight.bold)
                                        .copyWith(letterSpacing: 1)),
                                Text(e['title'] ?? '',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppFonts.body(size: 12, color: AppColors.stone100, weight: FontWeight.bold)),
                              ],
                            ),
                          ),
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(6),
                                gradient: const LinearGradient(colors: [Color(0xFFFDE68A), Color(0xFFFACC15), Color(0xFFEAB308)]),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text('IMDB', style: AppFonts.body(size: 9, color: Colors.black, weight: FontWeight.w900)),
                                  const SizedBox(width: 4),
                                  Text('${e['rating']}', style: AppFonts.body(size: 11, color: Colors.black, weight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 18),
          ],
        ],
      ),
    );
  }
}

/// ---- Faction Symbols ----------------------------------------------------

class _FactionSymbols extends StatelessWidget {
  const _FactionSymbols();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHead(kicker: 'Emblems', title: 'Military & Faction Symbols', kickerColor: AppColors.orange600),
        ...Repo.logos.map((l) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.orange600.withOpacity(0.4)),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 88,
                      height: 88,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.black.withOpacity(0.5),
                        border: Border.all(color: AppColors.orange600.withOpacity(0.3)),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: AotImage(l.img, fit: BoxFit.contain),
                    ),
                    const SizedBox(height: 14),
                    Text(l.name.toUpperCase(),
                        textAlign: TextAlign.center,
                        style: AppFonts.body(size: 16, color: AppColors.stone100, weight: FontWeight.w900)),
                    Container(margin: const EdgeInsets.symmetric(vertical: 10), width: 56, height: 2, color: AppColors.orange600),
                    Text(l.desc,
                        textAlign: TextAlign.center,
                        style: AppFonts.body(size: 12, color: AppColors.stone400).copyWith(height: 1.5)),
                  ],
                ),
              ),
            )),
      ],
    );
  }
}

/// ---- Eyecatch teaser ------------------------------------------------

class _EyecatchTeaser extends StatelessWidget {
  const _EyecatchTeaser();

  static const _teaserFiles = ['S1E3-2', 'S1E4-2', 'S1E8-1', 'S1E17-1'];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHead(kicker: 'Archives', title: 'The Eyecatches'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Every information card shown between scenes, sorted by season and episode.',
            style: AppFonts.body(size: 13, color: AppColors.stone400).copyWith(height: 1.5),
          ),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 16 / 9,
            ),
            itemCount: _teaserFiles.length,
            itemBuilder: (context, i) => GestureDetector(
              onTap: () => Navigator.pushNamed(context, AppRoutes.eyecatch),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: Container(
                  decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                  child: AotImage('/eyecatch/${_teaserFiles[i]}.jpg'),
                ),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: GradientCtaButton(label: 'Browse Archives', onTap: () => Navigator.pushNamed(context, AppRoutes.eyecatch)),
        ),
      ],
    );
  }
}

/// ---- Timeline ---------------------------------------------------------

class _Timeline extends StatelessWidget {
  const _Timeline();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SectionHead(kicker: 'History', title: 'Timeline of Events', padding: EdgeInsets.fromLTRB(16, 28, 16, 24)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: Repo.timeline
                .map((t) => Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [AppColors.red800, Colors.black],
                              ),
                              border: Border.all(color: AppColors.background, width: 3),
                              boxShadow: [BoxShadow(color: AppColors.red900.withOpacity(0.7), blurRadius: 18)],
                            ),
                            child: Text(t.year, textAlign: TextAlign.center, style: AppFonts.gothic(size: 10, color: AppColors.stone100)),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.04),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: Colors.white.withOpacity(0.1)),
                              ),
                              child: Text(t.text, style: AppFonts.body(size: 12, color: AppColors.stone400).copyWith(height: 1.5)),
                            ),
                          ),
                        ],
                      ),
                    ))
                .toList(),
          ),
        ),
      ],
    );
  }
}

/// ---- Visual Archives (gallery spotlight) -------------------------------

class _VisualArchives extends StatelessWidget {
  const _VisualArchives();

  @override
  Widget build(BuildContext context) {
    final spotlight = Repo.gallerySpotlight;
    return Container(
      color: const Color(0xFF0D0C0B),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHead(
            kicker: 'Gallery',
            title: 'Visual Archives',
            actionLabel: 'View More',
            onAction: () => Navigator.pushNamed(context, AppRoutes.gallery),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 16 / 9,
              ),
              itemCount: spotlight.length,
              itemBuilder: (context, i) => GestureDetector(
                onTap: () => Navigator.pushNamed(context, AppRoutes.gallery),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: Container(
                    decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                    child: AotImage(spotlight[i]),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

/// ---- Music Videos (songs) ----------------------------------------------

class _MusicVideos extends StatelessWidget {
  const _MusicVideos();

  @override
  Widget build(BuildContext context) {
    final songs = Repo.songs.take(4).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHead(
          kicker: 'Music Videos',
          title: 'Openings & Endings',
          actionLabel: 'Watch All',
          onAction: () => Navigator.pushNamed(context, AppRoutes.songs),
        ),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 16 / 9,
          ),
          itemCount: songs.length,
          itemBuilder: (context, i) {
            final s = songs[i];
            return GestureDetector(
              onTap: () => Navigator.pushNamed(context, AppRoutes.songs),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: Container(
                  decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      AotImage(s.cover),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Colors.transparent, Colors.black.withOpacity(0.8)],
                          ),
                        ),
                      ),
                      const Center(child: Icon(Icons.play_circle_fill, color: Colors.white70, size: 32)),
                      Positioned(
                        left: 10,
                        right: 10,
                        bottom: 10,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(s.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AppFonts.body(size: 12, color: AppColors.stone100, weight: FontWeight.w900)),
                            Text(s.season.toUpperCase(),
                                style: AppFonts.body(size: 9, color: AppColors.red500, weight: FontWeight.bold).copyWith(letterSpacing: 1)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

/// ---- Cast & Crew (team preview) -----------------------------------------

class _CastAndCrew extends StatelessWidget {
  const _CastAndCrew();

  @override
  Widget build(BuildContext context) {
    final members = [Repo.author, ...Repo.witStudioStaff.take(4)];
    return Container(
      color: AppColors.background,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHead(
            kicker: 'Behind the Walls',
            title: 'Cast & Crew',
            actionLabel: 'Meet Everyone',
            onAction: () => Navigator.pushNamed(context, AppRoutes.team),
          ),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 0.75,
            ),
            itemCount: members.length,
            itemBuilder: (context, i) => _TeamPortraitTile(member: members[i]),
          ),
        ],
      ),
    );
  }
}

class _TeamPortraitTile extends StatelessWidget {
  final TeamMember member;
  const _TeamPortraitTile({required this.member});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRoutes.team),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(2),
        child: Container(
          decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
          child: AspectRatio(
            aspectRatio: 3 / 4,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(
                  AppAssets.teamPhoto(member.name),
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Image.network(
                    AppAssets.fallbackAvatarUrl(member.name),
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(color: AppColors.surface),
                  ),
                ),
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withOpacity(0.55), Colors.black],
                      stops: const [0.4, 0.75, 1.0],
                    ),
                  ),
                ),
                Positioned(
                  left: 8,
                  right: 8,
                  bottom: 8,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(member.name.toUpperCase(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppFonts.body(size: 11, color: AppColors.stone100, weight: FontWeight.w900)),
                      Text(member.role.toUpperCase(),
                          maxLines: 1, overflow: TextOverflow.ellipsis, style: AppFonts.body(size: 9, color: AppColors.red500, weight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// ---- Quote cards ---------------------------------------------------

class _QuoteCards extends StatelessWidget {
  const _QuoteCards();

  @override
  Widget build(BuildContext context) {
    return const ClosingQuoteCards(
      japanese: '心臓を捧げよ',
      englishCaption: 'Dedicate your heart',
      icon: Icons.dangerous,
      kicker: 'Survey Corps',
      title: 'Sacrifice for Humanity',
    );
  }
}
