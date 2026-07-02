export interface ServiceCardPreset {
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  display_order: number;
}

export interface GalleryItemPreset {
  image_url: string;
  image_alt: string;
  display_order: number;
  category: string;
}

export interface TeamCardPreset {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  display_order: number;
  image_zoom?: number;
  image_x?: number;
  image_y?: number;
  image_blur?: number;
}

export interface ProductItemPreset {
  slug: string;
  name: string;
  description: string;
  features_json: string | null;
  color: string;
  logo_url: string | null;
  status?: string;
  display_order: number;
  external_url?: string | null;
  checkout_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface ArticlePostPreset {
  title: string;
  content: string; // JSON string of Paragraphs
  image_url: string;
  image_alt: string;
  author: string;
  published_date: string;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  primary_color: string;
  secondary_color: string;
  
  // Brand settings
  site_name: string;
  site_slogan: string;
  site_logo_url: string;
  footer_phone: string;
  footer_email: string;
  footer_website: string;
  footer_twitter: string;
  footer_linkedin: string;
  footer_disclaimer_title: string;
  footer_disclaimer_text: string;
  
  // Hero settings
  hero_title: string;
  hero_content: string;
  hero_show_contact_us: number;
  hero_background_type: string;
  hero_background_url: string;
  
  // Services
  services_title: string;
  services_cards: ServiceCardPreset[];
  
  // Gallery
  gallery_items: GalleryItemPreset[];
  
  // Team
  team_cards: TeamCardPreset[];
  
  // Products
  products_title: string;
  products_description: string;
  products_items: ProductItemPreset[];
  
  // Articles
  article_posts: ArticlePostPreset[];
  
  // SEO
  global_title: string;
  global_description: string;
  og_image_url: string;

  // Quote
  quote_title: string;
  quote_subtitle: string;
}

export const TEMPLATE_PRESETS: Record<string, TemplatePreset> = {
  energy_tech: {
    id: 'energy_tech',
    name: 'Oil & Gas / Energy Tech',
    description: 'The default industrial setup for energy companies, oilfield services, and technical engineering firms.',
    primary_color: '#d97706', // amber
    secondary_color: '#4b5563', // gray
    site_name: 'Alfazen Inc.',
    site_slogan: 'Stay Zen at First Place',
    site_logo_url: '/images/products/resologix-logo.png',
    footer_phone: '+1 (403) 555-0123',
    footer_email: 'info@alfazen.org',
    footer_website: 'https://alfazen.org',
    footer_twitter: 'https://x.com/alfazeninc',
    footer_linkedin: 'https://linkedin.com/company/alfazeninc',
    footer_disclaimer_title: 'Disclaimer & Professional Statement',
    footer_disclaimer_text: 'Alfazen Inc. provides general technical resources, consulting, and AI services. Our materials and code are presented "as is" and do not constitute specific engineering advice or oilfield certifications.',
    quote_title: 'Empowering Oil & Gas with AI',
    quote_subtitle: 'Discover our expertise now!',
    hero_title: 'Global AI Solutions for Oil & Gas',
    hero_content: 'With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry. Based in Calgary, AB, we deliver innovative solutions that optimize operations and drive industry progress. Partner with us to harness the power of AI for your energy needs.',
    hero_show_contact_us: 1,
    hero_background_type: 'image',
    hero_background_url: '/images/hero/hero_bg.jpg',
    services_title: 'Alfazen Inc. Data Science Services for Oil & Gas',
    services_cards: [
      {
        title: 'AI-Driven Reservoir Analysis',
        description: 'Utilize advanced AI models to optimize reservoir characterization and enhance extraction efficiency, minimizing operational risks.',
        image_url: 'https://images.unsplash.com/photo-1691505748956-2d02b6603e84?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw0fHxvaWwlMjByZXNlcnZvaXJ8ZW58MHwwfHx8MTc2MzQwMTc2N3ww&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
        image_alt: 'a large field with a water tower in the middle of it',
        display_order: 1
      },
      {
        title: 'Predictive Maintenance Solutions',
        description: 'Implement machine learning algorithms to predict equipment failures and schedule proactive maintenance, reducing downtime.',
        image_url: 'https://images.unsplash.com/photo-1701383838063-ceb050928f24?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxvaWwlMjByaWclMjBtYWludGVuYW5jZXxlbnwwfDB8fHwxNzYzMzE5MDMyfDA&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
        image_alt: 'an old rusted out truck with a number on it',
        display_order: 2
      },
      {
        title: 'Custom AI Solutions Development',
        description: 'Design and implement tailored AI applications addressing specific challenges faced by oil and gas companies worldwide.',
        image_url: 'https://images.unsplash.com/photo-1721314787850-5745fdfb06b4?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8MHx8fDE3NjMzNzMwNzh8MA&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
        image_alt: 'AI chip background',
        display_order: 3
      }
    ],
    gallery_items: [
      {
        image_url: 'https://images.unsplash.com/photo-1695060601967-7fb135446f67?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwxMXx8b2lsJTIwYW5kJTIwZ2FzJTIwaW5kdXN0cnklMjBkYXRhJTIwc2NpZW5jZSUyMEFJfGVufDB8MHx8fDE3NjM0MDE3NjF8MA&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
        image_alt: 'A group of oil pumps sitting next to each other',
        display_order: 1,
        category: 'oil-pumps'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1729201754182-536252085563?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw2fHxvaWwlMjBhbmYlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
        image_alt: 'A black and white photo of an oil pump',
        display_order: 2,
        category: 'oil-pumps'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
        image_alt: 'Machine Learning code',
        display_order: 3,
        category: 'ai-power'
      }
    ],
    team_cards: [
      {
        name: 'Marcus Zou',
        role: 'Commercialisation Officer',
        bio: 'Marcus Zou, Senior Data Specialist and Commercialization Officer, Microsoft certified Cloud Engineer, brings 20 years of expertise in AI and machine learning applied to geoscience, reservoir modeling and predictive maintenance in the oil and gas sector.',
        image_url: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/6579892a-1466-44d5-a9b8-e34587dd8543_1040x1040.webp',
        display_order: 1,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      },
      {
        name: 'Edward Zou',
        role: 'Business Portfolio Manager',
        bio: 'Edward Zou, Software Architect and Business Portfolio Manager, Microsoft Certified Cloud Developer, specializes in orchestrating software architecture, building scalable data solutions and integrating complex data for advanced analytics and operational optimization.',
        image_url: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/c9974234-a8b3-4d4d-ad52-138e1f64cd04_1040x1040.webp',
        display_order: 2,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      }
    ],
    products_title: 'Our Products',
    products_description: 'Discover the comprehensive suite of AI-driven solutions from Alfazen Inc., designed specifically to tackle the unique challenges of the oil and gas industry.',
    products_items: [
      {
        slug: 'resologix',
        name: 'ResoLogix',
        description: 'A premium, full-range Resource Evaluation and Analytics Platform for Petroleum Resources. Engineered for E&P companies to handle the lifecycle of petroleum resources from early discovery to active production.',
        features_json: JSON.stringify([
          'Monte Carlo Engine with up to 50k iterations',
          'Decline Curve Analysis (DCA) for unconventional reservoirs',
          'Deterministic Economics for on-the-fly NPV & IRR',
          'Reporting Suite with PDF, Excel, and PowerPoint exports'
        ]),
        color: '#d97706',
        logo_url: '/images/products/resologix-logo.png',
        status: 'Officially released',
        display_order: 1
      },
      {
        slug: 'elogant',
        name: 'Elogant',
        description: 'Intelligent well logging and data interpretation. Streamline operations with automated insights and highly accurate predictions.',
        features_json: JSON.stringify(['AI Log Calibration', 'Lithology Prediction', 'Multi-Well Correlation']),
        color: '#4b5563',
        logo_url: '/images/products/elogant-logo.png',
        status: 'Officially released',
        display_order: 2
      }
    ],
    article_posts: [
      {
        title: 'Alfazen Inc.: Pioneering Data Science Solutions in the Oil and Gas Industry',
        content: JSON.stringify([
          {
            heading: 'Expertise Rooted in Experience and Innovation',
            text: 'Alfazen Inc., headquartered in Calgary, AB, brings over 20 years of unparalleled expertise in data science tailored specifically for the oil and gas sector. With a presence across multiple continents, our team combines deep industry knowledge with cutting-edge AI technologies to address the complex challenges faced by energy companies today.'
          }
        ]),
        image_url: 'https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxEYXRhJTIwU2NpZW5jZSUyQyUyME9pbCUyMGFuZCUyMEdhcyUyMEluZHVzdHJ5JTJDJTIwQXJ0aWZpY2lhbCUyMEludGVsbGlnZW5jZSUyQyUyMENhbGdhcnl8ZW58MHwwfHx8MTc2MzQwMTc2OHww&ixlib=rb-4.1.0&w=1000&q=80&auto=format&fit=crop',
        image_alt: 'a sunset in the background with oil industry elements',
        author: 'Marcus Zou',
        published_date: '2026-06-12',
        display_order: 1
      }
    ],
    global_title: 'Global AI Solutions for Oil & Gas - Alfazen Inc.',
    global_description: 'With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry.',
    og_image_url: '/images/hero/hero_bg.jpg'
  },
  
  consulting: {
    id: 'consulting',
    name: 'Professional Services & Consulting',
    description: 'Perfect for financial advisors, business consultancy firms, wealth managers, and tax advisory groups.',
    primary_color: '#1e3a8a', // dark blue
    secondary_color: '#b91c1c', // dark red
    site_name: 'Summit Advisory Group',
    site_slogan: 'Financial Intelligence, Strategic Growth',
    site_logo_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=80&q=80',
    footer_phone: '+1 (800) 555-9876',
    footer_email: 'contact@summitadvisory.com',
    footer_website: 'https://summitadvisory.com',
    footer_twitter: 'https://x.com/summitadvisory',
    footer_linkedin: 'https://linkedin.com/company/summitadvisory',
    footer_disclaimer_title: 'Advisory Disclaimer',
    footer_disclaimer_text: 'Summit Advisory Group is a registered financial consulting practice. Past performance is not indicative of future market results. All consultation outcomes depend on industry fluctuations and client portfolio risk tolerance.',
    quote_title: 'Empowering Businesses with Strategic Financial Insight',
    quote_subtitle: 'Achieve growth with precision advisory.',
    hero_title: 'Strategic Advisory & Financial Consultation',
    hero_content: 'At Summit Advisory Group, we help enterprise and mid-market firms navigate complex corporate transactions, optimize wealth management strategies, and implement robust tax compliance structures. Backed by decades of combined analytical experience, we deliver tailored insights that secure your assets and accelerate business growth.',
    hero_show_contact_us: 1,
    hero_background_type: 'image',
    hero_background_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    services_title: 'Our Consulting & Valuation Expertise',
    services_cards: [
      {
        title: 'Strategic Financial Consulting',
        description: 'Navigate debt restructuring, capital allocation, and risk management strategies with guidance from senior financial engineers.',
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Financial strategic discussion around laptop',
        display_order: 1
      },
      {
        title: 'Tax & Regulatory Compliance',
        description: 'Minimize liabilities and align your global business structure with evolving international tax laws and regulatory reporting protocols.',
        image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Calculator, tax forms and financial sheets',
        display_order: 2
      },
      {
        title: 'Mergers & Acquisitions',
        description: 'Execute buy-side and sell-side transactions with comprehensive target scouting, due diligence, and deal structure optimization.',
        image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Two professionals shaking hands in business suit',
        display_order: 3
      }
    ],
    gallery_items: [
      {
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Business metrics analysis and reports',
        display_order: 1,
        category: 'advisory'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Modern corporate meeting boardroom',
        display_order: 2,
        category: 'corporate'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Executive briefing session',
        display_order: 3,
        category: 'advisory'
      }
    ],
    team_cards: [
      {
        name: 'Sarah Jenkins',
        role: 'Senior Managing Partner',
        bio: 'Sarah has over 22 years of investment banking and strategic restructuring experience. She leads the corporate transactions advisory division at Summit.',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        display_order: 1,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      },
      {
        name: 'David Chen',
        role: 'Director of Valuations',
        bio: 'David specializes in machine-learning business valuation modeling and asset auditing. He previously managed risk compliance for top tier banks.',
        image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
        display_order: 2,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      }
    ],
    products_title: 'Advisory Products & Calculators',
    products_description: 'Access our custom proprietary valuation models and tax estimators to stay ahead of market dynamics.',
    products_items: [
      {
        slug: 'growthvaluator',
        name: 'GrowthValuator',
        description: 'An interactive enterprise valuation tool utilizing discounted cash flow (DCF) and multiple comparisons to estimate business valuation.',
        features_json: JSON.stringify(['DCF Valuation modeling', 'Industry multiple comparables', 'Sensitivity matrix tables']),
        color: '#1e3a8a',
        logo_url: null,
        status: 'Officially released',
        display_order: 1
      },
      {
        slug: 'taxforecaster',
        name: 'TaxForecaster',
        description: 'Project corporate tax liabilities across multiple jurisdictions automatically as regulations shift.',
        features_json: JSON.stringify(['Federal & State tax brackets', 'Credits optimization audit', 'Automated filing prep exports']),
        color: '#b91c1c',
        logo_url: null,
        status: 'Officially released',
        display_order: 2
      }
    ],
    article_posts: [
      {
        title: 'Maximizing Enterprise Value in High-Rate Environments',
        content: JSON.stringify([
          {
            heading: 'Understanding Capital Structure Shifts',
            text: 'As central banks maintain elevated interest rates, debt financing grows expensive. Corporations must re-examine their capital structures, prioritizing free cash flow and self-sustained capital allocations to prevent credit rating downgrades.'
          }
        ]),
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
        image_alt: 'Analysis charts showing growth curves',
        author: 'Sarah Jenkins',
        published_date: '2026-06-28',
        display_order: 1
      }
    ],
    global_title: 'Corporate Financial Advisory & Consulting - Summit Advisory',
    global_description: 'Summit Advisory Group offers custom corporate restructuring, due diligence, and capital strategies for growth companies.',
    og_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
  },
  
  saas_startup: {
    id: 'saas_startup',
    name: 'Software / SaaS Startup',
    description: 'Designed for software vendors, developer tools, fintech applications, and cloud tech startups.',
    primary_color: '#7c3aed', // purple
    secondary_color: '#0d9488', // teal
    site_name: 'SaaSify Core',
    site_slogan: 'The Next-Gen Operations Engine',
    site_logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
    footer_phone: '+1 (888) SaaS-SYNC',
    footer_email: 'hello@saasifycore.io',
    footer_website: 'https://saasifycore.io',
    footer_twitter: 'https://x.com/saasifycore',
    footer_linkedin: 'https://linkedin.com/company/saasifycore',
    footer_disclaimer_title: 'Terms of Use & API Statement',
    footer_disclaimer_text: 'SaaSify Core services and APIs are hosted on AWS secure clusters with 99.9% uptime commitments. All integrations depend on external platform endpoints and API keys provided by the client.',
    quote_title: 'Orchestrate Your Workflows. Scaled to Success.',
    quote_subtitle: 'Say goodbye to custom scripting integrations.',
    hero_title: 'Automate Your Workflows with SaaSify Core',
    hero_content: 'Stop wasting engineering hours on repetitive tasks. SaaSify Core is the ultimate workflow coordinator for remote product teams. Integrate all your SaaS databases, build custom logic hooks without writing code, and orchestrate server functions seamlessly. Join over 10,000 developer teams building the future with our engine.',
    hero_show_contact_us: 1,
    hero_background_type: 'image',
    hero_background_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
    services_title: 'Engineered for Performance & Scalability',
    services_cards: [
      {
        title: 'Workflow Automation',
        description: 'Set custom triggers and actions using our visual builder. Auto-assign tasks and sync statuses across systems instantly.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Microprocessor circuitry illustrating technology routing',
        display_order: 1
      },
      {
        title: 'Enterprise Integrations',
        description: 'Connect Slack, GitHub, HubSpot, Salesforce, and custom SQL/NoSQL databases with absolute ease.',
        image_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
        image_alt: 'System architecture graph nodes',
        display_order: 2
      },
      {
        title: 'Advanced Analytics',
        description: 'Understand usage anomalies, system response latencies, and transaction volumes with live dashboard graphs.',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Statistical line charts on a screen',
        display_order: 3
      }
    ],
    gallery_items: [
      {
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'SaaS cloud platform nodes',
        display_order: 1,
        category: 'dashboard'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Developer writing TypeScript application code',
        display_order: 2,
        category: 'tech-stack'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Startup development team discussing progress',
        display_order: 3,
        category: 'team'
      }
    ],
    team_cards: [
      {
        name: 'Elena Rostova',
        role: 'Co-founder & CTO',
        bio: 'Elena is a former principal systems architect at Netflix and author of "Reactive Scale". She coordinates all things engine performance and infrastructure.',
        image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        display_order: 1,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      },
      {
        name: 'Liam Gallagher',
        role: 'Lead Developer',
        bio: 'Liam is a full-stack engineer passionate about user experience and reactive UI state machines. He leads our frontend and integration modules.',
        image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        display_order: 2,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      }
    ],
    products_title: 'Explore Our Suite',
    products_description: 'Choose the right modules to scale your workflow management system as your customer base expands.',
    products_items: [
      {
        slug: 'saasify-tasks',
        name: 'SaaSify Tasks',
        description: 'Automate task progression pipelines and track project completion rates using intelligent sprint forecasting.',
        features_json: JSON.stringify(['Sprint Burndown Prediction', 'GitHub Pull Request links', 'Automated Slack pings']),
        color: '#7c3aed',
        logo_url: null,
        status: 'Officially released',
        display_order: 1
      },
      {
        slug: 'saasify-sync',
        name: 'SaaSify Sync',
        description: 'Multi-directional syncing that matches databases and applications in near zero latency with custom query filters.',
        features_json: JSON.stringify(['Zero-latency sync hooks', 'Custom JSON payloads', 'Fail-safe transaction rollback']),
        color: '#0d9488',
        logo_url: null,
        status: 'Officially released',
        display_order: 2
      }
    ],
    article_posts: [
      {
        title: 'How Remote Teams Save 15 Hours Weekly Using Automation Rules',
        content: JSON.stringify([
          {
            heading: 'The Cost of Context Switching',
            text: 'Context switching is the single biggest productivity killer in modern tech teams. Transitioning between issue trackers, instant messengers, and code repositories consumes energy and time. By introducing strict workflow triggers, engineers spend less time updating statuses and more time developing core software products.'
          }
        ]),
        image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1000&q=80',
        image_alt: 'Laptop on a clean desk displaying telemetry software',
        author: 'Elena Rostova',
        published_date: '2026-07-01',
        display_order: 1
      }
    ],
    global_title: 'SaaSify Core - Workflow Automation & Developer Tool',
    global_description: 'SaaSify Core provides next-gen workflow integrations, server hooks, and metrics tracking for tech teams.',
    og_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80'
  },
  
  industrial_logistics: {
    id: 'industrial_logistics',
    name: 'Specialty Industrial & Logistics',
    description: 'Perfect for freight companies, logistics coordinators, construction firms, and solar power installers.',
    primary_color: '#059669', // forest green
    secondary_color: '#d97706', // amber/gold
    site_name: 'Apex Logistics & Energy',
    site_slogan: 'Precision Logistics & Renewable Solutions',
    site_logo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=80&q=80',
    footer_phone: '+1 (800) APEX-RIG',
    footer_email: 'operations@apexlogistics.net',
    footer_website: 'https://apexlogistics.net',
    footer_twitter: 'https://x.com/apexlogistics',
    footer_linkedin: 'https://linkedin.com/company/apexlogistics',
    footer_disclaimer_title: 'Licensing & Compliance Statement',
    footer_disclaimer_text: 'Apex Logistics & Energy operates under FMCSA heavy transport certifications. Solar installations are executed by local certified electricians in compliance with local utility regulations and structural codes.',
    quote_title: 'Reliability Engineered for Heavy Industries',
    quote_subtitle: 'From transport coordination to green microgrids.',
    hero_title: 'Powering Supply Chains & Clean Infrastructure',
    hero_content: 'Apex Logistics & Energy handles the heavy lifting of industrial project planning. From hauling massive wind turbine gears across transcontinental routes to engineering self-sustaining solar microgrids for remote operations, we supply the logistical strength and clean energy backups your business requires.',
    hero_show_contact_us: 1,
    hero_background_type: 'image',
    hero_background_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    services_title: 'Heavy Operations & Renewable Grid Engineering',
    services_cards: [
      {
        title: 'Heavy Cargo & Specialized Transport',
        description: 'Transport oversized components, energy equipment, and building raw materials safely with specialized flatbeds and pilot cars.',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Yellow industrial cargo semi-truck loader',
        display_order: 1
      },
      {
        title: 'Solar Microgrid Installation',
        description: 'Design and deploy industrial-scale solar grids and storage systems, reducing fuel expenses for off-grid operations.',
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Technician adjusting large blue solar panels',
        display_order: 2
      },
      {
        title: 'Supply Chain Optimization',
        description: 'Streamline warehouse distribution patterns, reduce inventory transit times, and trace components in real-time.',
        image_url: 'https://images.unsplash.com/photo-1519491050280-69278749842d?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Forklift driver arranging cargo boxes inside warehouse',
        display_order: 3
      }
    ],
    gallery_items: [
      {
        image_url: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Cargo ship docked under harbor cranes',
        display_order: 1,
        category: 'shipping'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Vast field of commercial solar panels',
        display_order: 2,
        category: 'solar'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Heavy transport and industrial warehouse logistics',
        display_order: 3,
        category: 'shipping'
      }
    ],
    team_cards: [
      {
        name: 'Robert Vance',
        role: 'Operations Director',
        bio: 'Robert has spent 25 years overseeing interstate transport logistics and port shipping contracts. He leads our heavy freight coordinators.',
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        display_order: 1,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      },
      {
        name: 'Maria Santos',
        role: 'Lead Energy Architect',
        bio: 'Maria specializes in high-voltage microgrid layouts and structural load planning. She designs all off-grid backup layouts for our clients.',
        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        display_order: 2,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      }
    ],
    products_title: 'Equipment & Software Tools',
    products_description: 'Utilize our fleet dispatch programs and solar calculators to audit your operational efficiencies.',
    products_items: [
      {
        slug: 'apexroute',
        name: 'ApexRoute',
        description: 'An AI routing system that maps heavy-duty cargo trucks through routes avoiding low clearance bridges and weight restrictions.',
        features_json: JSON.stringify(['Bridge clearance mapping', 'Real-time driver updates', 'Fuel usage optimization']),
        color: '#059669',
        logo_url: null,
        status: 'Officially released',
        display_order: 1
      },
      {
        slug: 'solartrack',
        name: 'SolarTrack',
        description: 'Monitor daily kilowatt-hour generation, grid performance, and battery reserve margins of your systems on-site.',
        features_json: JSON.stringify(['Kilowatt output analytics', 'Battery degradation forecasts', 'Grid disconnection fail-safes']),
        color: '#d97706',
        logo_url: null,
        status: 'Officially released',
        display_order: 2
      }
    ],
    article_posts: [
      {
        title: 'Decarbonizing Heavy Transport: Battery Tech vs Hydrogen Fuel Cells',
        content: JSON.stringify([
          {
            heading: 'The Energy Density Challenge',
            text: 'Heavy-duty trucking requires immense energy to haul components over long distances. While lithium batteries work well for local delivery fleets, the sheer weight of battery packs restricts total cargo payload capacity. Hydrogen fuel cells present a lighter alternative, but lack the widespread fueling infrastructure needed today.'
          }
        ]),
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
        image_alt: 'Solar grid array with electrical infrastructure',
        author: 'Maria Santos',
        published_date: '2026-06-20',
        display_order: 1
      }
    ],
    global_title: 'Apex Logistics & Energy - Industrial Solar & Heavy Hauling',
    global_description: 'Apex Logistics & Energy designs off-grid microgrids and executes heavy cargo transport across North America.',
    og_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
  },
  
  creative_agency: {
    id: 'creative_agency',
    name: 'Creative Agencies & Studios',
    description: 'Tailored for graphic designers, web branding firms, copywriting agencies, and architectural studios.',
    primary_color: '#db2777', // hot pink
    secondary_color: '#4f46e5', // indigo
    site_name: 'PixelCraft Creative',
    site_slogan: 'Dynamic Design, Bold Digital Experiences',
    site_logo_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=80&q=80',
    footer_phone: '+1 (415) 555-CRAFT',
    footer_email: 'hello@pixelcraft.studio',
    footer_website: 'https://pixelcraft.studio',
    footer_twitter: 'https://x.com/pixelcraft',
    footer_linkedin: 'https://linkedin.com/company/pixelcraft',
    footer_disclaimer_title: 'Copyright & Intellectual Property',
    footer_disclaimer_text: 'All graphic designs, logos, and custom website layouts created for our clients are transferrable assets upon final payment receipt. Original template ideas and core design system code remain under PixelCraft license.',
    quote_title: 'Brilliant Designs for Visionary Brands',
    quote_subtitle: 'Let\'s craft your next digital experience.',
    hero_title: 'Crafting Digital Experiences That Connect & Convert',
    hero_content: 'We are PixelCraft Creative, a branding and development studio specializing in visually striking interfaces and custom identity systems. We partner with growth startups and established companies to transform complex products into engaging web narratives. We don\'t just design layouts; we sculpt digital experiences that resonate.',
    hero_show_contact_us: 1,
    hero_background_type: 'image',
    hero_background_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80',
    services_title: 'Core Creative Design Services',
    services_cards: [
      {
        title: 'Brand Identity & Design',
        description: 'Define your visual footprint. We build robust design guidelines, custom logos, print assets, and distinct typography guides.',
        image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Digital brand guidelines showing branding boards',
        display_order: 1
      },
      {
        title: 'Web & Product Development',
        description: 'Deploy high-performance Next.js landing pages, interactive SaaS applications, and fluid web animations.',
        image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Laptop showing portfolio design process',
        display_order: 2
      },
      {
        title: 'Social Media & Marketing',
        description: 'Drive clicks and organic search impressions with cohesive campaign graphics, copywriting, and target ad placement.',
        image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=600&q=80',
        image_alt: 'Team analyzing layout sheets on whiteboard',
        display_order: 3
      }
    ],
    gallery_items: [
      {
        image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Conceptual sketching on workspace desk',
        display_order: 1,
        category: 'sketching'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Bright agency creative collaborative room',
        display_order: 2,
        category: 'studio'
      },
      {
        image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
        image_alt: 'Creative ideas whiteboard brainstorm',
        display_order: 3,
        category: 'sketching'
      }
    ],
    team_cards: [
      {
        name: 'Chloe Dupont',
        role: 'Design Principal',
        bio: 'Chloe holds a Master of Fine Arts and has spent 12 years directing creative campaigns. She focuses on visual symmetry and user ergonomics.',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        display_order: 1,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      },
      {
        name: 'Jaxson Cross',
        role: 'Lead Brand Strategist',
        bio: 'Jaxson researches market competition and designs visual target definitions. He ensures brand designs match customer demographics.',
        image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        display_order: 2,
        image_zoom: 1.0,
        image_x: 0,
        image_y: 0,
        image_blur: 0
      }
    ],
    products_title: 'Design Templates & Audits',
    products_description: 'Elevate your system UI using our design auditing kits and visual typography packs.',
    products_items: [
      {
        slug: 'brandkit',
        name: 'BrandKit',
        description: 'A structured UI kit of Figma assets and typography styles to speed up design alignment workflows.',
        features_json: JSON.stringify(['50+ UI Components', 'Modular grid layouts', 'Dark/Light styling layers']),
        color: '#db2777',
        logo_url: null,
        status: 'Officially released',
        display_order: 1
      },
      {
        slug: 'pixelaudit',
        name: 'PixelAudit',
        description: 'Upload your landing page URL to receive a comprehensive audit scoring colors, speed, and responsiveness.',
        features_json: JSON.stringify(['Accessibility score checking', 'Contrast ratio checker', 'Visual speed telemetry']),
        color: '#4f46e5',
        logo_url: null,
        status: 'Officially released',
        display_order: 2
      }
    ],
    article_posts: [
      {
        title: 'Why Minimalist Typography Controls Modern Conversion Rates',
        content: JSON.stringify([
          {
            heading: 'Less Noise, More Focus',
            text: 'Modern web layout places typography at the core of messaging. Stripping away heavy borders, shadows, and busy icons forces users to interact with words. Clean fonts and spacious kerning increase reading speeds and conversion click counts.'
          }
        ]),
        image_url: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1000&q=80',
        image_alt: 'Creative designers discussing wireframes',
        author: 'Chloe Dupont',
        published_date: '2026-06-25',
        display_order: 1
      }
    ],
    global_title: 'PixelCraft Creative - Web Design & Studio Brand Identity',
    global_description: 'PixelCraft Creative designs custom brand identity systems, corporate designs, and responsive layouts.',
    og_image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80'
  }
};
