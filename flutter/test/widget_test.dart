import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:aotwiki_flutter/main.dart';

void main() {
  testWidgets('App boots and shows the home hero title', (WidgetTester tester) async {
    await tester.pumpWidget(const AotWikiApp());
    await tester.pump();
    expect(find.text('AOT WIKI'), findsOneWidget);
  });
}
