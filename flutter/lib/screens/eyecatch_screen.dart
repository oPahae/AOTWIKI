import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';
import '../widgets/lightbox.dart';
import '../widgets/page_hero.dart';

/// Port of pages/eyecatch.jsx — hero, an exclusive season pill selector
/// (only one season's episodes shown at a time), then that season's
/// episodes each with their own thumbnail strip.
class EyecatchScreen extends StatefulWidget {
  const EyecatchScreen({super.key});

  @override
  State<EyecatchScreen> createState() => _EyecatchScreenState();
}

class _EyecatchScreenState extends State<EyecatchScreen> {
  late List<int> _seasonKeys; // 0 = OVA, 1..4 = seasons
  late int _activeSeason;

  @override
  void initState() {
    super.initState();
    final seasons = Repo.eyecatch.map((g) => g.isOva ? 0 : g.season).toSet().toList()..sort();
    _seasonKeys = seasons;
    _activeSeason = seasons.isNotEmpty ? seasons.first : 1;
  }

  String _seasonLabel(int key) => key == 0 ? 'OVA' : 'Season $key';

  @override
  Widget build(BuildContext context) {
    final groups = Repo.eyecatch
        .where((g) => (g.isOva ? 0 : g.season) == _activeSeason)
        .toList()
      ..sort((a, b) => a.episode.compareTo(b.episode));

    return AppScaffold(
      route: AppRoutes.eyecatch,
      title: 'Eyecatch',
      body: Column(
        children: [
          const PageHero(
            kicker: 'Currently Publicly Available Information',
            titlePrefix: 'The',
            titleAccent: 'Eyecatches',
            description: 'Every information card shown between scenes, sorted by season and episode.',
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: _seasonKeys.map((k) {
                final selected = k == _activeSeason;
                return GestureDetector(
                  onTap: () => setState(() => _activeSeason = k),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(999),
                      color: selected ? AppColors.red700 : Colors.white.withOpacity(0.05),
                      border: Border.all(color: selected ? AppColors.red700 : Colors.white.withOpacity(0.1)),
                      boxShadow: selected ? [BoxShadow(color: AppColors.red900.withOpacity(0.5), blurRadius: 15)] : null,
                    ),
                    child: Text(_seasonLabel(k).toUpperCase(),
                        style: AppFonts.body(
                                size: 11, color: selected ? Colors.white : AppColors.stone300, weight: FontWeight.bold)
                            .copyWith(letterSpacing: 0.6)),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: groups.length,
              itemBuilder: (context, i) => _EyecatchEpisode(group: groups[i], isOva: _activeSeason == 0),
            ),
          ),
        ],
      ),
    );
  }
}

class _EyecatchEpisode extends StatelessWidget {
  final EyecatchGroup group;
  final bool isOva;
  const _EyecatchEpisode({required this.group, required this.isOva});

  @override
  Widget build(BuildContext context) {
    final paths = group.images.map((f) => '/eyecatch/$f').toList();
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(isOva ? 'OVA ${group.episode}' : 'EPISODE ${group.episode}',
              style: AppFonts.metal(size: 13, color: AppColors.red600).copyWith(letterSpacing: 2)),
          const SizedBox(height: 10),
          ...paths.asMap().entries.map((entry) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: GestureDetector(
                  onTap: () => Lightbox.open(context, paths, entry.key),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: Container(
                      decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
                      child: AspectRatio(aspectRatio: 16 / 9, child: AotImage(entry.value)),
                    ),
                  ),
                ),
              )),
        ],
      ),
    );
  }
}
