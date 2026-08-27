import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../routes/app_router.dart';

class NavItem {
  final String label;
  final String route;
  final IconData icon;
  const NavItem(this.label, this.route, this.icon);
}

const List<NavItem> kNavItems = [
  NavItem('Home', AppRoutes.home, Icons.home),
  NavItem('Characters', AppRoutes.characters, Icons.groups),
  NavItem('Episodes', AppRoutes.episodes, Icons.movie),
  NavItem('World Map', AppRoutes.map, Icons.map),
  NavItem('Eyecatch', AppRoutes.eyecatch, Icons.photo_camera),
  NavItem('Gallery', AppRoutes.gallery, Icons.collections),
  NavItem('OSTs', AppRoutes.osts, Icons.music_note),
  NavItem('Songs', AppRoutes.songs, Icons.queue_music),
  NavItem('Quiz', AppRoutes.quiz, Icons.quiz),
  NavItem('Team', AppRoutes.team, Icons.people_alt),
  NavItem('Search', AppRoutes.search, Icons.search),
];

/// Mobile navigation Drawer — replaces the Next.js site's desktop top
/// navbar / mobile hamburger menu (`menuOpen` state in index.jsx).
class AppDrawer extends StatelessWidget {
  final String currentRoute;
  const AppDrawer({super.key, required this.currentRoute});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: AppColors.surface,
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.red900.withOpacity(0.4))),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('AOT WIKI', style: AppFonts.scream(size: 22)),
                  const SizedBox(height: 4),
                  Text('Dedicated to Freedom',
                      style: AppFonts.body(size: 12, color: AppColors.stone500)),
                ],
              ),
            ),
            const SizedBox(height: 8),
            ...kNavItems.map((item) {
              final selected = item.route == currentRoute;
              return ListTile(
                leading: Icon(item.icon,
                    color: selected ? AppColors.red500 : AppColors.stone400, size: 20),
                title: Text(
                  item.label,
                  style: AppFonts.body(
                    size: 14,
                    color: selected ? AppColors.stone200 : AppColors.stone400,
                    weight: selected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
                selected: selected,
                selectedTileColor: AppColors.red900.withOpacity(0.15),
                onTap: () {
                  Navigator.pop(context);
                  if (!selected) {
                    Navigator.pushNamed(context, item.route);
                  }
                },
              );
            }),
          ],
        ),
      ),
    );
  }
}
