import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../routes/app_router.dart';

/// Port of pages/404.jsx.
class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('404', style: AppFonts.scream(size: 56)),
            const SizedBox(height: 12),
            Text('This page was lost beyond the Walls.',
                style: AppFonts.body(color: AppColors.stone400)),
            const SizedBox(height: 24),
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.red700),
                foregroundColor: AppColors.stone200,
              ),
              onPressed: () =>
                  Navigator.pushNamedAndRemoveUntil(context, AppRoutes.home, (r) => false),
              child: const Text('Return to safety'),
            ),
          ],
        ),
      ),
    );
  }
}
