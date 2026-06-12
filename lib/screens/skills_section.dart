import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/portfolio_data.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

class SkillsSection extends StatelessWidget {
  const SkillsSection({super.key});

  static const List<(String, List<String>)> _certs = [
    (
      '📜 Certifications',
      [
        'Google Data Analytics',
        'Google AI Essentials',
        'Business Analytics with Excel'
      ]
    ),
    (
      '📚 Currently Learning',
      [
        'AWS Certified Cloud Practitioner (in prep)',
        'MSc High Integrity Systems — Frankfurt UAS',
        'Advanced DevOps Practices'
      ]
    ),
    (
      '🌍 Languages',
      ['Bengali — Native', 'English — Professional', 'German — Learning']
    ),
  ];

  Widget _certDivider() => Container(
        width: 1,
        height: 100,
        color: AppTheme.divider,
        margin: const EdgeInsets.symmetric(horizontal: 32),
      );

  @override
  Widget build(BuildContext context) {
    final categories = ['Mobile & Web', 'Backend', 'Cloud & DevOps', 'Data'];

    return ResponsivePadding(
      vertical: 100,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHeader(
            eyebrow: 'Technical Arsenal',
            title: 'Skills & Stack',
            subtitle:
                'From pixel-perfect Flutter UIs to AWS cloud infrastructure — full-cycle delivery.',
          ),
          const SizedBox(height: 64),
          ...categories.map((cat) {
            final catSkills =
                PortfolioData.skills.where((s) => s.category == cat).toList();
            return Padding(
              padding: const EdgeInsets.only(bottom: 48),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        cat.toUpperCase(),
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: cat == 'Cloud & DevOps'
                              ? AppTheme.amber
                              : AppTheme.cyan,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                          child: Container(height: 1, color: AppTheme.divider)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    children: catSkills
                        .map((skill) => _SkillCard(skill: skill))
                        .toList(),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 32),

          // Also learning / certifications
          GlassCard(
            hoverable: false,
            child: Responsive(
              desktop: (_) => Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: _certBlock(_certs[0].$1, _certs[0].$2)),
                  _certDivider(),
                  Expanded(child: _certBlock(_certs[1].$1, _certs[1].$2)),
                  _certDivider(),
                  Expanded(child: _certBlock(_certs[2].$1, _certs[2].$2)),
                ],
              ),
              mobile: (_) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _certBlock(_certs[0].$1, _certs[0].$2),
                  const SizedBox(height: 28),
                  _certBlock(_certs[1].$1, _certs[1].$2),
                  const SizedBox(height: 28),
                  _certBlock(_certs[2].$1, _certs[2].$2),
                ],
              ),
            ),
          ).animate().fadeIn(delay: 400.ms),
        ],
      ),
    );
  }

  Widget _certBlock(String title, List<String> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: GoogleFonts.spaceGrotesk(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary)),
        const SizedBox(height: 12),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('→ ',
                      style: TextStyle(color: AppTheme.cyan, fontSize: 13)),
                  Expanded(
                      child: Text(item,
                          style: const TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 13,
                              height: 1.5))),
                ],
              ),
            )),
      ],
    );
  }
}

class _SkillCard extends StatefulWidget {
  final Skill skill;

  const _SkillCard({required this.skill});

  @override
  State<_SkillCard> createState() => _SkillCardState();
}

class _SkillCardState extends State<_SkillCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.basic,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: _hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
          border: Border.all(
            color: _hovered
                ? AppTheme.cyan.withValues(alpha: 0.5)
                : AppTheme.divider,
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(widget.skill.icon, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.skill.name,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _hovered
                        ? AppTheme.textPrimary
                        : AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: List.generate(
                      5,
                      (i) => Container(
                            width: 18,
                            height: 3,
                            margin: const EdgeInsets.only(right: 3),
                            decoration: BoxDecoration(
                              color: i < widget.skill.level
                                  ? AppTheme.cyan
                                  : AppTheme.divider,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          )),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
