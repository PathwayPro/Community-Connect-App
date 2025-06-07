-- Add initial Interests
INSERT INTO "Interests" (id, name) VALUES (1, 'Frontend Development');
INSERT INTO "Interests" (id, name) VALUES (2, 'Backend Development');
INSERT INTO "Interests" (id, name) VALUES (3, 'Full-Stack Development');
INSERT INTO "Interests" (id, name) VALUES (4, 'Mobile App Development (iOS/Android)');
INSERT INTO "Interests" (id, name) VALUES (5, 'Game Development');
INSERT INTO "Interests" (id, name) VALUES (6, 'Cybersecurity');
INSERT INTO "Interests" (id, name) VALUES (7, 'Data and analytics');
INSERT INTO "Interests" (id, name) VALUES (8, 'Product Management');
INSERT INTO "Interests" (id, name) VALUES (9, 'Program/Project Management');
INSERT INTO "Interests" (id, name) VALUES (10, 'Agile Coaching');
INSERT INTO "Interests" (id, name) VALUES (11, 'Artificial Intelligence');
INSERT INTO "Interests" (id, name) VALUES (12, 'Quality Assurance and Testing');
INSERT INTO "Interests" (id, name) VALUES (13, 'Venture Capital/Investments');
INSERT INTO "Interests" (id, name) VALUES (14, 'Startup Advisory');
INSERT INTO "Interests" (id, name) VALUES (15, 'Networking and IT');
INSERT INTO "Interests" (id, name) VALUES (16, 'Leadership');
INSERT INTO "Interests" (id, name) VALUES (17, 'Career Transition');
INSERT INTO "Interests" (id, name) VALUES (18, 'Career Coaching');

-- Add initial Skills
INSERT INTO "Skills" (id, name) VALUES (1, 'JavaScript');
INSERT INTO "Skills" (id, name) VALUES (2, 'TypeScript');
INSERT INTO "Skills" (id, name) VALUES (3, 'React');
INSERT INTO "Skills" (id, name) VALUES (4, 'Node.js');
INSERT INTO "Skills" (id, name) VALUES (5, 'Python');
INSERT INTO "Skills" (id, name) VALUES (6, 'Java');
INSERT INTO "Skills" (id, name) VALUES (7, 'C#');
INSERT INTO "Skills" (id, name) VALUES (8, 'SQL');
INSERT INTO "Skills" (id, name) VALUES (9, 'AWS');
INSERT INTO "Skills" (id, name) VALUES (10, 'Docker');
INSERT INTO "Skills" (id, name) VALUES (11, 'Kubernetes');
INSERT INTO "Skills" (id, name) VALUES (12, 'DevOps');
INSERT INTO "Skills" (id, name) VALUES (13, 'UI/UX Design');
INSERT INTO "Skills" (id, name) VALUES (14, 'Project Management');
INSERT INTO "Skills" (id, name) VALUES (15, 'Agile');

-- Add initial SalaryRanges
INSERT INTO "SalaryRanges" (id, "from", "to") VALUES (1,20000,50000);
INSERT INTO "SalaryRanges" (id, "from", "to") VALUES (2,50000,100000);
INSERT INTO "SalaryRanges" (id, "from", "to") VALUES (3,100000,150000);

-- Add initial EventsCategories
INSERT INTO "EventsCategories" (id, name) VALUES (1, 'WORKSHOP');
INSERT INTO "EventsCategories" (id, name) VALUES (2, 'MENTORSHIP');
INSERT INTO "EventsCategories" (id, name) VALUES (3, 'NETWORKING');
INSERT INTO "EventsCategories" (id, name) VALUES (4, 'OTHER');