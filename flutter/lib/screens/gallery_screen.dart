import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../data/repository.dart';
import '../routes/app_router.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/common.dart';
import '../widgets/lightbox.dart';
import '../widgets/page_hero.dart';

/// Port of pages/gallery.jsx — hero, a row of pill filter buttons (single
/// active category, not tabs), and a grid of torn-border thumbnails that
/// open the pinch-zoom lightbox on tap.
class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  late String _filter;
  final categories = Repo.galleryByCategory;

  @override
  void initState() {
    super.initState();
    _filter = categories.keys.first;
  }

  String _titleCase(String s) => s[0].toUpperCase() + s.substring(1);

  @override
  Widget build(BuildContext context) {
    final keys = categories.keys.toList();
    final files = categories[_filter]!.map((f) => '/gallery/$_filter/$f').toList();
    return AppScaffold(
      route: AppRoutes.gallery,
      title: 'Gallery',
      body: Column(
        children: [
          const PageHero(
            kicker: 'Visual Archives',
            titlePrefix: 'The',
            titleAccent: 'Gallery',
            description: 'The most striking shots from the series. Tap any image to zoom in.',
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: keys.map((k) {
                final selected = k == _filter;
                return GestureDetector(
                  onTap: () => setState(() => _filter = k),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(999),
                      color: selected ? AppColors.red700 : Colors.white.withOpacity(0.05),
                      border: Border.all(color: selected ? AppColors.red700 : Colors.white.withOpacity(0.1)),
                      boxShadow: selected ? [BoxShadow(color: AppColors.red900.withOpacity(0.5), blurRadius: 15)] : null,
                    ),
                    child: Text(_titleCase(k).toUpperCase(),
                        style: AppFonts.body(
                                size: 11, color: selected ? Colors.white : AppColors.stone300, weight: FontWeight.bold)
                            .copyWith(letterSpacing: 0.6)),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(child: _GalleryGrid(webPaths: files)),
        ],
      ),
    );
  }
}

class _GalleryGrid extends StatelessWidget {
  final List<String> webPaths;
  const _GalleryGrid({required this.webPaths});

  @override
  Widget build(BuildContext context) {
    if (webPaths.isEmpty) return const EmptyState(message: 'No images in this category.');
    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
      ),
      itemCount: webPaths.length,
      itemBuilder: (context, i) => GestureDetector(
        onTap: () => Lightbox.open(context, webPaths, i),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(3),
          child: Container(
            decoration: BoxDecoration(border: Border.all(color: AppColors.red900.withOpacity(0.55))),
            child: AotImage(webPaths[i]),
          ),
        ),
      ),
    );
  }
}
