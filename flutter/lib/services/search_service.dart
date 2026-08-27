import '../data/repository.dart';
import '../models/models.dart';

enum SearchCategory { character, episode, timeline, wiki, ost, song, team, place }

class SearchResult {
  final SearchCategory category;
  final String title;
  final String subtitle;
  final String image;
  final Object payload;

  SearchResult({
    required this.category,
    required this.title,
    required this.subtitle,
    required this.image,
    required this.payload,
  });
}

/// Direct port of the site's `normalize()` + `levenshtein()` fuzzy matching
/// used on the /search page, applied across every dataset in the app
/// (characters, episodes, timeline, logos, osts, songs, team, world places).
class SearchService {
  SearchService._();

  static String normalize(String str) {
    return str
        .toLowerCase()
        .replaceAll(RegExp(r'[\u0300-\u036f]'), '')
        .trim();
  }

  static int levenshtein(String a, String b) {
    final m = a.length, n = b.length;
    if (m == 0) return n;
    if (n == 0) return m;
    final dp = List.generate(m + 1, (_) => List.filled(n + 1, 0));
    for (var i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (var j = 0; j <= n; j++) {
      dp[0][j] = j;
    }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] == b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 +
                [dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]]
                    .reduce((v, e) => v < e ? v : e);
      }
    }
    return dp[m][n];
  }

  /// True if `text` contains `query` or is within a small edit-distance
  /// tolerance of it (handles typos), same heuristic as the JS version.
  static bool fuzzyMatch(String text, String query) {
    final t = normalize(text);
    final q = normalize(query);
    if (q.isEmpty) return true;
    if (t.contains(q)) return true;
    final tolerance = q.length <= 4 ? 1 : (q.length / 4).floor();
    for (final word in t.split(RegExp(r'\s+'))) {
      if (levenshtein(word, q) <= tolerance) return true;
    }
    return false;
  }

  static List<SearchResult> search(String query) {
    if (query.trim().isEmpty) return [];
    final results = <SearchResult>[];

    for (final faction in Repo.factions) {
      for (final c in faction.characters) {
        if (fuzzyMatch(c.name, query) || fuzzyMatch(c.role, query)) {
          results.add(SearchResult(
            category: SearchCategory.character,
            title: c.name,
            subtitle: '${faction.name} — ${c.role}',
            image: c.img,
            payload: c,
          ));
        }
      }
    }

    for (final season in Repo.seasons) {
      for (final e in season.episodes) {
        if (fuzzyMatch(e.title, query)) {
          results.add(SearchResult(
            category: SearchCategory.episode,
            title: e.title,
            subtitle: '${season.title} · Episode ${e.ep}',
            image: e.img ?? '',
            payload: e,
          ));
        }
      }
    }

    for (final t in Repo.timeline) {
      if (fuzzyMatch(t.text, query) || fuzzyMatch(t.year, query)) {
        results.add(SearchResult(
          category: SearchCategory.timeline,
          title: t.year,
          subtitle: t.text,
          image: '',
          payload: t,
        ));
      }
    }

    for (final o in Repo.osts) {
      if (fuzzyMatch(o.name, query) || fuzzyMatch(o.artist, query)) {
        results.add(SearchResult(
          category: SearchCategory.ost,
          title: o.name,
          subtitle: o.artist,
          image: '',
          payload: o,
        ));
      }
    }

    for (final s in Repo.songs) {
      if (fuzzyMatch(s.title, query) || fuzzyMatch(s.artist, query)) {
        results.add(SearchResult(
          category: SearchCategory.song,
          title: s.title,
          subtitle: '${s.season} · ${s.artist}',
          image: s.cover,
          payload: s,
        ));
      }
    }

    if (fuzzyMatch(Repo.author.name, query)) {
      results.add(SearchResult(
        category: SearchCategory.team,
        title: Repo.author.name,
        subtitle: Repo.author.role,
        image: '',
        payload: Repo.author,
      ));
    }
    for (final m in Repo.witStudioStaff) {
      if (fuzzyMatch(m.name, query) || fuzzyMatch(m.role, query)) {
        results.add(SearchResult(
          category: SearchCategory.team,
          title: m.name,
          subtitle: m.role,
          image: '',
          payload: m,
        ));
      }
    }
    for (final m in Repo.voiceActors) {
      if (fuzzyMatch(m.name, query) || fuzzyMatch(m.character ?? '', query)) {
        results.add(SearchResult(
          category: SearchCategory.team,
          title: m.name,
          subtitle: 'Voices ${m.character ?? ''}',
          image: '',
          payload: m,
        ));
      }
    }

    final allPlaces = [
      ...Repo.wallMariaPlaces,
      ...Repo.wallRosePlaces,
      ...Repo.wallSinaPlaces,
      ...Repo.specialSites,
      ...Repo.worldPlaces,
    ];
    for (final p in allPlaces) {
      if (fuzzyMatch(p.name, query) || fuzzyMatch(p.desc, query)) {
        results.add(SearchResult(
          category: SearchCategory.place,
          title: p.name,
          subtitle: p.desc,
          image: p.img,
          payload: p,
        ));
      }
    }
    for (final w in Repo.walls) {
      if (fuzzyMatch(w.name, query)) {
        results.add(SearchResult(
          category: SearchCategory.place,
          title: w.name,
          subtitle: w.subtitle,
          image: w.img,
          payload: w,
        ));
      }
    }

    return results;
  }
}
