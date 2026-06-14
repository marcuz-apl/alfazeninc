import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Ensure the data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Connect to the database file in the data folder
const dbPath = path.resolve(dataDir, 'afzinc.db');
const db = new Database(dbPath);

// Initialize the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Initialize the admin settings table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

// Check and initialize default admin credentials if not set
const hasPassword = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get();
if (!hasPassword) {
  const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPass = crypto.createHash('sha256').update(defaultPass).digest('hex');
  
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password', ?)")
    .run(hashedPass);
  
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('password_changed', '0')")
    .run();
}

// Initialize dynamic content tables
db.exec(`
  CREATE TABLE IF NOT EXISTS hero_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    show_contact_us INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS services_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS services_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS gallery_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    sliding_effect TEXT DEFAULT 'slide',
    autoplay_speed INTEGER DEFAULT 5000
  );

  CREATE TABLE IF NOT EXISTS gallery_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    category TEXT DEFAULT 'all'
  );

  CREATE TABLE IF NOT EXISTS team_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS article_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    author TEXT,
    published_date TEXT,
    display_order INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT
  );

  CREATE TABLE IF NOT EXISTS products_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    unreleased_message TEXT DEFAULT 'Thanks for interests in this topic/product, Please go to our "Contact Us" page to leave messages about ideas, requirements of functions, how the product shall be, what the targeted markets or audience you are, etc. Thanks.'
  );

  CREATE TABLE IF NOT EXISTS products_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    features_json TEXT,
    color TEXT NOT NULL,
    logo_url TEXT,
    status TEXT DEFAULT 'Officially released',
    display_order INTEGER DEFAULT 0,
    external_url TEXT,
    meta_title TEXT,
    meta_description TEXT
  );

  CREATE TABLE IF NOT EXISTS global_seo (
    id INTEGER PRIMARY KEY DEFAULT 1,
    global_title TEXT NOT NULL,
    global_description TEXT NOT NULL,
    og_image_url TEXT,
    twitter_handle TEXT
  );

  CREATE TABLE IF NOT EXISTS page_seo (
    page_slug TEXT PRIMARY KEY,
    meta_title TEXT,
    meta_description TEXT
  );

  CREATE TABLE IF NOT EXISTS custom_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_html TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT
  );
`);

// Check and initialize default homepage layout if not set
const hasLayout = db.prepare("SELECT value FROM admin_settings WHERE key = 'homepage_layout'").get();
if (!hasLayout) {
  const defaultLayout = JSON.stringify([
    { id: 'hero', visible: true },
    { id: 'services', visible: true },
    { id: 'gallery', visible: true },
    { id: 'quote', visible: true },
    { id: 'image_banner', visible: true },
    { id: 'team', visible: true },
    { id: 'article', visible: true },
    { id: 'contact-us', visible: true }
  ]);
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('homepage_layout', ?)").run(defaultLayout);
}

// Safe Migrations for existing databases
try {
  db.exec("ALTER TABLE hero_settings ADD COLUMN background_type TEXT DEFAULT 'image'");
} catch (e) {}
try {
  db.exec("ALTER TABLE hero_settings ADD COLUMN background_url TEXT DEFAULT '/images/hero/hero_bg.jpg'");
} catch (e) {}
try {
  db.exec("ALTER TABLE team_cards ADD COLUMN image_zoom REAL DEFAULT 1.0");
} catch (e) {}
try {
  db.exec("ALTER TABLE team_cards ADD COLUMN image_x REAL DEFAULT 0.0");
} catch (e) {}
try {
  db.exec("ALTER TABLE team_cards ADD COLUMN image_y REAL DEFAULT 0.0");
} catch (e) {}
try {
  db.exec("ALTER TABLE team_cards ADD COLUMN image_blur REAL DEFAULT 0.0");
} catch (e) {}
try {
  db.exec("ALTER TABLE products_items ADD COLUMN status TEXT DEFAULT 'Officially released'");
} catch (e) {}
try {
  db.exec("ALTER TABLE gallery_items ADD COLUMN category TEXT DEFAULT 'all'");
} catch (e) {}
try {
  db.exec("ALTER TABLE products_settings ADD COLUMN unreleased_message TEXT DEFAULT 'Thanks for interests in this topic/product, Please go to our \"Contact Us\" page to leave messages about ideas, requirements of functions, how the product shall be, what the targeted markets or audience you are, etc. Thanks.'");
} catch (e) {}
try {
  db.exec("ALTER TABLE products_items ADD COLUMN external_url TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE products_items ADD COLUMN meta_title TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE products_items ADD COLUMN meta_description TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE article_posts ADD COLUMN meta_title TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE article_posts ADD COLUMN meta_description TEXT");
} catch (e) {}

// Seed default data if empty
const hasHero = db.prepare("SELECT count(*) as count FROM hero_settings").get() as { count: number };
if (hasHero.count === 0) {
  db.prepare("INSERT INTO hero_settings (id, title, content, show_contact_us, background_type, background_url) VALUES (1, ?, ?, 1, 'image', '/images/hero/hero_bg.jpg')")
    .run(
      "Global AI Solutions for Oil & Gas",
      "With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry. Based in Calgary, AB, we deliver innovative solutions that optimize operations and drive industry progress. Partner with us to harness the power of AI for your energy needs."
    );
}

const hasServicesSettings = db.prepare("SELECT count(*) as count FROM services_settings").get() as { count: number };
if (hasServicesSettings.count === 0) {
  db.prepare("INSERT INTO services_settings (id, title) VALUES (1, ?)")
    .run("Alfazen Inc. Data Science Services for Oil & Gas");
}

const hasServices = db.prepare("SELECT count(*) as count FROM services_cards").get() as { count: number };
if (hasServices.count === 0) {
  const defaultServices = [
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
  ];
  for (const card of defaultServices) {
    db.prepare("INSERT INTO services_cards (title, description, image_url, image_alt, display_order) VALUES (?, ?, ?, ?, ?)")
      .run(card.title, card.description, card.image_url, card.image_alt, card.display_order);
  }
}

const hasGallerySettings = db.prepare("SELECT count(*) as count FROM gallery_settings").get() as { count: number };
if (hasGallerySettings.count === 0) {
  db.prepare("INSERT INTO gallery_settings (id, sliding_effect, autoplay_speed) VALUES (1, 'slide', 5000)").run();
}

const hasGallery = db.prepare("SELECT count(*) as count FROM gallery_items").get() as { count: number };
if (hasGallery.count === 0) {
  const defaultGallery = [
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
      image_url: 'https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw1fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Oil field operations during sunset',
      display_order: 3,
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1694039446022-2d227e8b104b?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwxfHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Oil pumpjack working in remote landscape',
      display_order: 4,
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1596017264419-23e7af0e86db?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw4fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Sunset over industrial infrastructure',
      display_order: 5,
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1562237548-2e0fd9797537?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw4fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Active ERIELL drilling rig',
      display_order: 6,
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'AI Neural Network concept',
      display_order: 7,
      category: 'ai-power'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'Artificial Intelligence brain',
      display_order: 8,
      category: 'ai-power'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'Machine Learning code',
      display_order: 9,
      category: 'ai-power'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'Cybersecurity and Tech setup',
      display_order: 10,
      category: 'ai-power'
    }
  ];
  for (const item of defaultGallery) {
    db.prepare("INSERT INTO gallery_items (image_url, image_alt, display_order, category) VALUES (?, ?, ?, ?)")
      .run(item.image_url, item.image_alt, item.display_order, item.category);
  }
}

const hasTeam = db.prepare("SELECT count(*) as count FROM team_cards").get() as { count: number };
if (hasTeam.count === 0) {
  const defaultTeam = [
    {
      name: 'Marcus Zou',
      role: 'Commercialisation Officer',
      bio: 'Marcus Zou, Senior Data Specialist and Commercialization Officer, Microsoft certified Cloud Engineer, brings 20 years of expertise in AI and machine learning applied to geoscience, reservoir modeling and predictive maintenance in the oil and gas sector.',
      image_url: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/6579892a-1466-44d5-a9b8-e34587dd8543_1040x1040.webp',
      display_order: 1
    },
    {
      name: 'Edward Zou',
      role: 'Business Portfolio Manager',
      bio: 'Edward Zou, Software Architect and Business Portfolio Manager, Microsoft Certified Cloud Developer, specializes in orchestrating software architecture, building scalable data solutions and integrating complex data for advanced analytics and operational optimization.',
      image_url: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/c9974234-a8b3-4d4d-ad52-138e1f64cd04_1040x1040.webp',
      display_order: 2
    }
  ];
  for (const member of defaultTeam) {
    db.prepare("INSERT INTO team_cards (name, role, bio, image_url, display_order) VALUES (?, ?, ?, ?, ?)")
      .run(member.name, member.role, member.bio, member.image_url, member.display_order);
  }
}

const hasArticles = db.prepare("SELECT count(*) as count FROM article_posts").get() as { count: number };
if (hasArticles.count === 0) {
  db.prepare(`
    INSERT INTO article_posts (title, content, image_url, image_alt, author, published_date, display_order)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `).run(
    "Alfazen Inc.: Pioneering Data Science Solutions in the Oil and Gas Industry",
    JSON.stringify([
      {
        heading: "Expertise Rooted in Experience and Innovation",
        text: "Alfazen Inc., headquartered in Calgary, AB, brings over 20 years of unparalleled expertise in data science tailored specifically for the oil and gas sector. With a presence across multiple continents, our team combines deep industry knowledge with cutting-edge AI technologies to address the complex challenges faced by energy companies today. Our seasoned professionals understand the nuances of the oil and gas industry, enabling us to deliver insights that drive operational efficiency and strategic decision-making."
      },
      {
        heading: "Comprehensive Data Science Services",
        text: "We offer a suite of data science services designed to optimize exploration, production, and asset management processes. Our solutions encompass predictive analytics, machine learning models, and advanced data integration techniques that transform vast datasets into actionable intelligence. Whether it’s enhancing reservoir characterization, improving drilling accuracy, or optimizing supply chain logistics, Alfazen Inc. provides customized strategies that align with our clients’ unique needs and goals."
      },
      {
        heading: "Empowering the Industry with AI-Driven Solutions",
        text: "At Alfazen Inc., we are committed to harnessing the power of artificial intelligence to revolutionize the oil and gas industry. Our AI capabilities enable companies to anticipate market fluctuations, reduce operational risks, and increase sustainability through smarter resource management. By partnering with us, clients gain a competitive edge through innovative technology that not only addresses current challenges but also anticipates future opportunities in an ever-evolving energy landscape."
      }
    ]),
    "https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxEYXRhJTIwU2NpZW5jZSUyQyUyME9pbCUyMGFuZCUyMEdhcyUyMEluZHVzdHJ5JTJDJTIwQXJ0aWZpY2lhbCUyMEludGVsbGlnZW5jZSUyQyUyMENhbGdhcnl8ZW58MHwwfHx8MTc2MzQwMTc2OHww&ixlib=rb-4.1.0&w=1000&q=80&auto=format&fit=crop",
    "a sunset in the background with oil industry elements",
    "Marcus Zou",
    "2026-06-12"
  );
}

const hasProductsSettings = db.prepare("SELECT count(*) as count FROM products_settings").get() as { count: number };
if (hasProductsSettings.count === 0) {
  db.prepare("INSERT INTO products_settings (id, title, description, unreleased_message) VALUES (1, ?, ?, ?)").run(
    "Our Products",
    "Discover the comprehensive suite of AI-driven solutions from Alfazen Inc., designed specifically to tackle the unique challenges of the oil and gas industry.",
    "Thanks for interests in this topic/product, Please go to our \"Contact Us\" page to leave messages about ideas, requirements of functions, how the product shall be, what the targeted markets or audience you are, etc. Thanks."
  );
}

const hasProducts = db.prepare("SELECT count(*) as count FROM products_items").get() as { count: number };
if (hasProducts.count === 0) {
  const defaultProducts = [
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
      color: 'var(--primary)',
      logo_url: '/images/products/resologix-logo-cropped.png',
      display_order: 1,
      external_url: null
    },
    {
      slug: 'elogant',
      name: 'Elogant',
      description: 'Intelligent well logging and data interpretation. Streamline operations with automated insights and highly accurate predictions.',
      features_json: null,
      color: 'var(--secondary)',
      logo_url: null,
      display_order: 2
    },
    {
      slug: 'diabit',
      name: 'Diabit',
      description: 'Predictive maintenance and equipment health monitoring. Prevent downtime before it happens using advanced machine learning algorithms.',
      features_json: null,
      color: 'var(--primary)',
      logo_url: null,
      display_order: 3
    },
    {
      slug: 'seiscult',
      name: 'SeisCult',
      description: 'Seismic data processing and visualization. Enhance subsurface imaging to pinpoint valuable resources with unprecedented accuracy.',
      features_json: null,
      color: 'var(--secondary)',
      logo_url: null,
      display_order: 4
    },
    {
      slug: 'finapick',
      name: 'FinaPick',
      description: 'Financial forecasting and asset valuation for the energy sector. Make data-driven investment decisions with confidence.',
      features_json: null,
      color: 'var(--primary)',
      logo_url: null,
      display_order: 5,
      external_url: null
    }
  ];
  const insertProduct = db.prepare("INSERT INTO products_items (slug, name, description, features_json, color, logo_url, status, display_order, external_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (const item of defaultProducts) {
    insertProduct.run(
      item.slug, 
      item.name, 
      item.description, 
      item.features_json, 
      item.color, 
      item.logo_url, 
      'Officially released', 
      item.display_order,
      item.external_url || null
    );
  }
}

const hasGlobalSeo = db.prepare("SELECT count(*) as count FROM global_seo").get() as { count: number };
if (hasGlobalSeo.count === 0) {
  db.prepare("INSERT INTO global_seo (id, global_title, global_description, og_image_url, twitter_handle) VALUES (1, ?, ?, ?, ?)").run(
    "Global AI Solutions for Oil & Gas - Alfazen Inc.",
    "With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry.",
    "/images/hero/hero_bg.jpg",
    "@alfazeninc"
  );
}

const hasPageSeo = db.prepare("SELECT count(*) as count FROM page_seo").get() as { count: number };
if (hasPageSeo.count === 0) {
  const insertPageSeo = db.prepare("INSERT INTO page_seo (page_slug, meta_title, meta_description) VALUES (?, ?, ?)");
  insertPageSeo.run('home', null, null);
  insertPageSeo.run('products', 'Our Products - Alfazen Inc.', 'Discover the comprehensive suite of AI-driven solutions from Alfazen Inc., designed specifically to tackle the unique challenges of the oil and gas industry.');
  insertPageSeo.run('articles', 'Tech Notes & Articles - Alfazen Inc.', 'Read our latest tech notes and articles on data science and the oil & gas industry.');
  insertPageSeo.run('gallery', 'Gallery - Alfazen Inc.', 'View our gallery of AI-powered solutions and oil pumps.');
}

export default db;
