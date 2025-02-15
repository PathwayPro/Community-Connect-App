import { type NetworkingProfile } from '@/features/networking/components/networking-card';
import { COUNTRIES } from '@/shared/lib/constants/networking';

export const skillsList = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'SQL',
  'MongoDB',
  'REST APIs',
  'CI/CD',
  'Git',
  'Agile',
  'Scrum',
  'UI/UX',
  'Figma',
  'Adobe XD',
  'Data Analysis',
  'Machine Learning',
  'Cloud Architecture',
  'DevOps',
  'System Design'
];

export const professions = [
  'Software Architect',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Marketing Director',
  'Frontend Developer',
  'Business Analyst',
  'DevOps Engineer',
  'Content Strategist',
  'Backend Developer',
  'Project Manager',
  'Security Engineer'
];

export const getProfessions = () => {
  return professions.map((profession) => ({
    label: profession,
    value: profession
  }));
};

export const getSkills = () => {
  return skillsList.map((skill) => ({
    label: skill,
    value: skill
  }));
};

export const getCountries = () => {
  return COUNTRIES.map((country) => ({
    label: country.name,
    value: country.name
  }));
};

export const mockNetworkingProfiles: NetworkingProfile[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    company: 'TechForward Solutions',
    bio: 'Building scalable systems with a focus on cloud architecture. Passionate about mentoring junior developers.',
    avatarUrl: '/profile/msnice.png',
    isConnected: false,
    role: 'MENTOR',
    skills: [
      'Cloud Architecture',
      'Kubernetes',
      'System Design',
      'Docker',
      'AWS'
    ],
    profession: 'Software Architect',
    country: 'United States'
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Rodriguez',
    company: 'Innovation Hub',
    bio: 'Leading product strategy with 8+ years of experience in SaaS products. Always eager to connect with fellow product enthusiasts.',
    avatarUrl: '/profile/mrnobody.png',
    isConnected: true,
    role: 'USER',
    skills: ['Agile', 'Scrum', 'UI/UX', 'Product Management'],
    profession: 'Product Manager',
    country: 'Spain'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Thompson',
    company: 'DesignCraft Co',
    bio: 'Creating user-centered designs that bridge business goals with user needs. Advocate for accessible design.',
    avatarUrl: '/profile/msnice.png',
    isConnected: true,
    role: 'MENTOR',
    skills: ['UI/UX', 'Figma', 'Adobe XD', 'Design Systems'],
    profession: 'UX Designer',
    country: 'United Kingdom'
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Patel',
    company: 'DataMinds Analytics',
    bio: 'Leveraging ML and AI to solve complex business problems. Research background in NLP.',
    avatarUrl: '/profile/mra.png',
    isConnected: false,
    role: 'MENTOR',
    skills: ['Machine Learning', 'Python', 'Data Analysis', 'SQL'],
    profession: 'Data Scientist',
    country: 'India'
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Wong',
    company: 'GrowthBase',
    bio: 'Digital marketing strategist specializing in B2B growth. Speaker and workshop facilitator.',
    avatarUrl: '/profile/msnobody.png',
    isConnected: true,
    role: 'USER',
    skills: ['Marketing', 'Content Strategy', 'Analytics', 'Growth Hacking'],
    profession: 'Marketing Director',
    country: 'Singapore'
  },
  {
    id: '6',
    firstName: 'David',
    lastName: 'Kim',
    company: 'WebFlow Interactive',
    bio: 'Crafting beautiful and performant web experiences. React enthusiast and accessibility advocate.',
    avatarUrl: '/profile/mrnice.png',
    isConnected: false,
    role: 'MENTOR',
    skills: ['React', 'TypeScript', 'JavaScript', 'UI/UX'],
    profession: 'Frontend Developer',
    country: 'South Korea'
  },
  {
    id: '7',
    firstName: 'Rachel',
    lastName: 'Martinez',
    company: 'Strategic Solutions Inc',
    bio: 'Bridging technical and business requirements. Certified Scrum Master and CBAP holder.',
    avatarUrl: '/profile/msnice.png',
    isConnected: true,
    role: 'USER',
    skills: ['Business Analysis', 'Agile', 'Scrum', 'Requirements Gathering'],
    profession: 'Business Analyst',
    country: 'Mexico'
  },
  {
    id: '8',
    firstName: 'Thomas',
    lastName: 'Anderson',
    company: 'CloudScale Systems',
    bio: 'Automating everything possible. Kubernetes expert and continuous learning advocate.',
    avatarUrl: '/profile/mrnobody.png',
    isConnected: false,
    role: 'ADMIN',
    skills: ['DevOps', 'Kubernetes', 'Docker', 'CI/CD'],
    profession: 'DevOps Engineer',
    country: 'Germany'
  },
  {
    id: '9',
    firstName: 'Anna',
    lastName: 'Kowalski',
    company: 'ContentFirst Media',
    bio: 'Creating compelling narratives that drive engagement. Former journalist turned content expert.',
    avatarUrl: '/profile/msnice.png',
    isConnected: true,
    role: 'USER',
    skills: ['Content Strategy', 'SEO', 'Social Media', 'Copywriting'],
    profession: 'Content Strategist',
    country: 'Poland'
  },
  {
    id: '10',
    firstName: 'Kevin',
    lastName: 'Zhang',
    company: 'ServerLogic Pro',
    bio: 'Building robust APIs and microservices. Open source contributor and tech community organizer.',
    avatarUrl: '/profile/mrnice.png',
    isConnected: false,
    role: 'MENTOR',
    skills: ['Node.js', 'GraphQL', 'MongoDB', 'REST APIs'],
    profession: 'Backend Developer',
    country: 'China'
  },
  {
    id: '11',
    firstName: 'Nina',
    lastName: 'Patel',
    company: 'Agile Dynamics',
    bio: 'Delivering complex projects on time and within budget. PMP certified with Agile expertise.',
    avatarUrl: '/profile/msnobody.png',
    isConnected: true,
    role: 'USER',
    skills: ['Project Management', 'Agile', 'Scrum', 'Risk Management'],
    profession: 'Project Manager',
    country: 'United Arab Emirates'
  },
  {
    id: '12',
    firstName: 'Robert',
    lastName: 'Lee',
    company: 'CyberShield Security',
    bio: 'Protecting digital assets through innovative security solutions. CISSP certified professional.',
    avatarUrl: '/profile/mra.png',
    isConnected: false,
    role: 'MENTOR',
    skills: ['Security', 'DevOps', 'Cloud Architecture', 'System Design'],
    profession: 'Security Engineer',
    country: 'Canada'
  },
  {
    id: '13',
    firstName: 'Maria',
    lastName: 'Garcia',
    company: 'PixelPerfect Design',
    bio: 'Creating intuitive and beautiful interfaces. Design systems enthusiast and workshop facilitator.',
    avatarUrl: '/profile/msnice.png',
    isConnected: true,
    role: 'MENTOR',
    skills: ['UI/UX', 'Figma', 'Design Systems', 'Adobe XD'],
    profession: 'UX Designer',
    country: 'Brazil'
  },
  {
    id: '14',
    firstName: 'John',
    lastName: 'Murphy',
    company: 'Enterprise Solutions',
    bio: 'Building lasting client relationships and driving business growth. Tech industry veteran.',
    avatarUrl: '/profile/mrnobody.png',
    isConnected: false,
    role: 'USER',
    skills: ['Business Development', 'Strategy', 'Enterprise Sales'],
    profession: 'Business Analyst',
    country: 'Ireland'
  },
  {
    id: '15',
    firstName: 'Sophie',
    lastName: 'Bernard',
    company: 'UserFirst Products',
    bio: 'Combining research and creativity to solve user problems. Advocate for inclusive design.',
    avatarUrl: '/profile/msnice.png',
    isConnected: true,
    role: 'MENTOR',
    skills: ['UI/UX', 'User Research', 'Accessibility', 'Prototyping'],
    profession: 'UX Designer',
    country: 'France'
  },
  {
    id: '16',
    firstName: 'Alex',
    lastName: 'Taylor',
    company: 'CodeCraft Labs',
    bio: 'Building end-to-end solutions with modern tech stack. Love contributing to open source.',
    avatarUrl: '/profile/profile.png',
    isConnected: false,
    role: 'ADMIN',
    skills: ['TypeScript', 'React', 'Node.js', 'GraphQL'],
    profession: 'Frontend Developer',
    country: 'Australia'
  },
  {
    id: '17',
    firstName: 'Olivia',
    lastName: 'Brown',
    company: 'TalentHub Global',
    bio: 'Creating inclusive workplaces and nurturing talent. Certified in DEI practices.',
    avatarUrl: '/profile/msnobody.png',
    isConnected: true,
    role: 'USER',
    skills: ['HR', 'Leadership', 'Talent Development', 'DEI'],
    profession: 'Product Manager',
    country: 'New Zealand'
  },
  {
    id: '18',
    firstName: 'Daniel',
    lastName: 'Wilson',
    company: 'InfraCore Technologies',
    bio: 'Designing scalable infrastructure solutions. Cloud architecture and DevOps enthusiast.',
    avatarUrl: '/profile/mrnice.png',
    isConnected: false,
    role: 'MENTOR',
    skills: ['AWS', 'DevOps', 'Kubernetes', 'System Design'],
    profession: 'DevOps Engineer',
    country: 'Sweden'
  },
  {
    id: '19',
    firstName: 'Emma',
    lastName: 'Davies',
    company: 'FutureScale Digital',
    bio: 'Helping businesses navigate digital transformation. Speaker and consultant.',
    avatarUrl: '/profile/msnice.png',
    isConnected: true,
    role: 'USER',
    skills: ['Digital Strategy', 'Change Management', 'Innovation'],
    profession: 'Business Analyst',
    country: 'Denmark'
  },
  {
    id: '20',
    firstName: 'Marcus',
    lastName: 'Johnson',
    company: 'Neural Dynamics',
    bio: 'Developing AI solutions for real-world problems. Research background in computer vision.',
    avatarUrl: '/profile/mra.png',
    isConnected: false,
    role: 'MENTOR',
    skills: ['Machine Learning', 'Python', 'Computer Vision', 'Data Analysis'],
    profession: 'Data Scientist',
    country: 'Norway'
  }
];
