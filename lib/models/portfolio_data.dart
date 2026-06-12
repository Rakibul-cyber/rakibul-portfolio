class Project {
  final String title;
  final String subtitle;
  final String description;
  final List<String> tags;
  final String status;
  final String? githubUrl;
  final String? liveUrl;
  final String icon;

  const Project({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.tags,
    required this.status,
    this.githubUrl,
    this.liveUrl,
    required this.icon,
  });
}

class Skill {
  final String name;
  final String category;
  final int level; // 1-5
  final String icon;

  const Skill({
    required this.name,
    required this.category,
    required this.level,
    required this.icon,
  });
}

class HirePackage {
  final String name;
  final String price;
  final String period;
  final List<String> features;
  final bool isHighlighted;
  final String cta;

  const HirePackage({
    required this.name,
    required this.price,
    required this.period,
    required this.features,
    this.isHighlighted = false,
    required this.cta,
  });
}

class BlogPost {
  final String title;
  final String excerpt;
  final String date;
  final String readTime;
  final String tag;

  const BlogPost({
    required this.title,
    required this.excerpt,
    required this.date,
    required this.readTime,
    required this.tag,
  });
}

// ─── Portfolio Data ───────────────────────────────────────────────────────────

class PortfolioData {
  static const List<Project> projects = [
    Project(
      title: 'Forest Tracking & Environmental Safety System',
      subtitle: 'Production · Full-Stack + Cloud',
      description:
          'A scalable real-time environmental monitoring mobile application deployed on AWS. Integrates GPS, satellite data streams, and AI/ML pipelines to map live forest conditions and detect environmental anomalies.',
      tags: [
        'Flutter',
        'AWS EC2',
        'PostgreSQL',
        'Python',
        'AI/ML',
        'GPS/Satellite'
      ],
      status: 'Live',
      icon: '🌲',
    ),
    Project(
      title: 'Louco Event Media App',
      subtitle: 'Freelance · Flutter Mobile',
      description:
          'Cross-platform event media app built with Flutter. Implemented OAuth social auth flows (Google & Apple), SCRUM-based workflow, CI/CD integration, and production deployment for a Germany-based media company.',
      tags: [
        'Flutter',
        'OAuth',
        'Google Sign-In',
        'Apple Sign-In',
        'REST APIs',
        'SCRUM'
      ],
      status: 'Production',
      icon: '🎪',
    ),
    Project(
      title: 'XR-Hub Condominium Management System',
      subtitle: 'Flutter Web & Mobile',
      description:
          'Responsive cross-platform property management dashboard. Includes role-based access control, real-time occupancy analytics, task scheduling for maintenance, and automated billing & payment notifications.',
      tags: [
        'Flutter Web',
        'Flutter Mobile',
        'Node.js',
        'PostgreSQL',
        'Dashboard'
      ],
      status: 'Delivered',
      icon: '🏢',
    ),
    Project(
      title: 'STEKO Health Checker',
      subtitle: 'Final Year Project · mHealth',
      description:
          'Mobile health monitoring app tracking vital signs, health trends, and alerts. Published research: "STEKO-SD: A Mobile Health Solution to Assist Self-Checking of Metabolic Syndrome".',
      tags: ['Flutter', 'Node.js', 'Firebase', 'Health Tech', 'Research'],
      status: 'Published',
      icon: '❤️',
      githubUrl: 'https://github.com/Rakibul-cyber',
    ),
    Project(
      title: 'Automotive HMI Dashboard',
      subtitle: 'Android Automotive · Jetpack Compose',
      description:
          'EV Dashboard for Android Automotive OS with real-time WebSocket data (10 Hz integer streams), built with Jetpack Compose. Showcases HMI/cluster UI development skills for automotive grade systems.',
      tags: [
        'Android Automotive',
        'Jetpack Compose',
        'WebSocket',
        'Kotlin',
        'HMI'
      ],
      status: 'Demo',
      githubUrl: 'https://github.com/Rakibul-cyber/automotive-hmi-dashboard',
      icon: '🚗',
    ),
  ];

  static const List<Skill> skills = [
    // Mobile & Frontend
    Skill(name: 'Flutter', category: 'Mobile & Web', level: 5, icon: '💙'),
    Skill(name: 'Dart', category: 'Mobile & Web', level: 5, icon: '🎯'),
    Skill(name: 'Flutter Web', category: 'Mobile & Web', level: 4, icon: '🌐'),
    Skill(
        name: 'Android (Compose)',
        category: 'Mobile & Web',
        level: 3,
        icon: '🤖'),
    // Backend
    Skill(name: 'Python', category: 'Backend', level: 4, icon: '🐍'),
    Skill(name: 'Django', category: 'Backend', level: 3, icon: '🦄'),
    Skill(name: 'Node.js', category: 'Backend', level: 3, icon: '🟩'),
    Skill(name: 'REST APIs', category: 'Backend', level: 5, icon: '🔗'),
    // Cloud & DevOps
    Skill(
        name: 'AWS EC2/S3/IAM',
        category: 'Cloud & DevOps',
        level: 4,
        icon: '☁️'),
    Skill(name: 'Docker', category: 'Cloud & DevOps', level: 3, icon: '🐳'),
    Skill(
        name: 'CI/CD Pipelines',
        category: 'Cloud & DevOps',
        level: 3,
        icon: '⚙️'),
    Skill(
        name: 'Linux / CLI', category: 'Cloud & DevOps', level: 4, icon: '🐧'),
    Skill(
        name: 'Git / GitHub', category: 'Cloud & DevOps', level: 5, icon: '🐙'),
    // Data
    Skill(name: 'PostgreSQL', category: 'Data', level: 4, icon: '🗄️'),
    Skill(name: 'Firebase', category: 'Data', level: 3, icon: '🔥'),
    Skill(name: 'MySQL', category: 'Data', level: 3, icon: '🗃️'),
  ];

  static const List<HirePackage> packages = [
    HirePackage(
      name: 'Flutter Dev',
      price: '€45',
      period: '/hr',
      features: [
        'Flutter Mobile (iOS + Android)',
        'Flutter Web apps',
        'REST API integration',
        'UI/UX implementation',
        'App Store deployment',
        'Bug fixes & support',
      ],
      cta: 'Hire for Flutter',
    ),
    HirePackage(
      name: 'Full-Stack + Cloud',
      price: '€60',
      period: '/hr',
      features: [
        'Everything in Flutter Dev',
        'AWS setup & deployment',
        'Backend (Python/Django/Node)',
        'Docker & CI/CD pipelines',
        'Database design',
        'Architecture consulting',
      ],
      isHighlighted: true,
      cta: 'Hire Full-Stack',
    ),
    HirePackage(
      name: 'Part-Time Contract',
      price: '€3,200',
      period: '/mo',
      features: [
        '80 hrs/month dedicated',
        'SCRUM / Agile workflow',
        'Weekly progress reports',
        'Jira / Trello integration',
        'Direct communication',
        'Invoice + contract ready',
      ],
      cta: 'Start Contract',
    ),
  ];

  static const List<BlogPost> blogPosts = [
    BlogPost(
      title: 'Sending OAuth Server Auth Codes from Flutter to Your Backend',
      excerpt:
          'How to correctly configure serverClientId for Google Sign-In and pass the one-time server auth code securely — lessons from production.',
      date: 'Jun 2025',
      readTime: '6 min read',
      tag: 'Flutter',
    ),
    BlogPost(
      title: 'Flutter + AWS: Deploying a Production Mobile Backend',
      excerpt:
          'A practical guide to architecting a scalable Flutter app backend on AWS EC2, RDS, and S3 — from zero to production.',
      date: 'May 2025',
      readTime: '8 min read',
      tag: 'Cloud',
    ),
    BlogPost(
      title: 'Android Automotive OS: Building Your First HMI Dashboard',
      excerpt:
          'Getting started with Android Automotive OS using Jetpack Compose — creating cluster UI that works on real in-vehicle hardware.',
      date: 'Apr 2025',
      readTime: '5 min read',
      tag: 'Android',
    ),
    BlogPost(
      title: 'mHealth App Evaluation: What the Research Says',
      excerpt:
          'Insights from academic literature on mobile health app usability and EMG biofeedback — bridging research and real-world development.',
      date: 'Mar 2025',
      readTime: '7 min read',
      tag: 'Research',
    ),
  ];
}
