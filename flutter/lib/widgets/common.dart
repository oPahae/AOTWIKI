import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../utils/assets.dart';

/// Loads a bundled asset image and gracefully falls back to a placeholder
/// (instead of crashing) when the asset is missing from the local copy —
/// this happens if the person hasn't run scripts/copy_assets yet, or if a
/// given character/place simply has no image in the source repo.
class AotImage extends StatelessWidget {
  final String webPath; // e.g. "/chars/eren.png"
  final BoxFit fit;
  final double? width;
  final double? height;
  final Widget? placeholderIcon;

  const AotImage(
    this.webPath, {
    super.key,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
    this.placeholderIcon,
  });

  @override
  Widget build(BuildContext context) {
    if (webPath.isEmpty) return _placeholder();
    return Image.asset(
      AppAssets.image(webPath),
      fit: fit,
      width: width,
      height: height,
      errorBuilder: (context, error, stack) => _placeholder(),
    );
  }

  Widget _placeholder() => Container(
        width: width,
        height: height,
        color: AppColors.surface,
        alignment: Alignment.center,
        child: placeholderIcon ??
            const Icon(Icons.image_not_supported_outlined, color: AppColors.stone600),
      );
}

/// Team headshot: tries the bundled `/team/{name}.jpg` asset first, then
/// falls back to a generated ui-avatars.com avatar — same behavior as the
/// site's onError handler.
class TeamAvatar extends StatelessWidget {
  final String name;
  final double size;

  const TeamAvatar({super.key, required this.name, this.size = 88});

  @override
  Widget build(BuildContext context) {
    return ClipOval(
      child: Image.asset(
        AppAssets.teamPhoto(name),
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stack) => Image.network(
          AppAssets.fallbackAvatarUrl(name),
          width: size,
          height: size,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stack) => CircleAvatar(
            radius: size / 2,
            backgroundColor: AppColors.red900,
            child: Text(
              name.isNotEmpty ? name[0] : '?',
              style: AppFonts.gothic(size: size / 2.5),
            ),
          ),
        ),
      ),
    );
  }
}

/// Section header pattern used on nearly every real page: a short colored
/// line + tracking-widest uppercase "kicker" label (font-metal), then a
/// large bold gothic title with a red glow — ported 1:1 from the repeated
/// `<span className="h-[2px] w-8 bg-red-600" /><span className="font-metal
/// ...">KICKER</span><h2 className="font-gothic ... [text-shadow...]">Title
/// </h2>` block that opens almost every section in index.jsx and the other
/// pages.
class SectionKicker extends StatelessWidget {
  final String label;
  final Color color;
  final MainAxisAlignment alignment;

  const SectionKicker({
    super.key,
    required this.label,
    this.color = AppColors.red700,
    this.alignment = MainAxisAlignment.start,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: alignment,
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 28, height: 2, color: color),
        const SizedBox(width: 10),
        Text(
          label.toUpperCase(),
          style: AppFonts.metal(size: 13, color: color).copyWith(letterSpacing: 3),
        ),
      ],
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String title;
  final TextAlign align;
  final double size;

  const SectionTitle({super.key, required this.title, this.align = TextAlign.left, this.size = 26});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      textAlign: align,
      style: AppFonts.gothic(size: size, weight: FontWeight.w900).copyWith(
        shadows: [Shadow(color: AppColors.red900.withOpacity(0.7), blurRadius: 14)],
      ),
    );
  }
}

/// Full "Kicker + Title (+ optional 'View All' link)" block, matching the
/// `<div className="flex justify-between"><div>kicker+title</div><Link>
/// View All</Link></div>` pattern repeated across every section.
class SectionHead extends StatelessWidget {
  final String kicker;
  final String title;
  final Color kickerColor;
  final String? actionLabel;
  final VoidCallback? onAction;
  final EdgeInsetsGeometry padding;

  const SectionHead({
    super.key,
    required this.kicker,
    required this.title,
    this.kickerColor = AppColors.red700,
    this.actionLabel,
    this.onAction,
    this.padding = const EdgeInsets.fromLTRB(16, 28, 16, 16),
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SectionKicker(label: kicker, color: kickerColor),
                const SizedBox(height: 10),
                SectionTitle(title: title),
              ],
            ),
          ),
          if (actionLabel != null)
            TextButton(
              onPressed: onAction,
              style: TextButton.styleFrom(foregroundColor: AppColors.red500, padding: EdgeInsets.zero),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(actionLabel!,
                      style: AppFonts.body(size: 11, color: AppColors.red500, weight: FontWeight.bold)
                          .copyWith(letterSpacing: 1)),
                  const SizedBox(width: 4),
                  const Icon(Icons.arrow_forward, size: 12, color: AppColors.red500),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Kept for the few remaining screens that still use a centered icon+title
/// header (e.g. the Quiz screen's in-progress bar) — most screens have been
/// migrated to [SectionHead] to match the real site.
class GothicSectionHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData icon;

  const GothicSectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.icon = Icons.shield,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: AppColors.red700, size: 18),
              const SizedBox(width: 10),
              Flexible(
                child: Text(
                  title,
                  textAlign: TextAlign.center,
                  style: AppFonts.gothic(size: 22),
                ),
              ),
              const SizedBox(width: 10),
              Icon(icon, color: AppColors.red700, size: 18),
            ],
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 6),
            Text(
              subtitle!,
              textAlign: TextAlign.center,
              style: AppFonts.body(size: 13, color: AppColors.stone500),
            ),
          ],
        ],
      ),
    );
  }
}

/// The red gradient CTA button (`Explore Wiki`, `Explore Places`, etc.)
class GradientCtaButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool outlined;

  const GradientCtaButton({
    super.key,
    required this.label,
    this.icon = Icons.arrow_forward,
    required this.onTap,
    this.outlined = false,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(3),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
          decoration: outlined
              ? BoxDecoration(
                  color: Colors.black.withOpacity(0.4),
                  border: Border.all(color: AppColors.red900.withOpacity(0.5)),
                  borderRadius: BorderRadius.circular(3),
                )
              : gradientButtonDecoration(),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(label.toUpperCase(),
                  style: AppFonts.gothic(size: 12, color: AppColors.stone200).copyWith(letterSpacing: 1.5)),
              const SizedBox(width: 8),
              Icon(icon, size: 14, color: outlined ? AppColors.red600 : AppColors.stone200),
            ],
          ),
        ),
      ),
    );
  }
}

/// The "jagged-frame" cast/character tile: cover image, dark gradient from
/// the bottom, name + role overlay. Flutter can't easily replicate the
/// site's zig-zag `clip-path`, so this keeps the rounded torn-border look
/// with the same gradient/typography treatment instead.
class PortraitTile extends StatelessWidget {
  final String webPath;
  final String name;
  final String subtitle;
  final VoidCallback? onTap;

  const PortraitTile({
    super.key,
    required this.webPath,
    required this.name,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(2),
        child: Container(
          decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
          child: AspectRatio(
            aspectRatio: 3 / 4,
            child: Stack(
              fit: StackFit.expand,
              children: [
                AotImage(webPath),
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withOpacity(0.55), Colors.black],
                      stops: const [0.4, 0.75, 1.0],
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
                      Text(name.toUpperCase(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppFonts.body(size: 11, color: AppColors.stone100, weight: FontWeight.w900)),
                      const SizedBox(height: 2),
                      Text(subtitle.toUpperCase(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppFonts.body(size: 9, color: AppColors.red500, weight: FontWeight.bold)
                              .copyWith(letterSpacing: 0.5)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Small circular icon button used in the site's real header/footer
/// (`w-9 h-9 rounded-full border border-white/10 bg-white/5`).
class CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final double size;

  const CircleIconButton({super.key, required this.icon, required this.onTap, this.size = 40});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withOpacity(0.05),
      shape: const CircleBorder(side: BorderSide(color: Colors.white24)),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: SizedBox(
          width: size,
          height: size,
          child: Icon(icon, color: AppColors.stone300, size: size * 0.42),
        ),
      ),
    );
  }
}

/// The repeated "torn-border" gothic card container.
class TornCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? borderColor;
  final VoidCallback? onTap;

  const TornCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(12),
    this.borderColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final content = Container(
      padding: padding,
      decoration: tornBorderDecoration(borderColor: borderColor),
      child: child,
    );
    if (onTap == null) return content;
    return InkWell(onTap: onTap, borderRadius: BorderRadius.circular(2), child: content);
  }
}

/// A small pill/chip used for roles, tags, factions.
class GothicChip extends StatelessWidget {
  final String label;
  final Color? color;

  const GothicChip({super.key, required this.label, this.color});

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.red500;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        border: Border.all(color: c.withOpacity(0.5)),
        borderRadius: BorderRadius.circular(999),
        color: c.withOpacity(0.1),
      ),
      child: Text(label, style: AppFonts.body(size: 11, color: c)),
    );
  }
}

class GothicSearchField extends StatelessWidget {
  final String hint;
  final ValueChanged<String> onChanged;
  final TextEditingController? controller;

  const GothicSearchField({
    super.key,
    required this.hint,
    required this.onChanged,
    this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: tornBorderDecoration(radius: 4),
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        style: AppFonts.body(size: 14, color: AppColors.stone200),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: AppFonts.body(size: 13, color: AppColors.stone600),
          prefixIcon: const Icon(Icons.search, color: AppColors.red700, size: 18),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        ),
      ),
    );
  }
}

/// Empty-state message, used when a filter/search yields no results.
class EmptyState extends StatelessWidget {
  final String message;
  const EmptyState({super.key, this.message = 'Nothing found in the archives.'});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          const Icon(Icons.search_off, color: AppColors.stone600, size: 40),
          const SizedBox(height: 12),
          Text(message, textAlign: TextAlign.center, style: AppFonts.body(color: AppColors.stone500)),
        ],
      ),
    );
  }
}
