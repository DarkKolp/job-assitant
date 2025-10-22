# Job Search Intelligence System

A comprehensive job search intelligence system that maintains your professional knowledge base, analyzes job opportunities against your profile, assists with tailored applications, and tracks your entire job search pipeline with evidence-based decision making.

## Overview

This module provides:

- **Knowledge Base Management**: Document your professional experiences with evidence-based entries
- **Opportunity Analysis**: Analyze job postings and rate them against your profile (Tier 1-5)
- **Application Assistance**: Tailor CVs and cover letters for specific opportunities (placeholder - needs configuration)
- **Pipeline Tracking**: Systematic organization of all job opportunities in structured folders
- **Data-Driven Decisions**: Match scores, tier ratings, and strategic recommendations

## Installation

```bash
bmad install job-agent
```

Or manually load from: `bmad/agents/job-agent/`

## Components

### Agents (3)

#### 1. Alex - Job Search Intelligence Orchestrator
**Type**: Module agent (Entry point)
**Location**: `agents/alex.md`
**Purpose**: Orchestrates your entire job search process

**Modes:**
1. **Record Entry** (`*new`) - Create new experience entries in knowledge base
2. **Review KB** (`*review [path]`) - Review knowledge base and identify improvements
3. **Open Questions** (`*questions`) - Conversational review of all unanswered questions across KB
4. **Update KB** (`*update [path]`) - Apply specific updates to entries
5. **Analyze Job** (`*analyze [url|file]`) - Analyze opportunity and rate against profile
6. **Apply** (`*apply [job-id]`) - Generate tailored application materials (PLACEHOLDER)

#### 2. Job Analyzer (Planned)
**Type**: Expert agent
**Purpose**: Specialized job opportunity analysis

#### 3. Application Assistant (Placeholder)
**Type**: Expert agent
**Purpose**: CV and cover letter generation (needs CV structure configuration)

### Workflows (5)

#### 1. analyze-opportunity ✅
**Type**: Action workflow
**Status**: Fully functional
**Purpose**: Extract job description, analyze match, create job folder, rate tier

**Process:**
1. Capture job posting (URL/text/file)
2. Extract and parse job description
3. Load knowledge base
4. Calculate match score
5. Determine tier rating (1-5)
6. Create job folder with metadata
7. Generate analysis with recommendations
8. Auto-trigger application workflow for Tier 1-2

**Usage:**
```
*analyze https://job-posting-url
```

#### 2. apply-to-job ⚠️
**Type**: Document workflow
**Status**: Placeholder - Needs CV configuration
**Purpose**: Generate tailored application materials

#### 3. review-knowledge-base (Planned)
**Type**: Interactive workflow
**Purpose**: Scan KB, identify gaps, elicit improvements

#### 4. track-application (Planned)
**Type**: Action workflow
**Purpose**: Update status, log correspondence

#### 5. generate-job-report (Planned)
**Type**: Document workflow
**Purpose**: Summary statistics and action items

### Tasks (3)

1. **calculate-match-score** - Score job against KB
2. **extract-job-description** - Parse JD from various sources
3. **update-job-metadata** - Quick metadata updates

## Quick Start

### 1. Load Alex

Load the agent from: `bmad/agents/job-agent/agents/alex.md`

### 2. View Available Commands

```
*help
```

### 3. Document Your First Experience

```
*new
```

Alex will guide you through creating an evidence-based knowledge base entry.

### 4. Analyze a Job Opportunity

```
*analyze https://linkedin.com/jobs/view/12345
```

or paste the job description text when prompted.

### 5. Address Open Questions

```
*questions
```

Alex will guide you through all unanswered questions in your knowledge base with a conversational, psychologist-like approach. He'll provide context for each question and update entries as you answer.

### 6. Review Analysis

Check the generated files in `Jobs/{niche}_{job_title}/`:
- `job-metadata.json` - Structured data with tier rating
- `job-description.md` - Full job posting
- `analysis.md` - Match analysis and recommendations

## Module Structure

```
bmad/agents/job-agent/
├── agents/
│   ├── alex.md                      # Main orchestrator agent
│   └── alex-sidecar/
│       ├── instructions.md          # Shared instructions for all modes
│       └── memories.md              # Persistent context
├── workflows/
│   └── analyze-opportunity/
│       ├── workflow.yaml            # Workflow configuration
│       ├── instructions.md          # 12-step analysis process
│       └── checklist.md             # Validation checklist
├── tasks/                           # Utility tasks (planned)
├── templates/                       # CV and cover letter templates (to configure)
├── data/                            # Module data files
├── config.yaml                      # Module configuration
├── README.md                        # This file
└── _module-installer/               # Installation infrastructure
    ├── install-module-config.yaml
    └── installer.js
```

## Configuration

The module can be configured in `bmad/agents/job-agent/config.yaml`

### Key Settings:

```yaml
knowledge_base:
  location: "/Volumes/External/Obsidian/Job-Seeking/Job-Seeking/About-me/Projects"
  naming_convention: "exp_{slug}.md"

jobs_database:
  location: "/Volumes/External/Obsidian/Job-Seeking/Job-Seeking/Jobs"
  naming_convention: "{niche}_{job_title}"

tier_system:
  tier_1: "Perfect fit - 85%+"
  tier_2: "Strong candidate - 70-84%"
  tier_3: "Reach - 55-69%"
  tier_4: "Stretch - 40-54%"
  tier_5: "Mismatch - <40%"
```

## Tier Rating System

Jobs are rated on a 5-tier scale based on match against your knowledge base:

- **Tier 1** (85%+): Perfect fit - Apply immediately
- **Tier 2** (70-84%): Strong match - Worth applying
- **Tier 3** (55-69%): Reach - Consider if aligned with goals
- **Tier 4** (40-54%): Stretch - Probably skip unless strategic
- **Tier 5** (<40%): Mismatch - Don't waste time

### Match Calculation

```
must_have_match = matched_must_haves / total_must_haves
nice_to_have_match = matched_nice_to_haves / total_nice_to_haves

match_score = (must_have_match * 70%) + (nice_to_have_match * 30%)

# Boosted by:
+ Recent experience (within 2 years): +5%
+ [Delivered] status: +3% per relevant project
+ Direct domain match: +5%
```

## Folder Structure

### Knowledge Base
```
About-me/Projects/
├── exp_blockchain-platform.md
├── exp_microservices-migration.md
└── exp_data-pipeline.md
```

### Jobs Database
```
Jobs/
└── backend_senior-go-developer/
    ├── job-metadata.json          # Structured data
    ├── job-description.md         # Full JD
    ├── analysis.md                # Match analysis
    ├── application/               # (created by apply workflow)
    │   ├── cv-tailored.md
    │   ├── cover-letter.md
    │   └── interview-prep.md
    └── correspondence/            # Email threads
```

## Examples

### Example 1: Document a New Experience

```
*new
> Paste the whitepaper/project document

Alex extracts:
- Organization, role, dates
- Technologies used
- Outcomes achieved
- Evidence citations

Saves to: About-me/Projects/exp_{slug}.md
```

### Example 2: Analyze Job Opportunity

```
*analyze https://company.com/careers/senior-backend-engineer

Alex:
1. Fetches job posting
2. Extracts requirements
3. Loads your KB entries
4. Calculates match score: 82%
5. Assigns Tier 2 rating
6. Creates Jobs/backend_senior-backend-engineer/
7. Generates analysis with recommendations
8. Asks: "Strong match! Apply now?"
```

### Example 3: Address Open Questions

```
*questions

━━━━━━━━━━━━━━━━━━━━━━
Open Questions Session
━━━━━━━━━━━━━━━━━━━━━━

I found 5 open questions across your knowledge base.
Let's work through them together.

[Question 1/5] - From: Blockchain Platform Project

I'm curious about your blockchain platform work...
You mentioned implementing a consensus mechanism, but we don't have
details on which type you used or why. Walk me through that decision?

> We used Proof of Stake because it was more energy efficient...

✓ Got it - updated exp_blockchain-platform

[Question 2/5] - From: Microservices Migration

Looking at the migration project, I noticed we don't have clarity on
the team size. How many people were involved in this initiative?

> 8 people total - 5 developers, 2 DevOps, 1 architect

✓ Got it - updated exp_microservices-migration

...

Session complete: 4/5 questions resolved. 1 remaining.
```

### Example 4: Review Knowledge Base

```
*review

Alex:
1. Scans About-me/Projects/
2. Identifies gaps and weak evidence
3. Suggests improvements
4. Starts elicitation session
5. Updates entries
```

## Development Roadmap

### Phase 1: Core Functionality ✅
- [x] Alex orchestrator agent
- [x] analyze-opportunity workflow
- [x] Knowledge base management (record, review, update)
- [x] Job folder structure
- [x] Tier rating system
- [x] Match calculation algorithm

### Phase 2: Enhanced Features
- [ ] Job Analyzer specialized agent
- [ ] Application Assistant (needs CV configuration)
- [ ] review-knowledge-base workflow
- [ ] track-application workflow
- [ ] generate-job-report workflow
- [ ] Elicitation integration

### Phase 3: Polish and Integration
- [ ] Interview Coach agent
- [ ] Salary Negotiator agent
- [ ] CV template system
- [ ] Cover letter generator
- [ ] Interview prep automation
- [ ] Pipeline analytics dashboard

## Quick Commands

### Create New Agent
```
workflow create-agent
```

### Create New Workflow
```
workflow create-workflow
```

### Load Module Config
```
Read: bmad/agents/job-agent/config.yaml
```

## Configuring Application Assistant

The Application Assistant is currently a placeholder. To configure it:

1. Create CV template: `templates/cv-template.md`
2. Create config: `data/cv-config.yaml`
3. Define section mappings and formatting rules
4. Test with sample job

See `agents/alex-sidecar/instructions.md` (Apply Mode section) for detailed configuration guide.

## Notes

- **Evidence-Based**: All KB entries must cite sources
- **Honest Assessment**: No inflating accomplishments
- **Data-Driven**: Decisions based on match scores
- **Systematic**: Everything tracked and organized
- **Pragmatic**: Focus on best-fit opportunities

## Contributing

To extend this module:

1. Add new agents using `create-agent` workflow
2. Add new workflows using `create-workflow` workflow
3. Update config.yaml with new components
4. Document in this README

## Author

Created by Nuno (Synapse) on 2025-10-21

## Version

1.0.0 - Initial release with core functionality
