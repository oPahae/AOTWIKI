import 'package:flutter/material.dart';
import '../screens/home_screen.dart';
import '../screens/characters_screen.dart';
import '../screens/episodes_screen.dart';
import '../screens/map_screen.dart';
import '../screens/eyecatch_screen.dart';
import '../screens/gallery_screen.dart';
import '../screens/osts_screen.dart';
import '../screens/songs_screen.dart';
import '../screens/quiz_screen.dart';
import '../screens/team_screen.dart';
import '../screens/search_screen.dart';
import '../screens/not_found_screen.dart';

/// Route table — Next.js file-based routing (pages/*.jsx) mapped 1:1 to
/// named Flutter routes.
class AppRoutes {
  AppRoutes._();

  static const home = '/';
  static const characters = '/characters';
  static const episodes = '/episodes';
  static const map = '/map';
  static const eyecatch = '/eyecatch';
  static const gallery = '/gallery';
  static const osts = '/osts';
  static const songs = '/songs';
  static const quiz = '/quiz';
  static const team = '/team';
  static const search = '/search';
  static const notFound = '/404';

  static Map<String, WidgetBuilder> get table => {
        home: (_) => const HomeScreen(),
        characters: (_) => const CharactersScreen(),
        episodes: (_) => const EpisodesScreen(),
        map: (_) => const MapScreen(),
        eyecatch: (_) => const EyecatchScreen(),
        gallery: (_) => const GalleryScreen(),
        osts: (_) => const OstsScreen(),
        songs: (_) => const SongsScreen(),
        quiz: (_) => const QuizScreen(),
        team: (_) => const TeamScreen(),
        search: (_) => const SearchScreen(),
      };

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final builder = table[settings.name];
    if (builder != null) {
      return MaterialPageRoute(builder: builder, settings: settings);
    }
    return MaterialPageRoute(builder: (_) => const NotFoundScreen(), settings: settings);
  }
}
