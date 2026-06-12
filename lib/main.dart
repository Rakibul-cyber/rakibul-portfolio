import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/portfolio_page.dart';

void main() {
  runApp(const PortfolioApp());
}

class PortfolioApp extends StatelessWidget {
  const PortfolioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Md. Rakibul Hassan — Flutter & DevOps Developer',
      theme: AppTheme.theme,
      debugShowCheckedModeBanner: false,
      home: const PortfolioPage(),
    );
  }
}
