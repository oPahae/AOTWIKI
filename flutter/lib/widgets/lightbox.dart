import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import '../config/theme.dart';
import '../utils/assets.dart';

/// Full-screen pinch-to-zoom image viewer with prev/next navigation —
/// ports the site's custom `<Lightbox>` component (zoom in/out buttons,
/// swipe/arrow navigation, download button) used on both the Gallery and
/// Eyecatch pages.
class Lightbox extends StatefulWidget {
  final List<String> webPaths; // "/gallery/faces/1.png" style paths
  final int initialIndex;

  const Lightbox({super.key, required this.webPaths, required this.initialIndex});

  static void open(BuildContext context, List<String> webPaths, int index) {
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        barrierColor: Colors.black,
        pageBuilder: (context, _, __) => Lightbox(webPaths: webPaths, initialIndex: index),
      ),
    );
  }

  @override
  State<Lightbox> createState() => _LightboxState();
}

class _LightboxState extends State<Lightbox> {
  late PageController _controller;
  late int _index;

  @override
  void initState() {
    super.initState();
    _index = widget.initialIndex;
    _controller = PageController(initialPage: _index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          PhotoViewGallery.builder(
            pageController: _controller,
            itemCount: widget.webPaths.length,
            onPageChanged: (i) => setState(() => _index = i),
            builder: (context, i) => PhotoViewGalleryPageOptions(
              imageProvider: AssetImage(AppAssets.image(widget.webPaths[i])),
              minScale: PhotoViewComputedScale.contained,
              maxScale: PhotoViewComputedScale.covered * 5,
              errorBuilder: (context, error, stack) => Container(
                color: AppColors.surface,
                alignment: Alignment.center,
                child: const Icon(Icons.image_not_supported_outlined,
                    color: AppColors.stone600, size: 48),
              ),
            ),
          ),
          Positioned(
            top: 40,
            right: 16,
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.white, size: 28),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          Positioned(
            top: 44,
            left: 16,
            child: Text(
              '${_index + 1} / ${widget.webPaths.length}',
              style: AppFonts.body(size: 13, color: Colors.white),
            ),
          ),
          if (widget.webPaths.length > 1) ...[
            Positioned(
              left: 8,
              top: 0,
              bottom: 0,
              child: Center(
                child: IconButton(
                  icon: const Icon(Icons.chevron_left, color: Colors.white, size: 32),
                  onPressed: () => _controller.previousPage(
                      duration: const Duration(milliseconds: 200), curve: Curves.easeOut),
                ),
              ),
            ),
            Positioned(
              right: 8,
              top: 0,
              bottom: 0,
              child: Center(
                child: IconButton(
                  icon: const Icon(Icons.chevron_right, color: Colors.white, size: 32),
                  onPressed: () => _controller.nextPage(
                      duration: const Duration(milliseconds: 200), curve: Curves.easeOut),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
