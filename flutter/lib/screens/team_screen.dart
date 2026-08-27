import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../utils/assets.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';
import '../widgets/page_hero.dart';

/// Port of pages/team.jsx — hero, then Original Author (big portrait +
/// bio), WIT Studio Crew (avatar + name/role/desc cards), and Voice Actors
/// (split actor-photo | character-photo cards), each independently
/// searchable, ending with a "Meet the Characters" CTA.
class TeamScreen extends StatefulWidget {
  const TeamScreen({super.key});

  @override
  State<TeamScreen> createState() => _TeamScreenState();
}

class _TeamScreenState extends State<TeamScreen> {
  String _authorQuery = '';
  String _staffQuery = '';
  String _vaQuery = '';

  bool _matches(String haystack, String q) => haystack.toLowerCase().contains(q.toLowerCase());

  @override
  Widget build(BuildContext context) {
    final author = Repo.author;
    final authorMatches =
        _authorQuery.isEmpty || _matches(author.name, _authorQuery) || _matches(author.role, _authorQuery);

    final staff = Repo.witStudioStaff
        .where((m) => _staffQuery.isEmpty || _matches(m.name, _staffQuery) || _matches(m.role, _staffQuery))
        .toList();

    final va = Repo.voiceActors
        .where((m) => _vaQuery.isEmpty || _matches(m.name, _vaQuery) || _matches(m.character ?? '', _vaQuery))
        .toList();

    return AppScaffold(
      route: AppRoutes.team,
      title: 'The Team',
      body: Column(
        children: [
          const PageHero(
            kicker: 'Behind the Walls',
            titlePrefix: 'CAST &',
            titleAccent: 'CREW',
            description:
                'The mangaka, the WIT Studio crew, and the voice cast who dedicated their hearts to bringing Attack on Titan to life.',
            centered: true,
          ),

          // ---- Original Author ----
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionKicker(label: 'Creator'),
                const SizedBox(height: 10),
                const SectionTitle(title: 'Original Author', size: 20),
                const SizedBox(height: 12),
                GothicSearchField(hint: "Search the author…", onChanged: (v) => setState(() => _authorQuery = v)),
                const SizedBox(height: 14),
                if (authorMatches)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.white.withOpacity(0.03),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: Column(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: SizedBox(
                            width: 160,
                            height: 160,
                            child: Image.asset(
                              AppAssets.teamPhoto(author.name),
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Image.network(
                                AppAssets.fallbackAvatarUrl(author.name),
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(color: AppColors.surface),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.edit, color: AppColors.red600, size: 13),
                            const SizedBox(width: 6),
                            Text(author.role.toUpperCase(),
                                style: AppFonts.body(size: 11, color: AppColors.red500, weight: FontWeight.bold)
                                    .copyWith(letterSpacing: 1.5)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(author.name,
                            textAlign: TextAlign.center,
                            style: AppFonts.gothic(size: 20, weight: FontWeight.w900)),
                        const SizedBox(height: 10),
                        Text(author.desc,
                            textAlign: TextAlign.center,
                            style: AppFonts.body(size: 12, color: AppColors.stone400).copyWith(height: 1.6)),
                      ],
                    ),
                  )
                else
                  const EmptyState(),
              ],
            ),
          ),

          // ---- WIT Studio Crew ----
          Container(
            width: double.infinity,
            color: const Color(0xFF0D0C0B),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionKicker(label: 'Animation Studio'),
                const SizedBox(height: 10),
                const SectionTitle(title: 'WIT Studio Crew', size: 20),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.movie_creation_outlined, color: AppColors.red600, size: 12),
                    const SizedBox(width: 6),
                    Text('SEASONS 1 – 3',
                        style: AppFonts.body(size: 10, color: AppColors.stone500).copyWith(letterSpacing: 1)),
                  ],
                ),
                const SizedBox(height: 12),
                GothicSearchField(hint: 'Search a member…', onChanged: (v) => setState(() => _staffQuery = v)),
                const SizedBox(height: 14),
                if (staff.isEmpty)
                  const EmptyState()
                else
                  ...staff.map((m) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            color: Colors.black.withOpacity(0.4),
                            border: Border.all(color: AppColors.red900.withOpacity(0.5)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  TeamAvatar(name: m.name, size: 56),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(m.name, style: AppFonts.body(size: 14, color: AppColors.stone100, weight: FontWeight.w900)),
                                        const SizedBox(height: 2),
                                        Text(m.role.toUpperCase(),
                                            style: AppFonts.body(size: 10, color: AppColors.red500, weight: FontWeight.bold)
                                                .copyWith(letterSpacing: 0.8)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(m.desc, style: AppFonts.body(size: 12, color: AppColors.stone500).copyWith(height: 1.5)),
                            ],
                          ),
                        ),
                      )),
              ],
            ),
          ),

          // ---- Voice Actors ----
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionKicker(label: 'Voice Cast'),
                const SizedBox(height: 10),
                const SectionTitle(title: 'Voice Actors', size: 20),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.mic, color: AppColors.red600, size: 12),
                    const SizedBox(width: 6),
                    Text('ORIGINAL JAPANESE CAST',
                        style: AppFonts.body(size: 10, color: AppColors.stone500).copyWith(letterSpacing: 1)),
                  ],
                ),
                const SizedBox(height: 12),
                GothicSearchField(
                    hint: 'Search by actor or character…', onChanged: (v) => setState(() => _vaQuery = v)),
                const SizedBox(height: 14),
                if (va.isEmpty)
                  const EmptyState()
                else
                  ...va.map((m) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.5))),
                            child: SizedBox(
                              height: 150,
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Stack(
                                      fit: StackFit.expand,
                                      children: [
                                        Image.asset(
                                          AppAssets.teamPhoto(m.name),
                                          fit: BoxFit.cover,
                                          errorBuilder: (_, __, ___) => Image.network(
                                            AppAssets.fallbackAvatarUrl(m.name),
                                            fit: BoxFit.cover,
                                            errorBuilder: (_, __, ___) => Container(color: AppColors.surface),
                                          ),
                                        ),
                                        DecoratedBox(
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              begin: Alignment.topCenter,
                                              end: Alignment.bottomCenter,
                                              colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
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
                                              Text('VOICE',
                                                  style: AppFonts.body(size: 9, color: AppColors.stone400, weight: FontWeight.bold)),
                                              Text(m.name.toUpperCase(),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: AppFonts.body(size: 11, color: AppColors.stone100, weight: FontWeight.w900)),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(width: 1, color: AppColors.red900.withOpacity(0.5)),
                                  Expanded(
                                    child: Stack(
                                      fit: StackFit.expand,
                                      children: [
                                        Image.asset(
                                          'assets/images/chars/${AppAssets.characterSlugChars(m.character ?? '')}.png',
                                          fit: BoxFit.cover,
                                          errorBuilder: (_, __, ___) => Image.asset(
                                            'assets/images/characters/${AppAssets.characterSlugCharacters(m.character ?? '')}.png',
                                            fit: BoxFit.cover,
                                            errorBuilder: (_, __, ___) => Container(color: AppColors.surface),
                                          ),
                                        ),
                                        DecoratedBox(
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              begin: Alignment.topCenter,
                                              end: Alignment.bottomCenter,
                                              colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
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
                                              Text('CHARACTER',
                                                  style: AppFonts.body(size: 9, color: AppColors.red500, weight: FontWeight.bold)),
                                              Text((m.character ?? '').toUpperCase(),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: AppFonts.body(size: 11, color: AppColors.stone100, weight: FontWeight.w900)),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      )),
                const SizedBox(height: 20),
                GradientCtaButton(
                    label: 'Meet the Characters',
                    onTap: () => Navigator.pushNamed(context, AppRoutes.characters)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
