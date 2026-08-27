import 'package:flutter/material.dart';

/// Maps the web-style asset paths stored in the data (e.g. "/chars/eren.png",
/// "/osts/Vogel im Käfig.mp3") to the equivalent bundled Flutter asset path
/// declared in pubspec.yaml. The folder names are identical to the
/// Next.js project's `public/` subfolders, so this is a straight prefix swap.
class AppAssets {
  AppAssets._();

  static String image(String webPath) {
    final clean = webPath.startsWith('/') ? webPath.substring(1) : webPath;
    return 'assets/images/$clean';
  }

  static String audio(String webPath) {
    // webPath looks like "/osts/Some Track.mp3" — audioplayers' AssetSource
    // wants a path relative to the `assets/` folder declared in pubspec.
    final clean = webPath.startsWith('/') ? webPath.substring(1) : webPath;
    return 'audio/$clean';
  }

  /// Team member headshots aren't in the data — the site derives them from
  /// the person's name at render time (`/team/{name}.jpg`).
  static String teamPhoto(String name) => 'assets/images/team/$name.jpg';

  /// Fallback avatar shown when a team photo asset is missing, matching the
  /// site's `fallbackAvatar()` helper (ui-avatars.com generated initials).
  static String fallbackAvatarUrl(String name) {
    final encoded = Uri.encodeComponent(name);
    return 'https://ui-avatars.com/api/?name=$encoded&background=7f1d1d&color=f5f5f4&size=256&bold=true';
  }

  /// Ports the voice-actor page's two-step character-portrait lookup:
  /// `slugifyChars` (first word, lowercased) tried against `/chars/`, then
  /// `slugifyCharacters` (whole name, lowercased, first space -> hyphen)
  /// tried against `/characters/` on failure.
  static String characterSlugChars(String name) {
    if (name.isEmpty) return '';
    return name.split(' ').first.toLowerCase();
  }

  static String characterSlugCharacters(String name) {
    return name.toLowerCase().replaceFirst(' ', '-');
  }
}

/// Ports the handful of react-icons (Fa*/Gi*) identifiers used in the data
/// files to Material icons with a similar meaning, since the exact glyphs
/// aren't available as a Flutter package without adding an icon font.
IconData mapReactIcon(String name) {
  switch (name) {
    case 'FaFacebookF':
      return Icons.facebook;
    case 'FaInstagram':
      return Icons.camera_alt;
    case 'FaLinkedin':
      return Icons.business_center;
    case 'FaYoutube':
      return Icons.play_circle_fill;
    case 'GiVillage':
      return Icons.holiday_village;
    case 'GiCastle':
      return Icons.castle;
    case 'GiForest':
      return Icons.forest;
    case 'GiChurch':
      return Icons.account_balance;
    case 'GiIsland':
      return Icons.terrain;
    case 'GiCannon':
      return Icons.gps_fixed;
    case 'GiFactory':
      return Icons.factory;
    case 'GiPagoda':
      return Icons.account_balance;
    case 'GiWorld':
      return Icons.public;
    case 'GiCrossedSwords':
      return Icons.close;
    case 'GiLaurelsTrophy':
      return Icons.emoji_events;
    default:
      return Icons.circle;
  }
}
