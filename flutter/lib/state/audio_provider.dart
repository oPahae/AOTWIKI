import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../utils/assets.dart';

/// Shared OST playback state, used by both the Home mini-player and the
/// full OSTs page — mirrors the `<audio>` element + React state the
/// Next.js site kept in each page (`currentTrack`, `isPlaying`,
/// `currentTime`, `duration`, `volume`, `loop`, `autoplayNext`).
///
/// This is the app's single state-management strategy (Provider /
/// ChangeNotifier) applied to audio; other screens use local widget state
/// or their own small ChangeNotifiers (quiz, search) built the same way.
class AudioProvider extends ChangeNotifier {
  final AudioPlayer _player = AudioPlayer();

  OstTrack? currentTrack;
  bool isPlaying = false;
  Duration position = Duration.zero;
  Duration duration = Duration.zero;
  double volume = 1.0;
  bool loop = false;
  bool autoplayNext = true;
  List<OstTrack> _queue = [];

  AudioProvider() {
    _player.onPositionChanged.listen((p) {
      position = p;
      notifyListeners();
    });
    _player.onDurationChanged.listen((d) {
      duration = d;
      notifyListeners();
    });
    _player.onPlayerComplete.listen((_) => _handleComplete());
    _player.setReleaseMode(ReleaseMode.stop);
  }

  void setQueue(List<OstTrack> queue) => _queue = queue;

  Future<void> playTrack(OstTrack track) async {
    currentTrack = track;
    isPlaying = true;
    notifyListeners();
    await _player.stop();
    await _player.play(AssetSource(AppAssets.audio(track.url)));
    await _player.setVolume(volume);
  }

  Future<void> togglePlay() async {
    if (currentTrack == null) return;
    if (isPlaying) {
      await _player.pause();
    } else {
      await _player.resume();
    }
    isPlaying = !isPlaying;
    notifyListeners();
  }

  Future<void> seek(Duration to) async {
    await _player.seek(to);
  }

  Future<void> setVolume(double v) async {
    volume = v;
    await _player.setVolume(v);
    notifyListeners();
  }

  void setLoop(bool v) {
    loop = v;
    notifyListeners();
  }

  void setAutoplayNext(bool v) {
    autoplayNext = v;
    notifyListeners();
  }

  /// Seeks to the track's highlighted "best part" timestamp (mm:ss).
  Future<void> jumpToBestPart() async {
    if (currentTrack == null) return;
    final parts = currentTrack!.bestPart.split(':');
    if (parts.length != 2) return;
    final m = int.tryParse(parts[0]) ?? 0;
    final s = int.tryParse(parts[1]) ?? 0;
    await seek(Duration(minutes: m, seconds: s));
  }

  void _handleComplete() {
    if (loop) {
      _player.seek(Duration.zero);
      _player.resume();
      return;
    }
    if (autoplayNext && currentTrack != null && _queue.isNotEmpty) {
      final idx = _queue.indexWhere((t) => t.name == currentTrack!.name);
      final next = _queue[(idx + 1) % _queue.length];
      playTrack(next);
    } else {
      isPlaying = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}
