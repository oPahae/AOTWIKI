/// Typed model classes wrapping the raw JSON-derived maps in lib/data/.
/// Kept intentionally simple (Map-backed) so every field from the original
/// Next.js constants/*.js files survives the conversion without loss.
library;

class Character {
  final String name;
  final String img;
  final String role;
  final String desc;

  Character({required this.name, required this.img, required this.role, required this.desc});

  factory Character.fromMap(Map<String, dynamic> m) => Character(
        name: m['name'] ?? '',
        img: m['img'] ?? '',
        role: m['role'] ?? '',
        desc: m['desc'] ?? '',
      );
}

class Faction {
  final String id;
  final String name;
  final String tagline;
  final String logo;
  final String chipColor;
  final String desc;
  final List<Character> characters;

  Faction({
    required this.id,
    required this.name,
    required this.tagline,
    required this.logo,
    required this.chipColor,
    required this.desc,
    required this.characters,
  });

  factory Faction.fromMap(Map<String, dynamic> m) => Faction(
        id: m['id'] ?? '',
        name: m['name'] ?? '',
        tagline: m['tagline'] ?? '',
        logo: m['logo'] ?? '',
        chipColor: m['chipColor'] ?? '',
        desc: m['desc'] ?? '',
        characters: ((m['characters'] as List?) ?? [])
            .map((c) => Character.fromMap(Map<String, dynamic>.from(c)))
            .toList(),
      );
}

class Episode {
  final int ep;
  final String title;
  final String date;
  final String duration;
  final double rating;
  final String? img;

  Episode({
    required this.ep,
    required this.title,
    required this.date,
    required this.duration,
    required this.rating,
    this.img,
  });

  factory Episode.fromMap(Map<String, dynamic> m) => Episode(
        ep: m['ep'] ?? 0,
        title: m['title'] ?? '',
        date: m['date'] ?? '',
        duration: m['duration'] ?? '',
        rating: (m['rating'] ?? 0).toDouble(),
        img: m['img'],
      );
}

class Season {
  final int season;
  final String title;
  final String years;
  final List<Episode> episodes;

  Season({required this.season, required this.title, required this.years, required this.episodes});

  factory Season.fromMap(Map<String, dynamic> m) => Season(
        season: m['season'] ?? 0,
        title: m['label'] ?? m['title'] ?? '',
        years: m['range'] ?? m['years'] ?? '',
        episodes: ((m['episodes'] as List?) ?? [])
            .map((e) => Episode.fromMap(Map<String, dynamic>.from(e)))
            .toList(),
      );
}

class OstTrack {
  final String name;
  final String artist;
  final String time;
  final String url;
  final List<String> bestParts;
  final double rating;

  OstTrack({
    required this.name,
    required this.artist,
    required this.time,
    required this.url,
    required this.bestParts,
    required this.rating,
  });

  /// Best-known "highlight" timestamp, used by the site's "jump to best
  /// part" button (first entry of bestParts).
  String get bestPart => bestParts.isNotEmpty ? bestParts.first : '00:00';

  factory OstTrack.fromMap(Map<String, dynamic> m) => OstTrack(
        name: m['name'] ?? '',
        artist: m['artist'] ?? '',
        time: m['time'] ?? '',
        url: m['url'] ?? '',
        bestParts: ((m['bestParts'] as List?) ?? []).map((e) => e.toString()).toList(),
        rating: (m['rating'] ?? 0).toDouble(),
      );
}

class Song {
  final String id;
  final String type; // opening | ending
  final int index;
  final String season;
  final String title;
  final String artist;
  final String episodes;
  final String youtubeId;
  final String cover;

  Song({
    required this.id,
    required this.type,
    required this.index,
    required this.season,
    required this.title,
    required this.artist,
    required this.episodes,
    required this.youtubeId,
    required this.cover,
  });

  factory Song.fromMap(Map<String, dynamic> m) => Song(
        id: m['id'] ?? '',
        type: m['type'] ?? '',
        index: m['index'] ?? 0,
        season: m['season'] ?? '',
        title: m['title'] ?? '',
        artist: m['artist'] ?? '',
        episodes: m['episodes'] ?? '',
        youtubeId: m['youtubeId'] ?? '',
        cover: m['cover'] ?? '',
      );
}

class TeamMember {
  final String name;
  final String role;
  final String desc;
  final String? character; // for voice actors: the AOT character they voice

  TeamMember({required this.name, required this.role, required this.desc, this.character});

  /// The site has no explicit `img` field for team members — it derives the
  /// path from the person's name at render time (`/team/{name}.jpg`, with a
  /// generated-avatar fallback on 404). See TeamAvatar widget.
  factory TeamMember.fromMap(Map<String, dynamic> m) => TeamMember(
        name: m['name'] ?? '',
        role: m['role'] ?? '',
        desc: m['desc'] ?? '',
        character: m['character'],
      );
}

class WorldPlace {
  final String name;
  final String img;
  final String desc;
  final String icon;

  WorldPlace({required this.name, required this.img, required this.desc, required this.icon});

  factory WorldPlace.fromMap(Map<String, dynamic> m) => WorldPlace(
        name: m['name'] ?? '',
        img: m['img'] ?? '',
        desc: m['desc'] ?? '',
        icon: m['icon'] ?? '',
      );
}

class WallInfo {
  final String name;
  final String subtitle;
  final String img;
  final String desc;

  WallInfo({required this.name, required this.subtitle, required this.img, required this.desc});

  factory WallInfo.fromMap(Map<String, dynamic> m) => WallInfo(
        name: m['name'] ?? '',
        subtitle: m['subtitle'] ?? '',
        img: m['img'] ?? '',
        desc: m['desc'] ?? '',
      );
}

class TimelineEvent {
  final String year;
  final String text;

  TimelineEvent({required this.year, required this.text});

  factory TimelineEvent.fromMap(Map<String, dynamic> m) => TimelineEvent(
        year: m['year'] ?? '',
        text: m['text'] ?? '',
      );
}

class SocialLink {
  final int id;
  final String icon;
  final String link;

  SocialLink({required this.id, required this.icon, required this.link});

  factory SocialLink.fromMap(Map<String, dynamic> m) => SocialLink(
        id: m['id'] ?? 0,
        icon: m['icon'] ?? '',
        link: m['link'] ?? '',
      );
}

class LogoItem {
  final String name;
  final String img;
  final String desc;

  LogoItem({required this.name, required this.img, required this.desc});

  factory LogoItem.fromMap(Map<String, dynamic> m) => LogoItem(
        name: m['name'] ?? '',
        img: m['img'] ?? '',
        desc: m['desc'] ?? '',
      );
}

/// The AOT Wiki quiz shows an in-game screenshot and asks the player to
/// guess which season it's from — this mirrors the real
/// `constants/quiz.js` shape: { id, season, image }, answered against the
/// fixed SEASON_CHOICES list (1..4).
class QuizQuestion {
  final int id;
  final int season;
  final String image;

  QuizQuestion({required this.id, required this.season, required this.image});

  factory QuizQuestion.fromMap(Map<String, dynamic> m) => QuizQuestion(
        id: m['id'] ?? 0,
        season: m['season'] ?? 0,
        image: m['image'] ?? '',
      );
}

class EyecatchGroup {
  final String key;
  final int season;
  final int episode;
  final bool isOva;
  final List<String> images;

  EyecatchGroup({
    required this.key,
    required this.season,
    required this.episode,
    required this.isOva,
    required this.images,
  });

  factory EyecatchGroup.fromMap(Map<String, dynamic> m) => EyecatchGroup(
        key: m['key'] ?? '',
        season: m['season'] ?? 0,
        episode: m['episode'] ?? 0,
        isOva: m['isOva'] ?? false,
        images: ((m['images'] as List?) ?? []).map((e) => e.toString()).toList(),
      );

  String get label => isOva ? 'OVA $episode' : 'S$season E$episode';
}
