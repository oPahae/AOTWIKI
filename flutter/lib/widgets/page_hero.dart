import 'package:flutter/material.dart';
import '../config/theme.dart';

/// The repeated secondary-page hero: crossed-swords icon + tracking-widest
/// kicker, a big `font-scream` title with the last word in red, and a
/// short description — used (with page-specific copy) at the top of
/// characters, team, gallery, eyecatch, and other pages.
class PageHero extends StatelessWidget {
  final String kicker;
  final String titlePrefix;
  final String titleAccent;
  final String description;
  final bool centered;

  const PageHero({
    super.key,
    required this.kicker,
    required this.titlePrefix,
    required this.titleAccent,
    required this.description,
    this.centered = false,
  });

  @override
  Widget build(BuildContext context) {
    final crossAlign = centered ? CrossAxisAlignment.center : CrossAxisAlignment.start;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
      decoration: BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.topCenter,
          radius: 1.2,
          colors: [AppColors.red900.withOpacity(0.32), Colors.transparent],
        ),
      ),
      child: Column(
        crossAxisAlignment: crossAlign,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.close, color: AppColors.red700, size: 20),
              const SizedBox(width: 10),
              Text(kicker.toUpperCase(),
                  style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 2.5)),
            ],
          ),
          const SizedBox(height: 12),
          RichText(
            textAlign: centered ? TextAlign.center : TextAlign.start,
            text: TextSpan(
              style: AppFonts.scream(size: 32).copyWith(
                shadows: [Shadow(color: AppColors.red900.withOpacity(0.85), blurRadius: 16)],
              ),
              children: [
                TextSpan(text: '$titlePrefix '),
                TextSpan(text: titleAccent, style: const TextStyle(color: AppColors.red700)),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            description,
            textAlign: centered ? TextAlign.center : TextAlign.start,
            style: AppFonts.body(size: 13, color: AppColors.stone400).copyWith(height: 1.5),
          ),
        ],
      ),
    );
  }
}
