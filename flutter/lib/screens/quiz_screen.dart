import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';

/// Port of pages/quiz.jsx — "guess the season" timed quiz built from
/// screenshots, mirroring SEASON_QUESTIONS / QUESTION_COUNT / ANSWER_TIME_MS
/// / REVEAL_TIME_MS / SEASON_CHOICES from constants/quiz.js.
class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  late List<QuizQuestion> _questions;
  int _index = 0;
  int? _selected;
  bool _locked = false;
  int _score = 0;
  bool _finished = false;
  Timer? _answerTimer;
  Timer? _revealTimer;
  double _timeLeft = 1.0;

  @override
  void initState() {
    super.initState();
    _startRun();
  }

  void _startRun() {
    final shuffled = [...Repo.seasonQuestions]..shuffle(Random());
    _questions = shuffled.take(Repo.questionCount).toList();
    _index = 0;
    _score = 0;
    _finished = false;
    _selected = null;
    _locked = false;
    _startTimer();
  }

  void _startTimer() {
    _answerTimer?.cancel();
    _timeLeft = 1.0;
    const tick = Duration(milliseconds: 100);
    final totalTicks = Repo.answerTimeMs / 100;
    var elapsed = 0;
    _answerTimer = Timer.periodic(tick, (timer) {
      elapsed++;
      setState(() => _timeLeft = 1 - (elapsed / totalTicks));
      if (elapsed >= totalTicks) {
        timer.cancel();
        if (!_locked) _select(null); // time's up
      }
    });
  }

  void _select(int? season) {
    if (_locked) return;
    _answerTimer?.cancel();
    setState(() {
      _selected = season;
      _locked = true;
      if (season == _questions[_index].season) _score++;
    });
    _revealTimer = Timer(Duration(milliseconds: Repo.revealTimeMs), _advance);
  }

  void _advance() {
    if (_index + 1 >= _questions.length) {
      setState(() => _finished = true);
      return;
    }
    setState(() {
      _index++;
      _selected = null;
      _locked = false;
    });
    _startTimer();
  }

  @override
  void dispose() {
    _answerTimer?.cancel();
    _revealTimer?.cancel();
    super.dispose();
  }

  ({String label, Color color}) _verdict(double pct) {
    if (pct >= 90) return (label: 'Frame-Perfect Veteran', color: AppColors.red500);
    if (pct >= 70) return (label: 'Binge-Watcher', color: AppColors.orange400);
    if (pct >= 50) return (label: 'Casual Viewer', color: AppColors.yellow400);
    return (label: 'Needs a Rewatch', color: AppColors.stone400);
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      route: AppRoutes.quiz,
      title: 'Season Quiz',
      showFooter: false,
      showSearch: false,
      body: _finished ? _buildResults() : _buildQuestion(),
    );
  }

  Widget _buildResults() {
    final pct = (_score / _questions.length) * 100;
    final v = _verdict(pct);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 28),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: Colors.white.withOpacity(0.03),
            border: Border.all(color: AppColors.red900.withOpacity(0.5)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.emoji_events,
                  color: AppColors.red600,
                  size: 56,
                  shadows: [Shadow(color: AppColors.red700.withOpacity(0.6), blurRadius: 18)]),
              const SizedBox(height: 16),
              Text('TRIAL COMPLETE',
                  style: AppFonts.metal(size: 12, color: AppColors.red600).copyWith(letterSpacing: 3)),
              const SizedBox(height: 10),
              Text('$_score / ${_questions.length}',
                  style: AppFonts.scream(size: 34).copyWith(
                      shadows: [Shadow(color: AppColors.red900.withOpacity(0.85), blurRadius: 18)])),
              const SizedBox(height: 10),
              Text(v.label, style: AppFonts.gothic(size: 18, color: v.color, weight: FontWeight.w900)),
              const SizedBox(height: 28),
              GradientCtaButton(label: 'Play again', icon: Icons.refresh, onTap: () => setState(_startRun)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuestion() {
    final q = _questions[_index];
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(
                onTap: () => Navigator.of(context).maybePop(),
                child: Row(
                  children: [
                    const Icon(Icons.arrow_back, size: 14, color: AppColors.stone500),
                    const SizedBox(width: 6),
                    Text('QUIT',
                        style: AppFonts.body(size: 11, color: AppColors.stone500, weight: FontWeight.bold)
                            .copyWith(letterSpacing: 1)),
                  ],
                ),
              ),
              Row(
                children: [
                  const Icon(Icons.movie, size: 13, color: AppColors.red600),
                  const SizedBox(width: 6),
                  Text('GUESS THE SEASON',
                      style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 2)),
                ],
              ),
              Text('$_score pts', style: AppFonts.body(size: 12, color: AppColors.stone400, weight: FontWeight.bold)),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              LinearProgressIndicator(
                value: _timeLeft.clamp(0, 1),
                color: AppColors.red700,
                backgroundColor: AppColors.stone600,
                minHeight: 4,
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Question ${_index + 1} / ${_questions.length}',
                      style: AppFonts.body(size: 12, color: AppColors.stone500)),
                  Text('Score: $_score', style: AppFonts.body(size: 12, color: AppColors.stone500)),
                ],
              ),
            ],
          ),
        ),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: AotImage(q.image),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text('Which season is this screenshot from?',
              style: AppFonts.gothic(size: 15), textAlign: TextAlign.center),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: Repo.seasonChoices.map((season) {
              final isCorrect = season == q.season;
              final isSelected = season == _selected;
              Color bg = AppColors.surface;
              Color border = AppColors.stone600;
              if (_locked) {
                if (isCorrect) {
                  bg = AppColors.green800.withOpacity(0.4);
                  border = AppColors.green500;
                } else if (isSelected) {
                  bg = AppColors.red900.withOpacity(0.4);
                  border = AppColors.red500;
                }
              }
              return GestureDetector(
                onTap: () => _select(season),
                child: Container(
                  width: 70,
                  height: 50,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: bg,
                    border: Border.all(color: border, width: 1.5),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text('S$season', style: AppFonts.gothic(size: 16)),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}
