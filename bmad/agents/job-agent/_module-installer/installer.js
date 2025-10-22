// Job Search Intelligence System Module Installer
// Provides custom installation steps for the job-agent module

const fs = require('fs');
const path = require('path');

function installModule(config = {}) {
  console.log('Installing Job Search Intelligence System module...');

  try {
    const projectRoot = resolveProjectRoot(config);
    const moduleRoot = path.resolve(projectRoot, 'bmad', 'agents', 'job-agent');
    const dataDir = path.join(moduleRoot, 'data');
    const templatesDir = path.join(moduleRoot, 'templates');

    ensureDirectory(moduleRoot);
    ensureDirectory(dataDir);
    ensureDirectory(templatesDir);

    const knowledgeBaseDir = resolveConfiguredPath(
      config?.knowledge_base?.location,
      projectRoot,
      moduleRoot,
      path.join(projectRoot, 'About-me', 'Projects')
    );
    validateKnowledgeBaseStructure(knowledgeBaseDir);

    const jobsDir = resolveConfiguredPath(
      config?.jobs_database?.location,
      projectRoot,
      moduleRoot,
      path.join(projectRoot, 'Jobs')
    );
    setupJobsDatabase(jobsDir, config?.jobs_database?.metadata_file);

    createTierCriteriaFile(
      dataDir,
      config?.tier_system || getDefaultTierSystem()
    );

    seedKnowledgeBase(knowledgeBaseDir, config?.knowledge_base?.naming_convention);
    createCvTemplates(templatesDir);

    console.log('Job Search Intelligence System module installed successfully!');
    return true;
  } catch (error) {
    console.error('Installation failed:', error.message);
    return false;
  }
}

function validateEnvironment() {
  // Check for required dependencies
  // Verify folder permissions
  // Ensure compatible BMAD version
  return true;
}

function postInstall() {
  // Create sample KB entry template
  // Generate tier-criteria.yaml
  // Setup default CV templates
  return true;
}

module.exports = {
  installModule,
  validateEnvironment,
  postInstall
};

function resolveProjectRoot(config) {
  const root =
    config.projectRoot ||
    config.project_root ||
    config.project_root_path ||
    process.cwd();
  return path.resolve(root);
}

function resolveConfiguredPath(value, projectRoot, moduleRoot, fallback) {
  if (!value || typeof value !== 'string') {
    return fallback ? path.resolve(fallback) : fallback;
  }

  let resolved = value;
  resolved = resolved.replace(/\{project-root\}/gi, projectRoot);
  resolved = resolved.replace(/\{module[-_]root\}/gi, moduleRoot);
  resolved = resolved.replace(/\{installer[-_]path\}/gi, path.join(moduleRoot, '_module-installer'));

  return path.resolve(resolved);
}

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function validateKnowledgeBaseStructure(knowledgeBaseDir) {
  ensureDirectory(knowledgeBaseDir);

  const readmePath = path.join(knowledgeBaseDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const content = [
      '# Professional Knowledge Base',
      '',
      'This directory stores detailed write-ups for your professional experiences.',
      '',
      '- Maintain one file per experience using the naming convention `exp_<slug>.md`.',
      '- Keep metadata in the frontmatter block for quick filtering.',
      '- Link to artifacts (portfolios, repositories, metrics) within each entry.',
      ''
    ].join('\n');

    fs.writeFileSync(readmePath, content, 'utf8');
    console.log(`Seeded knowledge base README: ${readmePath}`);
  }
}

function createTierCriteriaFile(dataDir, tierConfig) {
  const tierFile = path.join(dataDir, 'tier-criteria.yaml');
  if (fs.existsSync(tierFile)) {
    return;
  }

  const lines = ['# Auto-generated job match tier criteria', `generated: ${new Date().toISOString()}`, 'tiers:'];

  Object.entries(tierConfig).forEach(([tier, description]) => {
    lines.push(`  ${tier}: |`);
    description
      .toString()
      .split('\n')
      .forEach((line) => lines.push(`    ${line}`));
  });

  fs.writeFileSync(tierFile, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Created tier criteria: ${tierFile}`);
}

function getDefaultTierSystem() {
  return {
    tier_1: 'Perfect fit - Strong match across all key requirements',
    tier_2: 'Strong candidate - Match on most requirements, minor gaps',
    tier_3: 'Reach - Significant match but notable gaps',
    tier_4: 'Stretch - Limited match, major skill gaps',
    tier_5: 'Mismatch - Poor fit, not recommended'
  };
}

function seedKnowledgeBase(knowledgeBaseDir, namingConvention = 'exp_{slug}.md') {
  const placeholderSlug = 'sample-project';
  const fileName = namingConvention.replace('{slug}', placeholderSlug);
  const filePath = path.join(knowledgeBaseDir, fileName);

  if (fs.existsSync(filePath)) {
    return;
  }

  const content = [
    '---',
    'title: Sample Project Experience',
    'role: Lead Developer',
    'company: Example Corp',
    'period: 2024-01 → 2024-06',
    'location: Remote',
    'stack:',
    '  - Node.js',
    '  - React',
    '  - PostgreSQL',
    'impact: >-',
    '  Demonstrated how to capture measurable results within the knowledge base.',
    '---',
    '',
    '## Highlights',
    '',
    '- Built an automated job analysis workflow powered by the Job Search Intelligence System.',
    '- Consolidated experience metrics for quick reference during applications.',
    '- Showcases the preferred structure for future experience entries.',
    ''
  ].join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created sample knowledge base entry: ${filePath}`);
}

function setupJobsDatabase(jobsDir, metadataFileName = 'job-metadata.json') {
  ensureDirectory(jobsDir);

  const metadataPath = path.join(jobsDir, metadataFileName);
  if (fs.existsSync(metadataPath)) {
    try {
      const current = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      current.lastIndexed = new Date().toISOString();
      fs.writeFileSync(metadataPath, JSON.stringify(current, null, 2), 'utf8');
      console.log(`Updated jobs database index timestamp: ${metadataPath}`);
    } catch {
      fs.writeFileSync(
        metadataPath,
        JSON.stringify(createDefaultJobsIndex(), null, 2),
        'utf8'
      );
      console.log(`Rebuilt jobs database index: ${metadataPath}`);
    }
    return;
  }

  fs.writeFileSync(metadataPath, JSON.stringify(createDefaultJobsIndex(), null, 2), 'utf8');
  console.log(`Created jobs database index: ${metadataPath}`);
}

function createDefaultJobsIndex() {
  return {
    lastIndexed: new Date().toISOString(),
    totalTracked: 0,
    entries: []
  };
}

function createCvTemplates(templatesDir) {
  const templates = [
    {
      name: 'cv-template.md',
      content: [
        '---',
        'title: CV Template',
        'role: {{target_role}}',
        'location: {{location}}',
        '---',
        '',
        '## Professional Summary',
        '',
        '{{summary}}',
        '',
        '## Core Strengths',
        '',
        '- {{strength_1}}',
        '- {{strength_2}}',
        '- {{strength_3}}',
        '',
        '## Experience Highlights',
        '',
        '{{experience_bullets}}',
        ''
      ].join('\n')
    },
    {
      name: 'cover-letter-template.md',
      content: [
        '---',
        'title: Cover Letter Template',
        'role: {{target_role}}',
        'company: {{company}}',
        '---',
        '',
        'Dear {{hiring_manager}},',
        '',
        '{{opening_paragraph}}',
        '',
        '{{body_paragraphs}}',
        '',
        'Best regards,',
        '',
        '{{applicant_name}}',
        ''
      ].join('\n')
    }
  ];

  templates.forEach(({ name, content }) => {
    const templatePath = path.join(templatesDir, name);
    if (!fs.existsSync(templatePath)) {
      fs.writeFileSync(templatePath, content, 'utf8');
      console.log(`Created template: ${templatePath}`);
    }
  });
}
