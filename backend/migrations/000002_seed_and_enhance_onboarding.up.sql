ALTER TABLE countries 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS badge VARCHAR(50) DEFAULT 'Active';

ALTER TABLE career_paths 
ADD COLUMN IF NOT EXISTS stacks JSONB;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS primary_stack VARCHAR(50);

INSERT INTO countries (code, name, flag_emoji, is_active, badge, visa_info, salary_range, work_culture)
VALUES 
(
    'JP',
    'Japan',
    '🇯🇵',
    TRUE,
    'Jalur Aktif',
    '{
        "type": "Engineer / Specialist in Humanities",
        "difficulty": "Moderate",
        "language_req": "JLPT N3 - N2 recommended (English-first startups exist in Tokyo)",
        "key_benefit": "Fast-track permanent residency via Highly Skilled Professional (HSP) point system",
        "processing_time": "1 - 3 months after COE issuance"
    }'::jsonb,
    '{
        "currency": "JPY",
        "junior": "¥4,000,000 - ¥6,000,000",
        "mid": "¥6,000,000 - ¥9,000,000",
        "senior": "¥9,000,000 - ¥14,000,000",
        "idr_approx": "Rp 420jt - Rp 1.5M / tahun"
    }'::jsonb,
    'High craftsmanship and engineering discipline. Modern international startups in Tokyo (Shibuya/Roppongi) embrace English and hybrid working.'
),
(
    'DE',
    'Germany',
    '🇩🇪',
    FALSE,
    'Coming Soon',
    '{
        "type": "EU Blue Card / IT Specialist Visa",
        "difficulty": "Accessible",
        "language_req": "English-first in tech (B1 German for PR)",
        "key_benefit": "30 days paid vacation, PR in 21-27 months",
        "processing_time": "1 - 2 months"
    }'::jsonb,
    '{
        "currency": "EUR",
        "junior": "€48,000 - €60,000",
        "mid": "€60,000 - €80,000",
        "senior": "€80,000 - €110,000",
        "idr_approx": "Rp 850jt - Rp 1.9M / tahun"
    }'::jsonb,
    'Feierabend (strict work-life balance), direct asynchronous communication, Berlin international tech hub.'
),
(
    'SG',
    'Singapore',
    '🇸🇬',
    FALSE,
    'Coming Soon',
    '{
        "type": "Employment Pass (COMPASS Point System)",
        "difficulty": "Competitive",
        "language_req": "Fluent Professional English",
        "key_benefit": "Lowest personal income tax (0-22%), 1h 45m flight to Jakarta",
        "processing_time": "3 - 8 weeks"
    }'::jsonb,
    '{
        "currency": "SGD",
        "junior": "S$60,000 - S$85,000",
        "mid": "S$85,000 - S$130,000",
        "senior": "S$130,000 - S$180,000",
        "idr_approx": "Rp 700jt - Rp 2.1M / tahun"
    }'::jsonb,
    'Fast-paced APAC regional headquarters, high compensation, intense meritocracy.'
)
ON CONFLICT (code) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    badge = EXCLUDED.badge,
    visa_info = EXCLUDED.visa_info,
    salary_range = EXCLUDED.salary_range,
    work_culture = EXCLUDED.work_culture;

INSERT INTO career_paths (slug, label, description, stacks)
VALUES 
(
    'backend',
    'Backend Engineer',
    'Master microservices, high-concurrency systems, and cloud architectures for high-scale global applications.',
    '[
        {"slug": "golang", "label": "Go (Gin Framework)", "is_active": true, "badge": "High Demand Tokyo"},
        {"slug": "java", "label": "Java (Spring Boot)", "is_active": false, "badge": "Coming Soon"},
        {"slug": "node", "label": "Node.js (Express)", "is_active": false, "badge": "Coming Soon"}
    ]'::jsonb
),
(
    'frontend',
    'Frontend Engineer',
    'Craft high-performance, responsive web interfaces with modern UI engineering standards.',
    '[
        {"slug": "react", "label": "React", "is_active": true, "badge": "Tokyo Standard"},
        {"slug": "vue", "label": "Vue.js", "is_active": false, "badge": "Coming Soon"},
        {"slug": "svelte", "label": "Svelte", "is_active": false, "badge": "Coming Soon"}
    ]'::jsonb
),
(
    'devops',
    'Cloud & DevOps Engineer',
    'Automate and scale cloud-native infrastructure with Docker, Kubernetes, Terraform, and cloud platforms.',
    '[
        {"slug": "devops_aws", "label": "AWS Cloud Native", "is_active": true, "badge": "Highest Salary Tokyo"},
        {"slug": "devops_gcp", "label": "GCP Cloud Native", "is_active": false, "badge": "Coming Soon"},
        {"slug": "devops_terraform", "label": "Terraform & GitOps", "is_active": false, "badge": "Coming Soon"}
    ]'::jsonb
),
(
    'fullstack',
    'Fullstack & Cloud Engineer',
    'Bridge end-to-end product delivery combining reactive frontends, robust backend APIs, and cloud infrastructure.',
    '[
        {"slug": "react_golang", "label": "React + Go (Gin) + AWS", "is_active": true, "badge": "High Demand Tokyo"},
        {"slug": "react_node", "label": "React + Node (Express) + AWS", "is_active": false, "badge": "Coming Soon"}
    ]'::jsonb
),
(
    'product_engineer',
    'Product Engineer',
    'Drive product development from UI to data layer with rapid iteration, modern API/AI integration, and product sense.',
    '[
        {"slug": "product_fullstack", "label": "Fullstack Product Delivery", "is_active": false, "badge": "Coming Soon"}
    ]'::jsonb
),
(
    'solutions_architect',
    'Solutions Architect',
    'Design enterprise-scale cloud architectures, multi-system integrations, and global technical blueprints.',
    '[
        {"slug": "cloud_architecture", "label": "Enterprise Cloud Architecture", "is_active": false, "badge": "Coming Soon"}
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    stacks = EXCLUDED.stacks;
