import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../models/models.dart';
import '../routes/app_router.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/closing_quote.dart';
import '../widgets/common.dart';

/// Port of pages/characters.jsx — a hero ("ALL CHARACTERS" + faction anchor
/// pills), then one alternating-background section per faction (logo +
/// tagline + name + desc, then a grid of portraits), closing with the
/// quote-card pair. The site reveals each character's role/desc on
/// `:hover`; since touch has no hover, this app reveals the same info on
/// tap via a bottom sheet (see PortraitTile usage below).
class CharactersScreen extends StatefulWidget {
  const CharactersScreen({super.key});

  @override
  State<CharactersScreen> createState() => _CharactersScreenState();
}

class _CharactersScreenState extends State<CharactersScreen> {
  final Map<String, GlobalKey> _keys = {};
  final ScrollController _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    for (final f in Repo.factions) {
      _keys[f.id] = GlobalKey();
    }
  }

  void _scrollTo(String id) {
    final ctx = _keys[id]?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx, duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    final factions = Repo.factions;
    return AppScaffold(
      route: AppRoutes.characters,
      title: 'Characters',
      body: SingleChildScrollView(
        controller: _scroll,
        child: Column(
          children: [
            _CharactersHero(onAnchorTap: _scrollTo),
            for (var i = 0; i < factions.length; i++)
              Container(
                key: _keys[factions[i].id],
                color: i.isOdd ? const Color(0xFF0D0C0B) : AppColors.background,
                child: _FactionSection(faction: factions[i]),
              ),
            const ClosingQuoteCards(
              japanese: '心臓を捧げよ',
              englishCaption: 'Dedicate your heart',
              icon: Icons.warning_amber_rounded,
              kicker: 'Every side of the war',
              title: 'Scouts, Warriors, and Kings alike',
            ),
          ],
        ),
      ),
    );
  }
}

class _CharactersHero extends StatelessWidget {
  final ValueChanged<String> onAnchorTap;
  const _CharactersHero({required this.onAnchorTap});

  @override
  Widget build(BuildContext context) {
    final total = Repo.totalCharacterCount;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 28, 16, 24),
      decoration: BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.topCenter,
          radius: 1.2,
          colors: [AppColors.red900.withOpacity(0.35), Colors.transparent],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.close, color: AppColors.red700, size: 22),
              const SizedBox(width: 10),
              Text('FACES OF THE WAR',
                  style: AppFonts.metal(size: 12, color: AppColors.red600).copyWith(letterSpacing: 3)),
            ],
          ),
          const SizedBox(height: 12),
          RichText(
            text: TextSpan(
              style: AppFonts.scream(size: 38).copyWith(
                shadows: [Shadow(color: AppColors.red900.withOpacity(0.85), blurRadius: 18)],
              ),
              children: [
                const TextSpan(text: 'ALL '),
                TextSpan(
                  text: 'CHARACTERS',
                  style: TextStyle(color: AppColors.red700, shadows: [Shadow(color: AppColors.red700.withOpacity(0.9), blurRadius: 26)]),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Text(
            "From the Scout Regiment's fallen heroes to Marley's Warrior candidates, the hidden Reiss bloodline, and every soldier, civilian, and legend in between — $total characters, grouped by the faction they served. Tap a portrait to reveal their story.",
            style: AppFonts.body(size: 13, color: AppColors.stone300).copyWith(height: 1.5),
          ),
          const SizedBox(height: 18),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: Repo.factions
                .map((f) => GestureDetector(
                      onTap: () => onAnchorTap(f.id),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          color: Colors.white.withOpacity(0.05),
                          border: Border.all(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: Text(f.name.toUpperCase(),
                            style: AppFonts.body(size: 10, color: AppColors.stone300, weight: FontWeight.bold)
                                .copyWith(letterSpacing: 0.8)),
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _FactionSection extends StatelessWidget {
  final Faction faction;
  const _FactionSection({required this.faction});

  @override
  Widget build(BuildContext context) {
    final accent = kFactionAccent[faction.id] ?? AppColors.red500;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(width: 56, height: 56, child: AotImage(faction.logo, fit: BoxFit.contain)),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(faction.tagline.toUpperCase(),
                        style: AppFonts.metal(size: 11, color: accent).copyWith(letterSpacing: 2)),
                    Text(faction.name,
                        style: AppFonts.gothic(size: 20, weight: FontWeight.w900).copyWith(
                          shadows: [Shadow(color: AppColors.red900.withOpacity(0.5), blurRadius: 12)],
                        )),
                    const SizedBox(height: 6),
                    Text(faction.desc, style: AppFonts.body(size: 12, color: AppColors.stone400).copyWith(height: 1.5)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 0.72,
            ),
            itemCount: faction.characters.length,
            itemBuilder: (context, i) {
              final c = faction.characters[i];
              return PortraitTile(
                webPath: c.img,
                name: c.name,
                subtitle: c.role,
                onTap: () => showModalBottomSheet(
                  context: context,
                  backgroundColor: AppColors.surface,
                  isScrollControlled: true,
                  builder: (context) => _CharacterDetailSheet(character: c, accent: accent),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _CharacterDetailSheet extends StatelessWidget {
  final Character character;
  final Color accent;
  const _CharacterDetailSheet({required this.character, required this.accent});

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.6,
      minChildSize: 0.3,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) => ListView(
        controller: scrollController,
        padding: const EdgeInsets.all(20),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: AspectRatio(aspectRatio: 3 / 4, child: AotImage(character.img)),
          ),
          const SizedBox(height: 16),
          Text(character.name.toUpperCase(), style: AppFonts.gothic(size: 18, color: AppColors.stone100, weight: FontWeight.w900)),
          const SizedBox(height: 4),
          Text(character.role.toUpperCase(),
              style: AppFonts.body(size: 11, color: accent, weight: FontWeight.bold).copyWith(letterSpacing: 1)),
          const SizedBox(height: 14),
          Text(character.desc, style: AppFonts.body(size: 13, color: AppColors.stone300).copyWith(height: 1.6)),
        ],
      ),
    );
  }
}
