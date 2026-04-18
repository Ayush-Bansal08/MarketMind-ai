const companies = [

  // ── FinTech ───────────────────────────────────────────────────────────────
  {
    name: "Stripe",
    description: "Stripe is a financial infrastructure platform for businesses of all sizes. It offers payment processing APIs, billing, fraud prevention, and revenue optimization tools used by millions of companies worldwide including Amazon and Google.",
    industry: "FinTech",
    fundingStage: "series-d+",
    tags: ["payments", "API", "developer tools", "financial infrastructure", "billing"]
  },
  {
    name: "Razorpay",
    description: "Razorpay is an Indian fintech company providing payment gateway solutions, business banking, payroll, and lending services. It enables businesses to accept, process, and disburse payments with its full-stack financial solutions platform.",
    industry: "FinTech",
    fundingStage: "series-f",
    tags: ["payments", "India", "payment gateway", "business banking", "fintech"]
  },
  {
    name: "Plaid",
    description: "Plaid is a data network that powers the digital financial ecosystem. It enables applications to connect with users bank accounts, verify identities, check balances, and initiate payments through a single API layer.",
    industry: "FinTech",
    fundingStage: "series-d+",
    tags: ["banking API", "open banking", "financial data", "identity verification", "fintech"]
  },
  {
    name: "Brex",
    description: "Brex is a financial technology company offering corporate credit cards, expense management, and business accounts built specifically for startups and fast-growing companies. It uses AI for spend controls and automated bookkeeping.",
    industry: "FinTech",
    fundingStage: "series-d+",
    tags: ["corporate cards", "expense management", "startups", "business finance", "AI"]
  },
  {
    name: "Wise",
    description: "Wise, formerly TransferWise, is a global money transfer and international banking platform. It allows individuals and businesses to send money abroad at real exchange rates with low transparent fees across 80+ countries.",
    industry: "FinTech",
    fundingStage: "public",
    tags: ["international payments", "remittance", "forex", "cross-border", "banking"]
  },
  {
    name: "Revolut",
    description: "Revolut is a global financial super-app offering banking, currency exchange, stock trading, crypto, and business accounts. It serves over 35 million customers globally with a mobile-first approach to personal and business finance.",
    industry: "FinTech",
    fundingStage: "series-e",
    tags: ["neobank", "crypto", "trading", "international banking", "super-app"]
  },
  {
    name: "Chime",
    description: "Chime is an American neobank offering fee-free checking and savings accounts, early direct deposit, and credit building products. It targets underserved consumers with no monthly fees and automatic savings features.",
    industry: "FinTech",
    fundingStage: "series-g",
    tags: ["neobank", "challenger bank", "consumer finance", "no-fee banking", "credit building"]
  },
  {
    name: "Affirm",
    description: "Affirm is a buy now pay later platform that offers installment loans at point of sale for online and in-store purchases. It partners with thousands of merchants and provides transparent financing without hidden fees.",
    industry: "FinTech",
    fundingStage: "public",
    tags: ["BNPL", "buy now pay later", "consumer lending", "installments", "e-commerce"]
  },

  // ── AI / ML ───────────────────────────────────────────────────────────────
  {
    name: "OpenAI",
    description: "OpenAI is an AI research company that develops large language models including GPT-4 and DALL-E. It offers APIs for text generation, image creation, and code assistance, and created ChatGPT, the fastest growing consumer application in history.",
    industry: "Artificial Intelligence",
    fundingStage: "series-d+",
    tags: ["LLM", "GPT", "ChatGPT", "AI research", "generative AI", "API"]
  },
  {
    name: "Anthropic",
    description: "Anthropic is an AI safety company building reliable, interpretable, and steerable AI systems. It develops Claude, a family of large language models designed with a focus on safety and helpfulness for enterprise and consumer applications.",
    industry: "Artificial Intelligence",
    fundingStage: "series-d+",
    tags: ["AI safety", "LLM", "Claude", "generative AI", "enterprise AI"]
  },
  {
    name: "Hugging Face",
    description: "Hugging Face is the AI community platform for building, training, and deploying machine learning models. It hosts the largest repository of open-source AI models and datasets and provides infrastructure tools for ML engineers.",
    industry: "Artificial Intelligence",
    fundingStage: "series-d",
    tags: ["open source", "ML models", "NLP", "model hub", "transformers", "datasets"]
  },
  {
    name: "Cohere",
    description: "Cohere is an enterprise AI platform providing large language model APIs for text generation, embedding, classification, and search. It focuses on building reliable, secure NLP solutions for businesses with data privacy guarantees.",
    industry: "Artificial Intelligence",
    fundingStage: "series-c",
    tags: ["enterprise AI", "NLP", "embeddings", "text generation", "LLM API"]
  },
  {
    name: "Mistral AI",
    description: "Mistral AI is a French AI startup building open and efficient large language models. Its models are known for strong performance at smaller parameter counts, making them ideal for on-premise and cost-sensitive enterprise deployments.",
    industry: "Artificial Intelligence",
    fundingStage: "series-b",
    tags: ["open source LLM", "efficient AI", "France", "enterprise", "on-premise AI"]
  },
  {
    name: "Scale AI",
    description: "Scale AI is a data infrastructure company that provides high-quality training data for AI models. It uses human-in-the-loop labeling pipelines to annotate images, videos, text, and 3D sensor data for machine learning applications.",
    industry: "Artificial Intelligence",
    fundingStage: "series-f",
    tags: ["data labeling", "AI training data", "annotation", "ML infrastructure", "RLHF"]
  },
  {
    name: "Perplexity AI",
    description: "Perplexity AI is an AI-powered answer engine that provides direct, cited answers to questions by searching the web in real time. It combines LLMs with live web retrieval to deliver accurate, sourced responses for research and discovery.",
    industry: "Artificial Intelligence",
    fundingStage: "series-b",
    tags: ["search AI", "answer engine", "RAG", "web search", "LLM", "research tool"]
  },
  {
    name: "Runway",
    description: "Runway is a creative AI company building generative video and image tools for filmmakers, designers, and creators. Its Gen-2 model enables text-to-video and video-to-video generation used in Hollywood productions and creative workflows.",
    industry: "Artificial Intelligence",
    fundingStage: "series-c",
    tags: ["generative video", "text to video", "creative AI", "media", "Gen-2"]
  },

  // ── DevTools / Infrastructure ─────────────────────────────────────────────
  {
    name: "Vercel",
    description: "Vercel is a frontend cloud platform for deploying and scaling web applications. It offers seamless Git integration, edge functions, and global CDN optimized for Next.js and modern JavaScript frameworks.",
    industry: "Developer Tools",
    fundingStage: "series-e",
    tags: ["deployment", "frontend", "Next.js", "edge computing", "CDN", "serverless"]
  },
  {
    name: "Supabase",
    description: "Supabase is an open-source Firebase alternative providing a Postgres database, authentication, real-time subscriptions, storage, and edge functions. It enables developers to build full-stack applications with a single platform.",
    industry: "Developer Tools",
    fundingStage: "series-b",
    tags: ["open source", "PostgreSQL", "BaaS", "authentication", "real-time", "Firebase alternative"]
  },
  {
    name: "Vercel",
    description: "Vercel is a frontend cloud for deploying web applications with seamless CI/CD, edge network delivery, and performance analytics built for modern JavaScript frameworks.",
    industry: "Developer Tools",
    fundingStage: "series-e",
    tags: ["deployment", "CI/CD", "edge", "Next.js", "web performance"]
  },
  {
    name: "Linear",
    description: "Linear is a project management and issue tracking tool built for high-performance software teams. It offers a fast, keyboard-driven interface, Git integrations, and streamlined workflows for engineering teams at startups and enterprises.",
    industry: "Developer Tools",
    fundingStage: "series-b",
    tags: ["project management", "issue tracking", "engineering", "productivity", "SaaS"]
  },
  {
    name: "Retool",
    description: "Retool is a low-code platform for building internal business tools and dashboards. It connects to any database or API and lets developers drag-and-drop UI components to build admin panels, CRUD apps, and workflows rapidly.",
    industry: "Developer Tools",
    fundingStage: "series-c",
    tags: ["low-code", "internal tools", "admin panel", "dashboard", "no-code"]
  },
  {
    name: "Hashicorp",
    description: "HashiCorp provides cloud infrastructure automation tools including Terraform for infrastructure as code, Vault for secrets management, Consul for service mesh, and Nomad for workload orchestration across multi-cloud environments.",
    industry: "Developer Tools",
    fundingStage: "public",
    tags: ["infrastructure as code", "Terraform", "DevOps", "secrets management", "cloud"]
  },
  {
    name: "Datadog",
    description: "Datadog is a cloud monitoring and observability platform offering infrastructure monitoring, APM, log management, and security monitoring. It provides full-stack visibility into cloud applications for engineering and DevOps teams.",
    industry: "Developer Tools",
    fundingStage: "public",
    tags: ["monitoring", "observability", "APM", "DevOps", "cloud", "logs"]
  },
  {
    name: "Postman",
    description: "Postman is an API platform for building, testing, and documenting APIs. It provides tools for API design, automated testing, mocking, and collaboration, used by over 30 million developers and 500,000 organizations globally.",
    industry: "Developer Tools",
    fundingStage: "series-d",
    tags: ["API", "testing", "documentation", "developer tools", "collaboration"]
  },

  // ── SaaS / Productivity ───────────────────────────────────────────────────
  {
    name: "Notion",
    description: "Notion is an all-in-one workspace combining notes, wikis, databases, and project management. Teams use it to write documentation, manage projects, and collaborate on knowledge bases with a highly flexible block-based editor.",
    industry: "SaaS / Productivity",
    fundingStage: "series-c",
    tags: ["productivity", "notes", "wiki", "project management", "collaboration", "workspace"]
  },
  {
    name: "Airtable",
    description: "Airtable is a low-code platform combining the simplicity of a spreadsheet with the power of a relational database. Teams use it to build custom workflows, manage content pipelines, track inventory, and organize any structured data.",
    industry: "SaaS / Productivity",
    fundingStage: "series-f",
    tags: ["spreadsheet", "database", "low-code", "workflow", "no-code", "collaboration"]
  },
  {
    name: "Figma",
    description: "Figma is a collaborative interface design tool used by product teams to design, prototype, and hand off UI/UX designs. Its real-time multiplayer editing and component system made it the industry standard for product design.",
    industry: "SaaS / Productivity",
    fundingStage: "acquired",
    tags: ["design", "UI/UX", "prototyping", "collaboration", "product design"]
  },
  {
    name: "Loom",
    description: "Loom is an async video messaging platform that lets teams record and share screen and camera videos instantly. It reduces meeting overhead by enabling developers, managers, and designers to communicate visually without scheduling calls.",
    industry: "SaaS / Productivity",
    fundingStage: "acquired",
    tags: ["video messaging", "async communication", "screen recording", "remote work"]
  },
  {
    name: "Slack",
    description: "Slack is a cloud-based team communication platform offering channels, direct messaging, file sharing, and thousands of integrations with tools like GitHub, Jira, and Google Workspace for workplace collaboration.",
    industry: "SaaS / Productivity",
    fundingStage: "acquired",
    tags: ["team communication", "messaging", "collaboration", "integrations", "remote work"]
  },

  // ── Web3 / Blockchain ─────────────────────────────────────────────────────
  {
    name: "Alchemy",
    description: "Alchemy is a blockchain developer platform providing APIs, SDKs, and infrastructure for building decentralized applications on Ethereum, Polygon, Solana, and other chains. It serves as the AWS for Web3 development.",
    industry: "Web3 / Blockchain",
    fundingStage: "series-c",
    tags: ["blockchain", "Web3", "Ethereum", "developer platform", "DApp", "infrastructure"]
  },
  {
    name: "Chainlink",
    description: "Chainlink is a decentralized oracle network that connects smart contracts with real-world data, APIs, and payment systems. It enables blockchains to interact with off-chain information securely and reliably.",
    industry: "Web3 / Blockchain",
    fundingStage: "public",
    tags: ["oracle", "smart contracts", "DeFi", "blockchain", "data feeds"]
  },
  {
    name: "Polygon",
    description: "Polygon is a Layer 2 scaling solution for Ethereum providing faster and cheaper transactions. It offers a suite of scaling solutions including PoS chain, zkEVM, and CDK for building Ethereum-compatible blockchain networks.",
    industry: "Web3 / Blockchain",
    fundingStage: "series-b",
    tags: ["Layer 2", "Ethereum", "scaling", "zkEVM", "blockchain", "DeFi"]
  },
  {
    name: "OpenSea",
    description: "OpenSea is the largest NFT marketplace for buying, selling, and discovering digital assets including art, collectibles, gaming items, and virtual land across multiple blockchains including Ethereum, Solana, and Polygon.",
    industry: "Web3 / Blockchain",
    fundingStage: "series-c",
    tags: ["NFT", "marketplace", "digital assets", "Ethereum", "collectibles"]
  },
  {
    name: "Coinbase",
    description: "Coinbase is a publicly traded cryptocurrency exchange and Web3 platform offering retail and institutional trading, custody, staking, NFT marketplace, and a developer ecosystem via Coinbase Cloud and Base L2 network.",
    industry: "Web3 / Blockchain",
    fundingStage: "public",
    tags: ["crypto exchange", "Bitcoin", "Ethereum", "institutional crypto", "Web3", "Base"]
  },

  // ── HealthTech ────────────────────────────────────────────────────────────
  {
    name: "Headspace",
    description: "Headspace is a digital mental health platform offering guided meditation, sleep content, stress reduction exercises, and mindfulness programs. It serves consumers and enterprise employees through subscription and B2B wellness programs.",
    industry: "HealthTech",
    fundingStage: "series-c",
    tags: ["mental health", "meditation", "wellness", "mindfulness", "B2B", "employee wellness"]
  },
  {
    name: "Noom",
    description: "Noom is a digital health company offering AI-powered weight management and behavior change programs. It uses psychology-based coaching, food tracking, and personalized curriculum to help users build sustainable healthy habits.",
    industry: "HealthTech",
    fundingStage: "series-f",
    tags: ["weight loss", "digital health", "behavior change", "AI coaching", "wellness"]
  },
  {
    name: "Hims & Hers",
    description: "Hims and Hers is a telehealth platform offering prescription medications, skincare, sexual health, and mental health services online. It connects patients with licensed providers through an app for affordable and private healthcare.",
    industry: "HealthTech",
    fundingStage: "public",
    tags: ["telehealth", "telemedicine", "prescriptions", "mental health", "consumer health"]
  },
  {
    name: "Ro",
    description: "Ro is a direct-to-patient healthcare company offering telehealth consultations, prescription delivery, and longitudinal care programs for conditions like obesity, fertility, and smoking cessation through its digital health platform.",
    industry: "HealthTech",
    fundingStage: "series-d",
    tags: ["telehealth", "prescription delivery", "digital health", "primary care", "obesity"]
  },
  {
    name: "Tempus",
    description: "Tempus is an AI and data-driven precision medicine company that analyzes clinical and molecular data to help physicians make real-time personalized treatment decisions for cancer patients and other complex diseases.",
    industry: "HealthTech",
    fundingStage: "series-g",
    tags: ["precision medicine", "AI", "genomics", "cancer", "clinical data", "oncology"]
  },

  // ── EdTech ────────────────────────────────────────────────────────────────
  {
    name: "Duolingo",
    description: "Duolingo is the world's most popular language learning app, offering gamified lessons for 40+ languages. Its AI-driven adaptive learning system personalizes content to each learner's pace and tracks daily streaks to drive engagement.",
    industry: "EdTech",
    fundingStage: "public",
    tags: ["language learning", "gamification", "AI", "education app", "mobile learning"]
  },
  {
    name: "Coursera",
    description: "Coursera is an online learning platform partnering with 300+ universities and companies to offer courses, certificates, and degrees. It serves individuals and enterprises with professional development and upskilling programs.",
    industry: "EdTech",
    fundingStage: "public",
    tags: ["online learning", "university", "certificates", "MOOCs", "upskilling", "enterprise"]
  },
  {
    name: "Teachable",
    description: "Teachable is a platform for creators and entrepreneurs to build and sell online courses, coaching products, and digital downloads. It provides tools for course creation, payment processing, and student management.",
    industry: "EdTech",
    fundingStage: "acquired",
    tags: ["online courses", "creator economy", "e-learning", "course platform", "digital products"]
  },
  {
    name: "Kahoot",
    description: "Kahoot is a game-based learning platform used in classrooms and corporate training to create interactive quizzes and presentations. It gamifies education with live competitions that increase engagement and knowledge retention.",
    industry: "EdTech",
    fundingStage: "public",
    tags: ["gamification", "quizzes", "classroom", "e-learning", "corporate training"]
  },

  // ── E-commerce / Retail ───────────────────────────────────────────────────
  {
    name: "Shopify",
    description: "Shopify is a commerce platform enabling businesses to set up online stores, manage inventory, process payments, and sell across multiple channels including social media and physical retail. It powers over 2 million merchants globally.",
    industry: "E-commerce",
    fundingStage: "public",
    tags: ["e-commerce", "online store", "payments", "retail", "multi-channel", "merchants"]
  },
  {
    name: "Klaviyo",
    description: "Klaviyo is a marketing automation platform built for e-commerce, offering email and SMS marketing, customer segmentation, and revenue analytics. It integrates deeply with Shopify and helps brands build direct customer relationships.",
    industry: "E-commerce",
    fundingStage: "public",
    tags: ["email marketing", "SMS", "e-commerce", "automation", "Shopify", "CRM"]
  },
  {
    name: "Gorgias",
    description: "Gorgias is a customer support helpdesk designed for e-commerce brands. It centralizes support tickets from email, social media, and live chat, and uses automation and AI to help support teams respond faster and drive revenue.",
    industry: "E-commerce",
    fundingStage: "series-c",
    tags: ["customer support", "helpdesk", "e-commerce", "automation", "AI", "Shopify"]
  },

  // ── Climate / DeepTech ────────────────────────────────────────────────────
  {
    name: "Climeworks",
    description: "Climeworks is a Swiss carbon capture company that builds direct air capture plants to remove CO2 from the atmosphere. Its Orca and Mammoth plants in Iceland use geothermal energy to permanently store carbon underground.",
    industry: "ClimaTech",
    fundingStage: "series-e",
    tags: ["carbon capture", "DAC", "climate", "CO2 removal", "sustainability", "deep tech"]
  },
  {
    name: "Northvolt",
    description: "Northvolt is a Swedish battery manufacturer producing sustainable lithium-ion batteries for electric vehicles and energy storage. It operates Europe's largest battery gigafactory and focuses on using renewable energy in production.",
    industry: "ClimaTech",
    fundingStage: "series-f",
    tags: ["batteries", "EV", "energy storage", "sustainability", "gigafactory", "climate"]
  },
  {
    name: "Impossible Foods",
    description: "Impossible Foods develops plant-based meat alternatives using heme protein derived from soy plants to replicate the taste and texture of beef, pork, and chicken. Its products are sold in restaurants and grocery stores globally.",
    industry: "FoodTech",
    fundingStage: "series-h",
    tags: ["plant-based", "food tech", "alternative protein", "sustainability", "meat alternatives"]
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    name: "CrowdStrike",
    description: "CrowdStrike is a cybersecurity company offering cloud-native endpoint protection, threat intelligence, and incident response services. Its Falcon platform uses AI to detect and prevent breaches in real time across enterprise environments.",
    industry: "Cybersecurity",
    fundingStage: "public",
    tags: ["endpoint security", "AI", "threat detection", "cloud security", "EDR", "cybersecurity"]
  },
  {
    name: "Wiz",
    description: "Wiz is a cloud security platform that provides agentless security scanning across AWS, Azure, and GCP environments. It identifies vulnerabilities, misconfigurations, and toxic risk combinations in cloud infrastructure.",
    industry: "Cybersecurity",
    fundingStage: "series-e",
    tags: ["cloud security", "CSPM", "AWS", "Azure", "vulnerability scanning", "agentless"]
  },
  {
    name: "Snyk",
    description: "Snyk is a developer security platform that finds and fixes vulnerabilities in code, open-source dependencies, containers, and infrastructure as code. It integrates directly into developer workflows via IDE plugins and CI/CD pipelines.",
    industry: "Cybersecurity",
    fundingStage: "series-f",
    tags: ["developer security", "open source", "vulnerabilities", "DevSecOps", "CI/CD"]
  },

  // ── HR / Future of Work ───────────────────────────────────────────────────
  {
    name: "Rippling",
    description: "Rippling is a workforce management platform that unifies HR, IT, and finance operations. It automates onboarding, payroll, benefits, device management, and app provisioning so companies can manage their entire workforce in one system.",
    industry: "HR Tech",
    fundingStage: "series-f",
    tags: ["HR", "payroll", "IT management", "onboarding", "workforce", "automation"]
  },
  {
    name: "Deel",
    description: "Deel is a global payroll and HR platform enabling companies to hire, pay, and manage remote employees and contractors in 150+ countries compliantly. It handles contracts, tax filings, benefits, and local compliance automatically.",
    industry: "HR Tech",
    fundingStage: "series-d",
    tags: ["global payroll", "remote work", "HR", "compliance", "contractors", "international hiring"]
  },
  {
    name: "Lattice",
    description: "Lattice is a people management platform offering performance reviews, OKR tracking, employee engagement surveys, and compensation management. It helps HR leaders and managers build high-performing cultures through data-driven insights.",
    industry: "HR Tech",
    fundingStage: "series-f",
    tags: ["performance management", "OKR", "employee engagement", "HR", "people ops"]
  },
]

export default companies;

      