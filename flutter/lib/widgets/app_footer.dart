import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../routes/app_router.dart';
import '../utils/assets.dart';
import 'common.dart';

/// Port of the `<Footer>` component in _app.jsx — shown on every page
/// except /osts, /songs, /quiz (matching the original's
/// `showSearchBar`/footer visibility logic).
class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      padding: const EdgeInsets.fromLTRB(20, 44, 20, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RichText(
            text: TextSpan(
              style: AppFonts.gothic(size: 20, weight: FontWeight.w900),
              children: [
                const TextSpan(text: 'AOT '),
                TextSpan(text: 'WIKI', style: AppFonts.gothic(size: 20, color: AppColors.red700)),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'A fan-made encyclopedia dedicated to the world of Attack on Titan — characters, Titans, history, and the fight for freedom.',
            style: AppFonts.body(size: 12, color: AppColors.stone500, weight: FontWeight.normal),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 10,
            children: Repo.socialLinks
                .map((l) => CircleIconButton(
                      icon: mapReactIcon(l.icon),
                      size: 36,
                      onTap: () => launchUrl(Uri.parse(l.link), mode: LaunchMode.externalApplication),
                    ))
                .toList(),
          ),
          const SizedBox(height: 28),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: _FooterColumn(
                  heading: 'Explore',
                  items: const [
                    ('Characters', AppRoutes.characters),
                    ('Map', AppRoutes.map),
                    ('Eyecatch', AppRoutes.eyecatch),
                  ],
                ),
              ),
              Expanded(
                child: _FooterColumn(
                  heading: 'Media',
                  items: const [
                    ('Episodes', AppRoutes.episodes),
                    ('Osts', AppRoutes.osts),
                    ('Gallery', AppRoutes.gallery),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Divider(color: Colors.white.withOpacity(0.1)),
          const SizedBox(height: 16),
          Text('© 2026 AOT Wiki. Fan-made project. Not affiliated with Kodansha or WIT.',
              style: AppFonts.body(size: 10, color: AppColors.stone600)),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.directions_walk, size: 12, color: AppColors.stone600),
              const SizedBox(width: 6),
              Text('Dedicate your hearts to freedom.',
                  style: AppFonts.body(size: 10, color: AppColors.stone600)),
            ],
          ),
        ],
      ),
    );
  }
}

class _FooterColumn extends StatelessWidget {
  final String heading;
  final List<(String, String)> items;
  const _FooterColumn({required this.heading, required this.items});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(heading.toUpperCase(),
            style: AppFonts.body(size: 10, color: AppColors.stone500, weight: FontWeight.bold)
                .copyWith(letterSpacing: 1.5)),
        const SizedBox(height: 12),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GestureDetector(
                onTap: () => Navigator.pushNamed(context, item.$2),
                child: Text(item.$1, style: AppFonts.body(size: 12, color: AppColors.stone400)),
              ),
            )),
      ],
    );
  }
}
