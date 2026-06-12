import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/portfolio_data.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

// ─── Blog Section ─────────────────────────────────────────────────────────────

class BlogSection extends StatelessWidget {
  const BlogSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF080D1A),
      child: ResponsivePadding(
        vertical: 100,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: SectionHeader(
                    eyebrow: 'Writing',
                    title: 'Blog & Articles',
                    subtitle:
                        'Sharing what I learn building production apps and cloud systems.',
                  ),
                ),
                CyanButton(label: 'All Posts →', onTap: () {}, small: true),
              ],
            ),
            const SizedBox(height: 64),
            ResponsiveGrid(
              mobileColumns: 1,
              desktopColumns: 2,
              childAspectRatio: ResponsiveLayout.isMobile(context) ? 2.8 : 2.2,
              itemCount: PortfolioData.blogPosts.length,
              itemBuilder: (context, index) =>
                  _BlogCard(post: PortfolioData.blogPosts[index])
                      .animate()
                      .fadeIn(delay: (200 + index * 100).ms),
            ),
          ],
        ),
      ),
    );
  }
}

class _BlogCard extends StatefulWidget {
  final BlogPost post;
  const _BlogCard({required this.post});

  @override
  State<_BlogCard> createState() => _BlogCardState();
}

class _BlogCardState extends State<_BlogCard> {
  bool _hovered = false;

  Color get _tagColor {
    switch (post.tag) {
      case 'Flutter':
        return AppTheme.cyan;
      case 'Cloud':
        return AppTheme.amber;
      case 'Android':
        return const Color(0xFF78C257);
      default:
        return const Color(0xFFB57BFF);
    }
  }

  BlogPost get post => widget.post;

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
            color:
                _hovered ? _tagColor.withValues(alpha: 0.4) : AppTheme.divider,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                TagChip(label: post.tag, color: _tagColor),
                const Spacer(),
                Text(post.readTime,
                    style: const TextStyle(
                        color: AppTheme.textSecondary, fontSize: 12)),
                const SizedBox(width: 12),
                Text(post.date,
                    style: const TextStyle(
                        color: AppTheme.textSecondary, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 14),
            Text(post.title,
                style: Theme.of(context).textTheme.titleLarge,
                maxLines: 2,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 8),
            Expanded(
              child: Text(post.excerpt,
                  style: Theme.of(context).textTheme.bodyMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis),
            ),
            const SizedBox(height: 12),
            Text(
              'Read more →',
              style: GoogleFonts.spaceGrotesk(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: _hovered ? _tagColor : AppTheme.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Contact Section ──────────────────────────────────────────────────────────

class ContactSection extends StatefulWidget {
  const ContactSection({super.key});

  @override
  State<ContactSection> createState() => _ContactSectionState();
}

class _ContactSectionState extends State<ContactSection> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _msgCtrl = TextEditingController();
  bool _sent = false;

  @override
  Widget build(BuildContext context) {
    return ResponsivePadding(
      vertical: 100,
      child: Responsive(
        desktop: (_) => Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(flex: 4, child: _info(context)),
            const SizedBox(width: 80),
            Expanded(
              flex: 5,
              child: _sent ? _successState() : _formState(context),
            ).animate().fadeIn(delay: 400.ms),
          ],
        ),
        mobile: (_) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _info(context),
            const SizedBox(height: 48),
            (_sent ? _successState() : _formState(context))
                .animate()
                .fadeIn(delay: 400.ms),
          ],
        ),
      ),
    );
  }

  Widget _info(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(
          eyebrow: 'Get In Touch',
          title: "Let's Build\nSomething.",
        ),
        const SizedBox(height: 32),
        Text(
          "Have a project in mind? Looking for a Flutter dev or DevOps engineer? Reach out — I respond within 24 hours.",
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 48),
        _contactLink('📧', 'hassanrakibul029@gmail.com'),
        const SizedBox(height: 16),
        _contactLink('📞', '+49 1521 4837797'),
        const SizedBox(height: 16),
        _contactLink('📍', 'Frankfurt am Main, Germany'),
        const SizedBox(height: 40),
        Row(
          children: [
            _socialBtn('GitHub', 'https://github.com/Rakibul-cyber'),
            const SizedBox(width: 12),
            _socialBtn(
                'LinkedIn', 'https://www.linkedin.com/in/rakibulhassan-dev/'),
          ],
        ),
      ],
    ).animate().fadeIn(delay: 200.ms);
  }

  Widget _formState(BuildContext context) {
    return GlassCard(
      hoverable: false,
      padding: const EdgeInsets.all(40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Send a Message',
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontSize: 22)),
          const SizedBox(height: 32),
          _field('Your Name', _nameCtrl, false),
          const SizedBox(height: 20),
          _field('Email Address', _emailCtrl, false),
          const SizedBox(height: 20),
          _field('Message', _msgCtrl, true),
          const SizedBox(height: 28),
          SizedBox(
            width: double.infinity,
            child: CyanButton(
              label: 'Send Message →',
              onTap: () => setState(() => _sent = true),
            ),
          ),
        ],
      ),
    );
  }

  Widget _successState() {
    return GlassCard(
      hoverable: false,
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('✅', style: TextStyle(fontSize: 48)),
          const SizedBox(height: 20),
          Text("Message sent!",
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontSize: 22)),
          const SizedBox(height: 12),
          const Text("I'll get back to you within 24 hours.",
              style: TextStyle(color: AppTheme.textSecondary)),
        ],
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl, bool multiline) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: GoogleFonts.spaceGrotesk(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppTheme.textSecondary)),
        const SizedBox(height: 8),
        TextField(
          controller: ctrl,
          maxLines: multiline ? 5 : 1,
          style: GoogleFonts.inter(fontSize: 14, color: AppTheme.textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppTheme.bgDeep,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppTheme.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppTheme.divider),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppTheme.cyan, width: 1.5),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ],
    );
  }

  Widget _contactLink(String icon, String text) {
    return Row(
      children: [
        Text(icon, style: const TextStyle(fontSize: 18)),
        const SizedBox(width: 12),
        Text(text,
            style:
                const TextStyle(color: AppTheme.textSecondary, fontSize: 15)),
      ],
    );
  }

  Widget _socialBtn(String label, String url) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          border: Border.all(color: AppTheme.divider),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(label,
            style: GoogleFonts.spaceGrotesk(
                fontSize: 13, color: AppTheme.textSecondary)),
      ),
    );
  }
}

// ─── Footer ───────────────────────────────────────────────────────────────────

class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    final logo = RichText(
      text: TextSpan(children: [
        TextSpan(
            text: 'RH',
            style: GoogleFonts.spaceGrotesk(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.cyan)),
        TextSpan(
            text: '.dev',
            style: GoogleFonts.spaceGrotesk(
                fontSize: 16, color: AppTheme.textSecondary)),
      ]),
    );
    const copyright = Text(
      '© 2025 Md. Rakibul Hassan · Frankfurt am Main, Germany',
      style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
    );
    final builtWith = Text(
      'Built with Flutter 💙',
      style:
          GoogleFonts.spaceGrotesk(fontSize: 13, color: AppTheme.textSecondary),
    );

    return Container(
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: AppTheme.divider)),
      ),
      child: ResponsivePadding(
        vertical: 32,
        child: Responsive(
          desktop: (_) => Row(
            children: [
              logo,
              const Spacer(),
              copyright,
              const Spacer(),
              builtWith,
            ],
          ),
          mobile: (_) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              logo,
              const SizedBox(height: 16),
              copyright,
              const SizedBox(height: 8),
              builtWith,
            ],
          ),
        ),
      ),
    );
  }
}
