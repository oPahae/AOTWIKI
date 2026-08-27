import '../models/models.dart';
import 'characters_data.dart';
import 'episodes_data.dart';
import 'eyecatch_data.dart';
import 'gallery_data.dart';
import 'infos_data.dart';
import 'logos_data.dart';
import 'osts_data.dart';
import 'quiz_data.dart';
import 'songs_data.dart';
import 'team_data.dart';
import 'world_data.dart';

Map<String, dynamic> _m(dynamic e) => Map<String, dynamic>.from(e as Map);

/// Single access point for every dataset in the app — the Dart equivalent
/// of importing from `constants/*.js` throughout the Next.js project.
class Repo {
  Repo._();

  // characters.js
  static final List<Faction> factions =
      factionsData.map((e) => Faction.fromMap(_m(e))).toList();
  static final List<Character> charactersLanding =
      charactersLandingData.map((e) => Character.fromMap(_m(e))).toList();

  // episodes.js
  static final List<Season> seasons =
      seasonsData.map((e) => Season.fromMap(_m(e))).toList();

  // osts.js
  static final List<OstTrack> osts = ostsData.map((e) => OstTrack.fromMap(_m(e))).toList();
  static final List<OstTrack> ostsLanding =
      ostsLandingData.map((e) => OstTrack.fromMap(_m(e))).toList();

  // songs.js
  static final List<Song> songs = songsData.map((e) => Song.fromMap(_m(e))).toList();

  // team.js
  static final TeamMember author = TeamMember.fromMap(authorData);
  static final List<TeamMember> witStudioStaff =
      witStudioStaffData.map((e) => TeamMember.fromMap(_m(e))).toList();
  static final List<TeamMember> voiceActors =
      voiceActorsData.map((e) => TeamMember.fromMap(_m(e))).toList();

  // world.js
  static final List<WallInfo> walls = wallsData.map((e) => WallInfo.fromMap(_m(e))).toList();
  static final List<WorldPlace> wallMariaPlaces =
      wallMariaPlacesData.map((e) => WorldPlace.fromMap(_m(e))).toList();
  static final List<WorldPlace> wallRosePlaces =
      wallRosePlacesData.map((e) => WorldPlace.fromMap(_m(e))).toList();
  static final List<WorldPlace> wallSinaPlaces =
      wallSinaPlacesData.map((e) => WorldPlace.fromMap(_m(e))).toList();
  static final List<WorldPlace> specialSites =
      specialSitesData.map((e) => WorldPlace.fromMap(_m(e))).toList();
  static final List<WorldPlace> worldPlaces =
      worldPlacesData.map((e) => WorldPlace.fromMap(_m(e))).toList();

  // infos.js
  static final List<TimelineEvent> timeline =
      timelineData.map((e) => TimelineEvent.fromMap(_m(e))).toList();
  static final List<String> gallerySpotlight = galleryData.map((e) => e.toString()).toList();
  static final List<SocialLink> socialLinks =
      socialLinksData.map((e) => SocialLink.fromMap(_m(e))).toList();

  // logos.js
  static final List<LogoItem> logos = logosData.map((e) => LogoItem.fromMap(_m(e))).toList();

  // quiz.js
  static final List<QuizQuestion> seasonQuestions =
      seasonQuestionsData.map((e) => QuizQuestion.fromMap(_m(e))).toList();
  static const int questionCount = questionCountData;
  static const int answerTimeMs = answerTimeMsData;
  static const int revealTimeMs = revealTimeMsData;
  static final List<int> seasonChoices = seasonChoicesData.map((e) => e as int).toList();

  // gallery (derived from public/gallery/* directory listing)
  static final List<String> galleryBodyparts = bodypartsData.map((e) => e.toString()).toList();
  static final List<String> galleryEyes = eyesData.map((e) => e.toString()).toList();
  static final List<String> galleryFaces = facesData.map((e) => e.toString()).toList();
  static final List<String> galleryTitans = titansData.map((e) => e.toString()).toList();
  static final List<String> galleryVisuals = visualsData.map((e) => e.toString()).toList();

  static Map<String, List<String>> get galleryByCategory => {
        'bodyparts': galleryBodyparts,
        'eyes': galleryEyes,
        'faces': galleryFaces,
        'titans': galleryTitans,
        'visuals': galleryVisuals,
      };

  // eyecatch (derived from public/eyecatch/* directory listing)
  static final List<EyecatchGroup> eyecatch =
      eyecatchData.map((e) => EyecatchGroup.fromMap(_m(e))).toList();

  static int get totalCharacterCount =>
      factions.fold(0, (sum, f) => sum + f.characters.length);
}
