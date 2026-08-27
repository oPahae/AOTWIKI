import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../state/audio_provider.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';

/// Port of pages/osts.jsx — searchable OST library with a full player
/// (play/pause, seek, volume, loop, autoplay-next, jump-to-best-part).
class OstsScreen extends StatefulWidget {
  const OstsScreen({super.key});

  @override
  State<OstsScreen> createState() => _OstsScreenState();
}

class _OstsScreenState extends State<OstsScreen> {
  String _query = '';

  List<OstTrack> get _sorted {
    final list = [...Repo.osts]..sort((a, b) => b.rating.compareTo(a.rating));
    return list;
  }

  List<OstTrack> get _filtered {
    if (_query.isEmpty) return _sorted;
    final q = _query.toLowerCase();
    return _sorted
        .where((t) => t.name.toLowerCase().contains(q) || t.artist.toLowerCase().contains(q))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioProvider>();
    return AppScaffold(
      route: AppRoutes.osts,
      title: 'OSTs',
      showFooter: false,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionKicker(label: 'Soundtrack'),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SectionTitle(title: 'Original Soundtrack', size: 20),
                    Text('${_filtered.length} track${_filtered.length == 1 ? '' : 's'}',
                        style: AppFonts.body(size: 11, color: AppColors.stone500)),
                  ],
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: GothicSearchField(
              hint: 'Search a track or composer…',
              onChanged: (v) => setState(() => _query = v.trim()),
            ),
          ),
          Expanded(
            child: _filtered.isEmpty
                ? const EmptyState(message: 'No tracks match your search.')
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _filtered.length,
                    itemBuilder: (context, i) {
                      final t = _filtered[i];
                      final isCurrent = audio.currentTrack?.name == t.name;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: TornCard(
                          borderColor: isCurrent ? AppColors.red500 : null,
                          onTap: () {
                            audio.setQueue(_sorted);
                            if (isCurrent) {
                              audio.togglePlay();
                            } else {
                              audio.playTrack(t);
                            }
                          },
                          child: Row(
                            children: [
                              Icon(
                                isCurrent && audio.isPlaying
                                    ? Icons.pause_circle
                                    : Icons.play_circle_outline,
                                color: AppColors.red500,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(t.name,
                                        style: AppFonts.body(
                                            size: 13,
                                            color: AppColors.stone200,
                                            weight: isCurrent ? FontWeight.bold : null),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis),
                                    Text(t.artist,
                                        style: AppFonts.body(size: 11, color: AppColors.stone500)),
                                  ],
                                ),
                              ),
                              Text(t.time, style: AppFonts.body(size: 11, color: AppColors.stone500)),
                              const SizedBox(width: 8),
                              Text('★${t.rating.toStringAsFixed(1)}',
                                  style: AppFonts.body(size: 11, color: AppColors.yellow400)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
          if (audio.currentTrack != null) _PlayerBar(audio: audio),
        ],
      ),
    );
  }
}

class _PlayerBar extends StatelessWidget {
  final AudioProvider audio;
  const _PlayerBar({required this.audio});

  String _fmt(Duration d) {
    final m = d.inMinutes.toString().padLeft(1, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final t = audio.currentTrack!;
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.red900.withOpacity(0.4))),
      ),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(t.name,
                      style: AppFonts.body(size: 12, color: AppColors.stone200),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis),
                ),
                Text('${_fmt(audio.position)} / ${_fmt(audio.duration)}',
                    style: AppFonts.body(size: 11, color: AppColors.stone500)),
              ],
            ),
            Slider(
              activeColor: AppColors.red700,
              inactiveColor: AppColors.stone600,
              value: audio.duration.inMilliseconds > 0
                  ? audio.position.inMilliseconds
                      .clamp(0, audio.duration.inMilliseconds)
                      .toDouble()
                  : 0,
              max: audio.duration.inMilliseconds > 0 ? audio.duration.inMilliseconds.toDouble() : 1,
              onChanged: (v) => audio.seek(Duration(milliseconds: v.toInt())),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(audio.loop ? Icons.repeat_one : Icons.repeat,
                      color: audio.loop ? AppColors.red500 : AppColors.stone500, size: 18),
                  onPressed: () => audio.setLoop(!audio.loop),
                ),
                IconButton(
                  icon: const Icon(Icons.star, color: AppColors.stone500, size: 18),
                  tooltip: 'Jump to best part',
                  onPressed: audio.jumpToBestPart,
                ),
                IconButton(
                  icon: Icon(audio.isPlaying ? Icons.pause_circle : Icons.play_circle,
                      color: AppColors.red500, size: 36),
                  onPressed: audio.togglePlay,
                ),
                SizedBox(
                  width: 90,
                  child: Row(
                    children: [
                      const Icon(Icons.volume_up, color: AppColors.stone500, size: 16),
                      Expanded(
                        child: Slider(
                          activeColor: AppColors.stone400,
                          inactiveColor: AppColors.stone600,
                          value: audio.volume,
                          onChanged: audio.setVolume,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.skip_next,
                      color: audio.autoplayNext ? AppColors.red500 : AppColors.stone500, size: 18),
                  tooltip: 'Autoplay next',
                  onPressed: () => audio.setAutoplayNext(!audio.autoplayNext),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
