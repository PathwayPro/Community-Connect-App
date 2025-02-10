import { NewsItem, JobCardProps } from '@/features/news/types';

// Sample data array (showing structure - you'll want to update with real content)
export const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Company Launches New Initiative',
    description:
      'Our company has unveiled an ambitious and groundbreaking sustainability initiative that marks a significant milestone in our commitment to environmental stewardship. The comprehensive program aims to reduce our carbon footprint by an impressive 50% within the next five years through a multi-faceted approach to sustainability and environmental responsibility. The initiative encompasses several key strategic pillars, beginning with a complete transition to renewable energy sources across all our global operations. This includes the installation of solar panels at our major facilities, wind power partnerships in suitable regions, and the implementation of state-of-the-art energy storage solutions to ensure consistent power supply. In addition to energy transformation, we are implementing revolutionary waste reduction protocols that will fundamentally change how we approach resource management. These protocols include the introduction of advanced recycling systems, the elimination of single-use plastics throughout our supply chain, and the development of closed-loop manufacturing processes that minimize waste production. A cornerstone of this initiative is our new partnership program with eco-friendly suppliers, carefully selected based on their demonstrated commitment to sustainable practices and innovative environmental solutions. These partnerships will help create a more sustainable supply chain while encouraging industry-wide adoption of environmentally conscious practices. The initiative also includes a significant investment in employee education and engagement programs, ensuring that sustainability becomes deeply embedded in our corporate culture. We are establishing a dedicated sustainability task force, comprised of representatives from various departments, to oversee the implementation of these changes and monitor our progress toward our ambitious goals. To ensure transparency and accountability, we will be publishing quarterly progress reports and submitting to third-party environmental audits. This initiative represents not just a commitment to environmental responsibility, but a fundamental shift in how we operate as a business, setting new standards for corporate sustainability in our industry.',
    date: 'March 15, 2024',
    imageUrl: '/event/placeholder-2.jpg',
    details:
      'Our company unveils a groundbreaking sustainability initiative aimed at reducing carbon footprint by 50% within the next five years. The program includes transitioning to renewable energy sources, implementing waste reduction protocols, and partnering with eco-friendly suppliers.',
    keywords: ['company-news', 'initiative', 'sustainability'],
    postedAt: 'March 15, 2024',
    postedBy: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Tornado in New York',
    description:
      'A rare tornado touched down in New York City yesterday, causing significant disruption in several neighborhoods. The National Weather Service confirmed an EF-1 tornado with winds up to 100 mph swept through Queens and Brooklyn, damaging buildings and forcing temporary business closures. Emergency services are coordinating recovery efforts.',
    date: 'March 15, 2024',
    imageUrl: '/event/placeholder-2.jpg',
    details:
      'A rare tornado touched down in New York City yesterday, causing significant disruption in several neighborhoods. The National Weather Service confirmed an EF-1 tornado with winds up to 100 mph swept through Queens and Brooklyn, damaging buildings and forcing temporary business closures. Emergency services are coordinating recovery efforts.',
    keywords: ['weather', 'emergency', 'new-york'],
    postedAt: 'March 15, 2024',
    postedBy: 'Sarah Chen'
  }
  // ... add more sample items ...
];

export const sampleResource: NewsItem[] = [
  {
    id: '1',
    title: 'Resume Writing Guide',
    description:
      'Master the art of resume writing with our comprehensive guide. Learn how to highlight your achievements, structure your experience, and use industry-specific keywords effectively. Includes templates, real-world examples, and expert tips for creating ATS-friendly resumes that catch recruiters attention.',
    date: 'March 15, 2024',
    imageUrl: '/resources/invoice.png',
    details:
      'Master the art of resume writing with our comprehensive guide. Learn how to highlight your achievements, structure your experience, and use industry-specific keywords effectively. Includes templates, real-world examples, and expert tips for creating ATS-friendly resumes that catch recruiters attention.',
    keywords: ['career', 'resume', 'job-search'],
    postedAt: 'March 15, 2024',
    postedBy: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Cover Letter Writing Guide',
    description:
      'Transform your cover letters from generic to compelling with our expert writing guide. Discover how to craft personalized introductions, showcase relevant experiences, and create strong closing statements. Features step-by-step instructions, customizable templates, and industry-specific examples to help you stand out.',
    date: 'March 15, 2024',
    imageUrl: '/resources/linkedin.png',
    details:
      'Transform your cover letters from generic to compelling with our expert writing guide. Discover how to craft personalized introductions, showcase relevant experiences, and create strong closing statements. Features step-by-step instructions, customizable templates, and industry-specific examples to help you stand out.',
    keywords: ['career', 'cover-letter', 'job-search'],
    postedAt: 'March 15, 2024',
    postedBy: 'Sarah Chen'
  }
];

export const sampleOpportunity: JobCardProps[] = [
  {
    id: '1',
    companyName: 'Google',
    companyLogo: '/opportunities/google.png',
    jobTitle: 'Software Engineer',
    experience: '1-3 years',
    location: 'San Francisco, CA',
    salaryRange: '$60,000 - $80,000',
    jobType: 'Remote',
    jobDescription: `We're seeking a talented Software Engineer to join our dynamic engineering team. In this role, you'll contribute to building and maintaining scalable software solutions that power our core products and services.
  
  Key Responsibilities:
  • Design, develop, and maintain high-quality software applications using modern technologies and best practices
  • Collaborate with cross-functional teams to define, design, and ship new features
  • Write clean, maintainable, and efficient code following our development standards
  • Participate in code reviews and provide constructive feedback to other developers
  • Debug production issues and implement fixes
  • Optimize applications for maximum speed and scalability
  • Stay up-to-date with emerging technologies and industry trends
  
  Requirements:
  • 1-3 years of professional software development experience
  • Strong proficiency in modern JavaScript/TypeScript and related frameworks (React, Node.js)
  • Experience with RESTful APIs and microservices architecture
  • Solid understanding of computer science fundamentals and software engineering principles
  • Familiarity with version control systems (Git) and CI/CD pipelines
  • Bachelor's degree in Computer Science or related field (or equivalent practical experience)
  • Strong problem-solving skills and attention to detail
  
  Nice to Have:
  • Experience with cloud platforms (AWS, GCP, or Azure)
  • Knowledge of containerization technologies (Docker, Kubernetes)
  • Contributions to open-source projects
  • Experience with agile development methodologies
  
  What We Offer:
  • Competitive salary and equity package
  • Comprehensive health, dental, and vision insurance
  • Flexible PTO policy and remote work options
  • Professional development budget
  • Modern tech stack and tools
  • Collaborative and inclusive work environment
  • Regular team events and activities
  
  Join us in building the next generation of innovative solutions while working alongside talented individuals who are passionate about technology and making a difference.`,
    onApply: () => {},
    onLearnMore: () => {}
  },
  {
    id: '2',
    companyName: 'Apple',
    companyLogo: '/opportunities/apple.png',
    jobTitle: 'Software Engineer',
    experience: '1-3 years',
    location: 'San Francisco, CA',
    salaryRange: '$60,000 - $80,000',
    jobDescription: `We're seeking a talented Software Engineer to join our dynamic engineering team. In this role, you'll contribute to building and maintaining scalable software solutions that power our core products and services.
  
    Key Responsibilities:
    • Design, develop, and maintain high-quality software applications using modern technologies and best practices
    • Collaborate with cross-functional teams to define, design, and ship new features
    • Write clean, maintainable, and efficient code following our development standards
    • Participate in code reviews and provide constructive feedback to other developers
    • Debug production issues and implement fixes
    • Optimize applications for maximum speed and scalability
    • Stay up-to-date with emerging technologies and industry trends
    
    Requirements:
    • 1-3 years of professional software development experience
    • Strong proficiency in modern JavaScript/TypeScript and related frameworks (React, Node.js)
    • Experience with RESTful APIs and microservices architecture
    • Solid understanding of computer science fundamentals and software engineering principles
    • Familiarity with version control systems (Git) and CI/CD pipelines
    • Bachelor's degree in Computer Science or related field (or equivalent practical experience)
    • Strong problem-solving skills and attention to detail
    
    Nice to Have:
    • Experience with cloud platforms (AWS, GCP, or Azure)
    • Knowledge of containerization technologies (Docker, Kubernetes)
    • Contributions to open-source projects
    • Experience with agile development methodologies
    
    What We Offer:
    • Competitive salary and equity package
    • Comprehensive health, dental, and vision insurance
    • Flexible PTO policy and remote work options
    • Professional development budget
    • Modern tech stack and tools
    • Collaborative and inclusive work environment
    • Regular team events and activities
    
    Join us in building the next generation of innovative solutions while working alongside talented individuals who are passionate about technology and making a difference.`,

    jobType: 'Remote',
    onApply: () => {},
    onLearnMore: () => {}
  },
  {
    id: '3',
    companyName: 'ChatGPT',
    companyLogo: '/opportunities/chatgpt.png',
    jobTitle: 'Software Engineer',
    experience: '1-3 years',
    location: 'San Francisco, CA',
    salaryRange: '$60,000 - $80,000',
    jobType: 'Remote',
    jobDescription: `We're seeking a talented Software Engineer to join our dynamic engineering team. In this role, you'll contribute to building and maintaining scalable software solutions that power our core products and services.
  
  Key Responsibilities:
  • Design, develop, and maintain high-quality software applications using modern technologies and best practices
  • Collaborate with cross-functional teams to define, design, and ship new features
  • Write clean, maintainable, and efficient code following our development standards
  • Participate in code reviews and provide constructive feedback to other developers
  • Debug production issues and implement fixes
  • Optimize applications for maximum speed and scalability
  • Stay up-to-date with emerging technologies and industry trends
  
  Requirements:
  • 1-3 years of professional software development experience
  • Strong proficiency in modern JavaScript/TypeScript and related frameworks (React, Node.js)
  • Experience with RESTful APIs and microservices architecture
  • Solid understanding of computer science fundamentals and software engineering principles
  • Familiarity with version control systems (Git) and CI/CD pipelines
  • Bachelor's degree in Computer Science or related field (or equivalent practical experience)
  • Strong problem-solving skills and attention to detail
  
  Nice to Have:
  • Experience with cloud platforms (AWS, GCP, or Azure)
  • Knowledge of containerization technologies (Docker, Kubernetes)
  • Contributions to open-source projects
  • Experience with agile development methodologies
  
  What We Offer:
  • Competitive salary and equity package
  • Comprehensive health, dental, and vision insurance
  • Flexible PTO policy and remote work options
  • Professional development budget
  • Modern tech stack and tools
  • Collaborative and inclusive work environment
  • Regular team events and activities
  
  Join us in building the next generation of innovative solutions while working alongside talented individuals who are passionate about technology and making a difference.`,
    onApply: () => {}
  },
  {
    id: '4',
    companyName: 'GitHub',
    companyLogo: '/opportunities/github.png',
    jobTitle: 'Software Engineer',
    experience: '1-3 years',
    location: 'San Francisco, CA',
    salaryRange: '$60,000 - $80,000',
    jobDescription: `We're seeking a talented Software Engineer to join our dynamic engineering team. In this role, you'll contribute to building and maintaining scalable software solutions that power our core products and services.
  
  Key Responsibilities:
  • Design, develop, and maintain high-quality software applications using modern technologies and best practices
  • Collaborate with cross-functional teams to define, design, and ship new features
  • Write clean, maintainable, and efficient code following our development standards
  • Participate in code reviews and provide constructive feedback to other developers
  • Debug production issues and implement fixes
  • Optimize applications for maximum speed and scalability
  • Stay up-to-date with emerging technologies and industry trends
  
  Requirements:
  • 1-3 years of professional software development experience
  • Strong proficiency in modern JavaScript/TypeScript and related frameworks (React, Node.js)
  • Experience with RESTful APIs and microservices architecture
  • Solid understanding of computer science fundamentals and software engineering principles
  • Familiarity with version control systems (Git) and CI/CD pipelines
  • Bachelor's degree in Computer Science or related field (or equivalent practical experience)
  • Strong problem-solving skills and attention to detail
  
  Nice to Have:
  • Experience with cloud platforms (AWS, GCP, or Azure)
  • Knowledge of containerization technologies (Docker, Kubernetes)
  • Contributions to open-source projects
  • Experience with agile development methodologies
  
  What We Offer:
  • Competitive salary and equity package
  • Comprehensive health, dental, and vision insurance
  • Flexible PTO policy and remote work options
  • Professional development budget
  • Modern tech stack and tools
  • Collaborative and inclusive work environment
  • Regular team events and activities
  
  Join us in building the next generation of innovative solutions while working alongside talented individuals who are passionate about technology and making a difference.`,
    jobType: 'Remote',
    onApply: () => {}
  }
];
