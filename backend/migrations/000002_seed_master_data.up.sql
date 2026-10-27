-- 1. COUNTRIES
INSERT INTO countries (code, name, is_active) VALUES
    ('JP', 'Jepang', TRUE),
    ('DE', 'Jerman', FALSE),
    ('SG', 'Singapura', FALSE)
ON CONFLICT (code) DO NOTHING;

-- 2. CAREER PATHS
INSERT INTO career_paths (slug, label, description) VALUES
    (
        'backend',
        'Backend Engineer',
        'Kuasai arsitektur backend scalable, database engineering, API design, dan microservices untuk pasar teknologi global.'
    ),
    (
        'frontend',
        'Frontend Engineer',
        'Bangun antarmuka web modern, responsive, performant, dan interaktif dengan ekosistem modern web apps.'
    ),
    (
        'devops',
        'DevOps & Cloud Engineer',
        'Kuasai otomatisasi CI/CD, kontainerisasi, orkestrasi Kubernetes, dan infrastruktur cloud kelas enterprise.'
    ),
    (
        'fullstack',
        'Fullstack Engineer',
        'Kombinasi komprehensif frontend modern dan backend tangguh untuk delivery end-to-end product engineering.'
    ),
    (
        'product_engineer',
        'Product Engineer',
        'Fokus pada rekayasa produk digital dari ide hingga produksi dengan fokus UX, performa, dan iterasi cepat.'
    ),
    (
        'solutions_architect',
        'Solutions Architect',
        'Rancang arsitektur sistem skala besar, distributed computing, reliability, dan integrasi multi-platform.'
    )
ON CONFLICT (slug) DO NOTHING;

-- 3. TECH STACKS
INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active) VALUES
    (NULL, 'web_fundamental', 'Web Fundamental (HTML/CSS/JS)', 'Foundation', TRUE),
    (NULL, 'cs_fundamental', 'Computer Science & Algorithm', 'Foundation', TRUE),
ON CONFLICT (slug) DO NOTHING;

-- Backend Stacks
INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'golang', 'Go (Gin & GORM)', 'Recommended', TRUE 
FROM career_paths WHERE slug = 'backend'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'java', 'Java (Spring Boot)', 'Enterprise', FALSE 
FROM career_paths WHERE slug = 'backend'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'node', 'Node.js (Express & NestJS)', 'Popular', FALSE 
FROM career_paths WHERE slug = 'backend'
ON CONFLICT (slug) DO NOTHING;

-- Frontend Stacks
INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'react', 'React & Next.js', 'Recommended', TRUE 
FROM career_paths WHERE slug = 'frontend'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'vue', 'Vue.js & Nuxt', 'Popular', FALSE 
FROM career_paths WHERE slug = 'frontend'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'svelte', 'Svelte & SvelteKit', 'Modern', FALSE 
FROM career_paths WHERE slug = 'frontend'
ON CONFLICT (slug) DO NOTHING;

-- DevOps Stacks
INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'devops_aws', 'AWS & Kubernetes', 'Cloud Native', TRUE 
FROM career_paths WHERE slug = 'devops'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tech_stacks (career_path_id, slug, label, badge, is_active)
SELECT id, 'devops_gcp', 'GCP & Terraform', 'Cloud', FALSE 
FROM career_paths WHERE slug = 'devops'
ON CONFLICT (slug) DO NOTHING;

