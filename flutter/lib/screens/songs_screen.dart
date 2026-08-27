import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';

/// Port of pages/songs.jsx — openings & endings, playable via an embedded
/// YouTube player with loop / autoplay-next controls, replacing the site's
/// YouTube IFrame API integration.
class SongsScreen extends StatefulWidget {
  const SongsScreen({super.key});

  @override
  State<SongsScreen> createState() => _SongsScreenState();
}

class _SongsScreenState extends State<SongsScreen> {
  String _tab = 'opening';
  late YoutubePlayerController _controller;
  Song? _current;
  bool _loop = false;
  bool _autoplayNext = true;

  List<Song> get _filtered => Repo.songs.where((s) => s.type == _tab).toList();

  @override
  void initState() {
    super.initState();
    _current = _filtered.isNotEmpty ? _filtered.first : null;
    _controller = YoutubePlayerController(
      initialVideoId: _current?.youtubeId ?? '',
      flags: const YoutubePlayerFlags(autoPlay: false, mute: false),
    )..addListener(_onPlayerState);
  }

  void _onPlayerState() {
    if (_controller.value.playerState == PlayerState.ended) {
      if (_loop) {
        _controller.seekTo(Duration.zero);
        _controller.play();
      } else if (_autoplayNext && _current != null) {
        final list = _filtered;
        final idx = list.indexWhere((s) => s.id == _current!.id);
        if (idx != -1 && list.isNotEmpty) {
          _playSong(list[(idx + 1) % list.length]);
        }
      }
    }
  }

  void _playSong(Song s) {
    setState(() => _current = s);
    _controller.load(s.youtubeId);
  }

  void _switchTab(String tab) {
    setState(() {
      _tab = tab;
      final list = _filtered;
      _current = list.isNotEmpty ? list.first : null;
    });
    if (_current != null) _controller.load(_current!.youtubeId);
  }

  @override
  void dispose() {
    _controller.removeListener(_onPlayerState);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      route: AppRoutes.songs,
      title: 'Songs',
      showFooter: false,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SectionTitle(title: 'Openings & Endings', size: 20),
                Text('${_filtered.length} track${_filtered.length == 1 ? '' : 's'}',
                    style: AppFonts.body(size: 11, color: AppColors.stone500)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: _TabPill(
                      label: 'Openings', selected: _tab == 'opening', onTap: () => _switchTab('opening')),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _TabPill(
                      label: 'Endings', selected: _tab == 'ending', onTap: () => _switchTab('ending')),
                ),
              ],
            ),
          ),
          if (_current != null) ...[
            YoutubePlayer(controller: _controller, showVideoProgressIndicator: true),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_current!.title, style: AppFonts.gothic(size: 14)),
                        Text('${_current!.season} · ${_current!.artist}',
                            style: AppFonts.body(size: 11, color: AppColors.stone500)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(_loop ? Icons.repeat_one : Icons.repeat,
                        color: _loop ? AppColors.red500 : AppColors.stone500),
                    onPressed: () => setState(() => _loop = !_loop),
                  ),
                  IconButton(
                    icon: Icon(Icons.skip_next,
                        color: _autoplayNext ? AppColors.red500 : AppColors.stone500),
                    onPressed: () => setState(() => _autoplayNext = !_autoplayNext),
                  ),
                ],
              ),
            ),
          ],
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filtered.length,
              itemBuilder: (context, i) {
                final s = _filtered[i];
                final isCurrent = _current?.id == s.id;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: TornCard(
                    borderColor: isCurrent ? AppColors.red500 : null,
                    onTap: () => _playSong(s),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: SizedBox(width: 48, height: 48, child: AotImage(s.cover)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(s.title,
                                  style: AppFonts.body(size: 13, color: AppColors.stone200),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis),
                              Text('${s.season} · ${s.episodes}',
                                  style: AppFonts.body(size: 11, color: AppColors.stone500)),
                            ],
                          ),
                        ),
                        Icon(
                          isCurrent ? Icons.graphic_eq : Icons.play_circle_outline,
                          color: AppColors.red500,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _TabPill extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _TabPill({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? AppColors.red900.withOpacity(0.4) : Colors.transparent,
          border: Border.all(color: selected ? AppColors.red700 : AppColors.stone600),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Text(label,
            style: AppFonts.body(
                size: 13, color: selected ? AppColors.stone200 : AppColors.stone500)),
      ),
    );
  }
}
