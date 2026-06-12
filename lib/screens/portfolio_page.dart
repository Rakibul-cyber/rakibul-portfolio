import 'package:flutter/material.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';
import 'hero_section.dart';
import 'skills_section.dart';
import 'projects_section.dart';
import 'hire_section.dart';
import 'blog_contact_section.dart';

class PortfolioPage extends StatefulWidget {
  const PortfolioPage({super.key});

  @override
  State<PortfolioPage> createState() => _PortfolioPageState();
}

class _PortfolioPageState extends State<PortfolioPage> {
  final _scrollController = ScrollController();

  // Section keys for nav scroll
  final _heroKey = GlobalKey();
  final _skillsKey = GlobalKey();
  final _projectsKey = GlobalKey();
  final _hireKey = GlobalKey();
  final _blogKey = GlobalKey();
  final _contactKey = GlobalKey();

  late final List<GlobalKey> _sectionKeys;

  @override
  void initState() {
    super.initState();
    _sectionKeys = [
      _heroKey,
      _skillsKey,
      _projectsKey,
      _hireKey,
      _blogKey,
      _contactKey
    ];
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToSection(GlobalKey key) {
    final ctx = key.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx,
          duration: const Duration(milliseconds: 700), curve: Curves.easeInOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Subtle grid background
          Positioned.fill(child: CustomPaint(painter: _GridPainter())),

          // Glow blobs
          const Positioned(
              top: -200,
              left: -200,
              child: _GlowBlob(color: Color(0xFF00D4FF), size: 600)),
          const Positioned(
              top: 600,
              right: -200,
              child: _GlowBlob(color: Color(0xFFFFB347), size: 400)),

          // Main content
          SingleChildScrollView(
            controller: _scrollController,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Hero
                Container(
                    key: _heroKey,
                    child: HeroSection(
                      onHireMe: () => _scrollToSection(_hireKey),
                      onViewWork: () => _scrollToSection(_projectsKey),
                    )),

                // About blurb
                _AboutSection(),

                // Skills
                Container(key: _skillsKey, child: const SkillsSection()),

                // Projects
                Container(key: _projectsKey, child: const ProjectsSection()),

                // Hire Me
                Container(key: _hireKey, child: const HireMeSection()),

                // Blog
                Container(key: _blogKey, child: const BlogSection()),

                // Contact
                Container(key: _contactKey, child: const ContactSection()),

                // Footer
                const FooterSection(),
              ],
            ),
          ),

          // Sticky Nav
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: PortfolioNav(
              scrollController: _scrollController,
              sectionKeys: _sectionKeys,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── About blurb ─────────────────────────────────────────────────────────────

class _AboutSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF080D1A),
      child: ResponsivePadding(
        vertical: 80,
        child: Responsive(
          desktop: (_) => Row(
            children: [
              Expanded(child: _bio(context)),
              const SizedBox(width: 80),
              Expanded(child: _timeline()),
            ],
          ),
          mobile: (_) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _bio(context),
              const SizedBox(height: 48),
              _timeline(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _bio(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(eyebrow: 'About Me', title: 'Who I Am'),
        const SizedBox(height: 24),
        Text(
          "I'm a Flutter developer and aspiring DevOps engineer currently completing my MSc in High Integrity Systems at Frankfurt University of Applied Sciences. I build cross-platform mobile and web apps with Flutter, design scalable cloud backends on AWS, and wire them together with CI/CD pipelines.",
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 16),
        Text(
          "Previously at Johannes Gutenberg University Mainz (HiWi), where I shipped a production environmental monitoring app integrating AI, GPS, satellite data, and AWS cloud. Freelanced for companies in Malaysia and Germany.",
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 16),
        Text(
          "Outside code: I'm a Bengali literature enthusiast, published researcher in mobile health, and someone who genuinely enjoys working through hard architectural problems.",
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      ],
    );
  }

  Widget _timeline() {
    return Column(
      children: [
        _timelineItem('2025 – Present', 'HiWi · JGU Mainz',
            'Flutter + AWS, Environmental Monitoring App'),
        _timelineItem('2025 – Present', 'Freelance · Louco GmbH',
            'Flutter Developer · Frankfurt, Germany'),
        _timelineItem('2023', 'Flutter Dev · Teczo Sdn. Bhd.',
            'XR-Hub Condominium System · Kuala Lumpur'),
        _timelineItem('2023', 'BSc Computer Science',
            'IIUM Malaysia — Software Engineering'),
      ],
    );
  }

  Widget _timelineItem(String date, String title, String sub) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: const BoxDecoration(
                  color: Color(0xFF00D4FF),
                  shape: BoxShape.circle,
                ),
              ),
              Container(width: 1, height: 40, color: const Color(0xFF1E2D45)),
            ],
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(date,
                    style: const TextStyle(
                        color: Color(0xFF00D4FF),
                        fontSize: 12,
                        fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(title,
                    style: const TextStyle(
                        color: Color(0xFFE8EDF5),
                        fontSize: 15,
                        fontWeight: FontWeight.w600)),
                Text(sub,
                    style: const TextStyle(
                        color: Color(0xFF8B9DC3), fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Background painters ──────────────────────────────────────────────────────

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1E2D45).withValues(alpha: 0.25)
      ..strokeWidth = 0.5;

    const spacing = 60.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_GridPainter _) => false;
}

class _GlowBlob extends StatelessWidget {
  final Color color;
  final double size;

  const _GlowBlob({required this.color, required this.size});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [color.withValues(alpha: 0.08), Colors.transparent],
          ),
        ),
      ),
    );
  }
}
