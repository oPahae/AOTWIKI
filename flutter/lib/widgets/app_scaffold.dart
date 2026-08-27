import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../routes/app_router.dart';
import 'app_drawer.dart';
import 'app_footer.dart';
import 'common.dart';

/// Port of the real site's header from `_app.jsx`: a fixed, transparent nav
/// with (on most pages) a search pill + a circular Home button, floating
/// top-right — no navbar links, no visible logo/title in the header itself
/// (that only appears in the Home hero). `showSearch` is false on
/// /osts, /songs, /quiz, matching the original's
/// `isAHeaderAndFooterPrblmPage...` check — and the Footer is likewise
/// hidden on those three pages.
///
/// The one addition beyond the original: since the real site has no
/// navigation menu at all (desktop visitors use footer links / in-page
/// "View All" links), and a mobile app still needs *some* way to reach
/// all 11 sections, a small menu button opens a Drawer. This is the one
/// deliberate structural adaptation for mobile called for in the brief.
class AppScaffold extends StatelessWidget {
  final String route;
  final String title;
  final Widget body;
  final bool showSearch;
  final bool showFooter;
  final Widget? floatingActionButton;

  const AppScaffold({
    super.key,
    required this.route,
    required this.title,
    required this.body,
    this.showSearch = true,
    this.showFooter = true,
    this.floatingActionButton,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      drawer: AppDrawer(currentRoute: route),
      floatingActionButton: floatingActionButton,
      body: Stack(
        children: [
          Positioned.fill(
            child: SafeArea(
              bottom: false,
              child: showFooter
                  ? ListView(
                      padding: EdgeInsets.zero,
                      children: [
                        const SizedBox(height: 64),
                        body,
                        const AppFooter(),
                      ],
                    )
                  : Padding(padding: const EdgeInsets.only(top: 64), child: body),
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Builder(
                      builder: (context) => CircleIconButton(
                        icon: Icons.menu,
                        onTap: () => Scaffold.of(context).openDrawer(),
                      ),
                    ),
                    Row(
                      children: [
                        if (showSearch)
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: CircleIconButton(
                              icon: Icons.search,
                              onTap: () => Navigator.pushNamed(context, AppRoutes.search),
                            ),
                          ),
                        CircleIconButton(
                          icon: Icons.home,
                          onTap: () =>
                              Navigator.pushNamedAndRemoveUntil(context, AppRoutes.home, (r) => false),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
