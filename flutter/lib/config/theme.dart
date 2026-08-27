import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Central color & typography tokens, ported 1:1 from the Next.js project's
/// Tailwind gothic-horror design system (globals.css + inline <style jsx>).
class AppColors {
  AppColors._();

  static const Color background = Color(0xFF0A0908); // bg-[#0a0908]
  static const Color surface = Color(0xFF14100F);
  static const Color card = Color(0x66000000); // bg-black/40
  static const Color stone100 = Color(0xFFF5F5F4);
  static const Color stone200 = Color(0xFFE7E5E4);
  static const Color stone300 = Color(0xFFD6D3D1);
  static const Color stone400 = Color(0xFFA8A29E);
  static const Color stone500 = Color(0xFF78716C);
  static const Color stone600 = Color(0xFF57534E);
  static const Color red900 = Color(0xFF7F1D1D);
  static const Color red800 = Color(0xFF991B1B);
  static const Color red700 = Color(0xFFB91C1C);
  static const Color red600 = Color(0xFFDC2626);
  static const Color red500 = Color(0xFFEF4444);
  static const Color green800 = Color(0xFF166534);
  static const Color green500 = Color(0xFF22C55E);
  static const Color orange600 = Color(0xFFEA580C);
  static const Color orange400 = Color(0xFFFB923C);
  static const Color yellow400 = Color(0xFFFACC15);
}

/// Faction/section accent colors keyed the same way the JS `chipColor` /
/// `accent` Tailwind classes were, so screens can look these up by faction id.
const Map<String, Color> kFactionAccent = {
  'survey-corps': Color(0xFF22C55E),
  'military-police': Color(0xFFD6D3D1),
  'garrison': Color(0xFF60A5FA),
  'cadet-corps': Color(0xFFFACC15),
  'marley': Color(0xFFA78BFA),
  'warriors': Color(0xFFF97316),
  'house-reiss': Color(0xFFF472B6),
  'tybur-family': Color(0xFFFBBF24),
};

class AppFonts {
  AppFonts._();

  /// font-scream — used for hero titles / big dramatic headers.
  static TextStyle scream({double size = 28, Color? color}) =>
      GoogleFonts.nosifer(fontSize: size, color: color ?? AppColors.stone200);

  /// font-gothic — used for section headers.
  static TextStyle gothic({double size = 20, FontWeight? weight, Color? color}) =>
      GoogleFonts.cinzelDecorative(
        fontSize: size,
        fontWeight: weight ?? FontWeight.w700,
        color: color ?? AppColors.stone200,
      );

  /// font-blackletter — used for decorative accents.
  static TextStyle blackletter({double size = 18, Color? color}) =>
      GoogleFonts.unifrakturMaguntia(fontSize: size, color: color ?? AppColors.stone300);

  /// font-metal — used for tags/labels.
  static TextStyle metal({double size = 14, Color? color}) =>
      GoogleFonts.metalMania(fontSize: size, color: color ?? AppColors.red500);

  static TextStyle body({double size = 14, Color? color, FontWeight? weight}) =>
      TextStyle(fontSize: size, color: color ?? AppColors.stone300, fontWeight: weight);
}

ThemeData buildAppTheme() {
  final base = ThemeData.dark(useMaterial3: true);
  return base.copyWith(
    scaffoldBackgroundColor: AppColors.background,
    primaryColor: AppColors.red800,
    colorScheme: base.colorScheme.copyWith(
      primary: AppColors.red800,
      secondary: AppColors.red700,
      surface: AppColors.surface,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.background.withOpacity(0.95),
      elevation: 0,
      titleTextStyle: AppFonts.gothic(size: 18),
      iconTheme: const IconThemeData(color: AppColors.stone200),
    ),
    drawerTheme: const DrawerThemeData(backgroundColor: AppColors.surface),
    textTheme: GoogleFonts.interTextTheme(base.textTheme).apply(
      bodyColor: AppColors.stone300,
      displayColor: AppColors.stone200,
    ),
    dividerColor: AppColors.red900.withOpacity(0.4),
    snackBarTheme: const SnackBarThemeData(backgroundColor: AppColors.surface),
  );
}

/// Reusable "torn-border" decoration, ported from the `.torn-border` CSS
/// class used throughout the site's cards/inputs.
BoxDecoration tornBorderDecoration({Color? borderColor, double radius = 2}) {
  return BoxDecoration(
    color: Colors.black.withOpacity(0.4),
    borderRadius: BorderRadius.circular(radius),
    border: Border.all(color: borderColor ?? AppColors.red900.withOpacity(0.55), width: 1.5),
    boxShadow: [
      BoxShadow(color: Colors.black.withOpacity(0.6), blurRadius: 1),
      BoxShadow(color: AppColors.red900.withOpacity(0.25), blurRadius: 25),
    ],
  );
}

/// The red-to-black gradient CTA button used throughout the site
/// (`bg-gradient-to-b from-red-700 to-red-950 ... shadow-[0_0_30px_rgba(120,0,0,0.6)]`).
BoxDecoration gradientButtonDecoration() => BoxDecoration(
      gradient: const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [AppColors.red700, Color(0xFF450A0A)],
      ),
      borderRadius: BorderRadius.circular(3),
      border: Border.all(color: AppColors.red900.withOpacity(0.6)),
      boxShadow: [BoxShadow(color: AppColors.red900.withOpacity(0.6), blurRadius: 30)],
    );
