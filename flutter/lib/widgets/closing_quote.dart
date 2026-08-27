import 'package:flutter/material.dart';
import '../config/theme.dart';

/// The "closing quote" pair of torn-border cards that ends nearly every
/// page (index.jsx, characters.jsx, map.jsx, ...): a Japanese quote card
/// on the left, an icon + two-line label card on the right.
class ClosingQuoteCards extends StatelessWidget {
  final String japanese;
  final String englishCaption;
  final IconData icon;
  final String kicker;
  final String title;

  const ClosingQuoteCards({
    super.key,
    required this.japanese,
    required this.englishCaption,
    this.icon = Icons.dangerous,
    required this.kicker,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 32, 16, 24),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.red900.withOpacity(0.5), Colors.black.withOpacity(0.7)],
              ),
              border: Border.all(color: AppColors.red900.withOpacity(0.55)),
              borderRadius: BorderRadius.circular(3),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('"', style: AppFonts.blackletter(size: 40, color: AppColors.red800)),
                Text(japanese, style: AppFonts.blackletter(size: 26, color: AppColors.stone100)),
                const SizedBox(height: 10),
                Text(englishCaption.toUpperCase(),
                    style: AppFonts.gothic(size: 11, color: AppColors.red700).copyWith(letterSpacing: 2)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.6),
              border: Border.all(color: AppColors.red900.withOpacity(0.55)),
              borderRadius: BorderRadius.circular(3),
            ),
            child: Column(
              children: [
                Icon(icon, color: AppColors.red700, size: 34),
                const SizedBox(height: 12),
                Text(kicker.toUpperCase(),
                    style: AppFonts.body(size: 11, color: AppColors.stone400).copyWith(letterSpacing: 2)),
                const SizedBox(height: 4),
                Text(title, style: AppFonts.gothic(size: 15, color: AppColors.stone200)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
