import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../routes/app_router.dart';
import '../services/search_service.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';

/// Port of pages/search.jsx — global fuzzy search across every dataset in
/// the app (characters, episodes, timeline, osts, songs, team, places).
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  String _query = '';
  List<SearchResult> _results = [];

  void _onChanged(String v) {
    setState(() {
      _query = v;
      _results = SearchService.search(v);
    });
  }

  IconData _categoryIcon(SearchCategory c) {
    switch (c) {
      case SearchCategory.character:
        return Icons.person;
      case SearchCategory.episode:
        return Icons.movie;
      case SearchCategory.timeline:
        return Icons.hourglass_bottom;
      case SearchCategory.wiki:
        return Icons.menu_book;
      case SearchCategory.ost:
        return Icons.music_note;
      case SearchCategory.song:
        return Icons.queue_music;
      case SearchCategory.team:
        return Icons.groups;
      case SearchCategory.place:
        return Icons.map;
    }
  }

  String _categoryLabel(SearchCategory c) {
    switch (c) {
      case SearchCategory.character:
        return 'Character';
      case SearchCategory.episode:
        return 'Episode';
      case SearchCategory.timeline:
        return 'Timeline';
      case SearchCategory.wiki:
        return 'Wiki';
      case SearchCategory.ost:
        return 'OST';
      case SearchCategory.song:
        return 'Song';
      case SearchCategory.team:
        return 'Team';
      case SearchCategory.place:
        return 'Place';
    }
  }

  String _routeFor(SearchCategory c) {
    switch (c) {
      case SearchCategory.character:
        return AppRoutes.characters;
      case SearchCategory.episode:
        return AppRoutes.episodes;
      case SearchCategory.timeline:
        return AppRoutes.home;
      case SearchCategory.wiki:
        return AppRoutes.home;
      case SearchCategory.ost:
        return AppRoutes.osts;
      case SearchCategory.song:
        return AppRoutes.songs;
      case SearchCategory.team:
        return AppRoutes.team;
      case SearchCategory.place:
        return AppRoutes.map;
    }
  }

  @override
  Widget build(BuildContext context) {
    final grouped = <SearchCategory, List<SearchResult>>{};
    for (final r in _results) {
      grouped.putIfAbsent(r.category, () => []).add(r);
    }

    return AppScaffold(
      route: AppRoutes.search,
      title: 'Search',
      showSearch: false,
      showFooter: false,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.close, color: AppColors.red700, size: 20),
                    const SizedBox(width: 10),
                    Text('SEARCH THE ARCHIVES',
                        style: AppFonts.metal(size: 11, color: AppColors.red600).copyWith(letterSpacing: 3)),
                  ],
                ),
                const SizedBox(height: 14),
                GothicSearchField(
                  hint: 'Search characters, episodes, music, places…',
                  onChanged: _onChanged,
                ),
                if (_query.trim().isNotEmpty) ...[
                  const SizedBox(height: 10),
                  RichText(
                    text: TextSpan(
                      style: AppFonts.body(size: 12, color: AppColors.stone500),
                      children: [
                        TextSpan(text: '${_results.length} result${_results.length == 1 ? '' : 's'} for '),
                        TextSpan(
                            text: '"$_query"',
                            style: const TextStyle(color: AppColors.red500, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: _query.trim().isEmpty
                ? const EmptyState(
                    message:
                        'Start typing to search across characters, episodes, soundtracks, openings & endings, cast & crew, world locations, and the gallery.')
                : _results.isEmpty
                    ? EmptyState(message: 'No results found for "$_query". Try a different spelling or a shorter term.')
                    : ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        children: SearchCategory.values.where((c) => grouped[c]?.isNotEmpty == true).map((cat) {
                          final items = grouped[cat]!;
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 22),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(_categoryIcon(cat), color: AppColors.red600, size: 16),
                                    const SizedBox(width: 8),
                                    Text('${_categoryLabel(cat)}s'.toUpperCase(),
                                        style: AppFonts.gothic(size: 15, weight: FontWeight.w900)),
                                    const SizedBox(width: 8),
                                    Text('(${items.length})',
                                        style: AppFonts.body(size: 11, color: AppColors.stone500)),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                ...items.map((r) => Padding(
                                      padding: const EdgeInsets.only(bottom: 8),
                                      child: TornCard(
                                        onTap: () => Navigator.pushNamed(context, _routeFor(r.category)),
                                        child: Row(
                                          children: [
                                            if (r.image.isNotEmpty)
                                              ClipRRect(
                                                borderRadius: BorderRadius.circular(4),
                                                child: SizedBox(width: 44, height: 44, child: AotImage(r.image)),
                                              )
                                            else
                                              Container(
                                                width: 44,
                                                height: 44,
                                                alignment: Alignment.center,
                                                decoration: BoxDecoration(
                                                  color: AppColors.surface,
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Icon(_categoryIcon(r.category), color: AppColors.red500, size: 18),
                                              ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(r.title,
                                                      style: AppFonts.body(size: 13, color: AppColors.stone200),
                                                      maxLines: 1,
                                                      overflow: TextOverflow.ellipsis),
                                                  Text(r.subtitle,
                                                      style: AppFonts.body(size: 11, color: AppColors.stone500),
                                                      maxLines: 1,
                                                      overflow: TextOverflow.ellipsis),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    )),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
          ),
        ],
      ),
    );
  }
}
