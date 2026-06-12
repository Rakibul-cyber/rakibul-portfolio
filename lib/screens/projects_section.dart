import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/portfolio_data.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

class ProjectsSection extends StatelessWidget {
  const ProjectsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF080D1A),
      child: ResponsivePadding(
        vertical: 100,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SectionHeader(
              eyebrow: 'Portfolio',
              title: 'Featured Work',
              subtitle:
                  'Production apps, research projects, and open-source experiments.',
            ),
            const SizedBox(height: 64),

            // Featured project (first)
            _FeaturedProjectCard(project: PortfolioData.projects[0])
                .animate()
                .fadeIn(delay: 200.ms)
                .slideY(begin: 0.1, end: 0),

            const SizedBox(height: 28),

            // Grid of remaining projects
            ResponsiveGrid(
              mobileColumns: 1,
              desktopColumns: 2,
              childAspectRatio: ResponsiveLayout.isMobile(context) ? 1.5 : 1.4,
              itemCount: PortfolioData.projects.length - 1,
              itemBuilder: (context, index) => _ProjectCard(
                project: PortfolioData.projects[index + 1],
              ).animate().fadeIn(delay: (300 + index * 100).ms),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeaturedProjectCard extends StatefulWidget {
  final Project project;
  const _FeaturedProjectCard({required this.project});

  @override
  State<_FeaturedProjectCard> createState() => _FeaturedProjectCardState();
}

class _FeaturedProjectCardState extends State<_FeaturedProjectCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: _hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
          border: Border.all(
            color: _hovered
                ? AppTheme.cyan.withValues(alpha: 0.4)
                : AppTheme.divider,
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: _hovered
              ? [
                  BoxShadow(
                      color: AppTheme.cyan.withValues(alpha: 0.06),
                      blurRadius: 40)
                ]
              : [],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: AppTheme.cyan.withValues(alpha: 0.08),
                border: Border.all(color: AppTheme.cyan.withValues(alpha: 0.2)),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(widget.project.icon,
                    style: const TextStyle(fontSize: 32)),
              ),
            ),
            const SizedBox(width: 32),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.amber.withValues(alpha: 0.1),
                          border: Border.all(
                              color: AppTheme.amber.withValues(alpha: 0.3)),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'FEATURED',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.amber,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      StatusBadge(status: widget.project.status),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(widget.project.title,
                      style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 6),
                  Text(widget.project.subtitle,
                      style:
                          const TextStyle(color: AppTheme.cyan, fontSize: 14)),
                  const SizedBox(height: 16),
                  Text(widget.project.description,
                      style: Theme.of(context).textTheme.bodyLarge),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.project.tags
                        .map((t) => TagChip(label: t))
                        .toList(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProjectCard extends StatefulWidget {
  final Project project;
  const _ProjectCard({required this.project});

  @override
  State<_ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<_ProjectCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          color: _hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
          border: Border.all(
            color: _hovered
                ? AppTheme.cyan.withValues(alpha: 0.35)
                : AppTheme.divider,
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: _hovered
              ? [
                  BoxShadow(
                      color: AppTheme.cyan.withValues(alpha: 0.05),
                      blurRadius: 24)
                ]
              : [],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(widget.project.icon, style: const TextStyle(fontSize: 24)),
                const Spacer(),
                StatusBadge(status: widget.project.status),
              ],
            ),
            const SizedBox(height: 16),
            Text(widget.project.title,
                style: Theme.of(context).textTheme.titleLarge,
                maxLines: 2,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text(widget.project.subtitle,
                style: const TextStyle(color: AppTheme.cyan, fontSize: 12)),
            const SizedBox(height: 10),
            Expanded(
              child: Text(
                widget.project.description,
                style: Theme.of(context).textTheme.bodyMedium,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: widget.project.tags
                  .take(4)
                  .map((t) => TagChip(label: t))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}
