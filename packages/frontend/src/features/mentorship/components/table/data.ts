import { MentorshipAdmin, RatingsGroup } from '../../types';

export type Mentee = {
  id: string;
  identity: {
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  profession: string;
};

export type Sessions = {
  id: string;
  identity: {
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  profession: string;
};

export interface MentorRating {
  id: string;
  identity: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
  experience: string;
  review?: string;
  profession: string;
  email: string;
  lastSession?: string;
  ratings?: number;
  ratingsGroup?: RatingsGroup;
}

export const menteesData: Mentee[] = [
  {
    id: '728ed52f',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    date: '2024-01-01',
    profession: 'Software Engineer'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com'
    },
    date: '2024-01-02',
    profession: 'Product Manager'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'FranK',
      lastName: 'Doe',
      email: 'fran@example.com'
    },
    date: '2024-01-02',
    profession: 'UX Designer'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Jones',
      lastName: 'Doe',
      email: 'jones@example.com'
    },
    date: '2024-01-02',
    profession: 'QA Engineer'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Liberty',
      lastName: 'Doe',
      email: 'liberty@example.com'
    },
    date: '2024-01-02',
    profession: 'Business Analyst'
  }
];

export const mentorshipAdminData: MentorshipAdmin[] = [
  {
    id: '728ed52f',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'John',
      lastName: 'Smith'
    },
    experience: '12 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Software Architect',
    email: 'john.smith@example.com',
    status: 'Approved',
    capacity: '8',
    availability: '10 hours/week',
    lastSession: 'Jan 15, 2024',
    sessionsBooked: 5,
    ratings: 4
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Sarah',
      lastName: 'Johnson'
    },
    experience: '8 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Data Scientist',
    email: 'sarah.j@example.com',
    status: 'Pending',
    capacity: '6',
    availability: '8 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 3
  },
  {
    id: 'a45b9c23',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Michael',
      lastName: 'Chen'
    },
    experience: '15 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'DevOps Engineer',
    email: 'm.chen@example.com',
    status: 'Approved',
    capacity: '10',
    availability: '12 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  },
  {
    id: 'b67d2e14',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Emma',
      lastName: 'Wilson'
    },
    experience: '6 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'UX Designer',
    email: 'emma.w@example.com',
    status: 'Rejected',
    capacity: '4',
    availability: '6 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 2
  },
  {
    id: 'c89f3g25',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'David',
      lastName: 'Garcia'
    },
    experience: '10 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Product Manager',
    email: 'd.garcia@example.com',
    status: 'Approved',
    capacity: '8',
    availability: '10 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  },
  {
    id: 'd12h4i36',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Lisa',
      lastName: 'Taylor'
    },
    experience: '7 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Frontend Developer',
    email: 'lisa.t@example.com',
    status: 'Pending',
    capacity: '6',
    availability: '8 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 2
  },
  {
    id: 'e34j5k47',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'James',
      lastName: 'Anderson'
    },
    experience: '9 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Backend Developer',
    email: 'j.anderson@example.com',
    status: 'Approved',
    capacity: '8',
    availability: '10 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  },
  {
    id: 'f56l7m58',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Maria',
      lastName: 'Rodriguez'
    },
    experience: '11 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'System Architect',
    email: 'm.rodriguez@example.com',
    status: 'Pending',
    capacity: '10',
    availability: '12 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 5
  },
  {
    id: 'g78n9p69',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Robert',
      lastName: 'Kim'
    },
    experience: '13 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Cloud Engineer',
    email: 'r.kim@example.com',
    status: 'Approved',
    capacity: '12',
    availability: '14 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  },
  {
    id: 'h90q1r70',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Anna',
      lastName: 'Martinez'
    },
    experience: '5 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Mobile Developer',
    email: 'a.martinez@example.com',
    status: 'Rejected',
    capacity: '4',
    availability: '6 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 2
  },
  {
    id: 'i12s3t81',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Thomas',
      lastName: 'Brown'
    },
    experience: '14 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Security Engineer',
    email: 't.brown@example.com',
    status: 'Approved',
    capacity: '10',
    availability: '12 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  },
  {
    id: 'j34u5v92',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Sophie',
      lastName: 'Lee'
    },
    experience: '8 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'ML Engineer',
    email: 's.lee@example.com',
    status: 'Pending',
    capacity: '6',
    availability: '8 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 5
  },
  {
    id: 'k56w7x03',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Daniel',
      lastName: 'White'
    },
    experience: '6 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'QA Engineer',
    email: 'd.white@example.com',
    status: 'Approved',
    capacity: '4',
    availability: '6 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  },
  {
    id: 'l78y9z14',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Rachel',
      lastName: 'Clark'
    },
    experience: '9 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Technical Lead',
    email: 'r.clark@example.com',
    status: 'Pending',
    capacity: '6',
    availability: '8 hours/week',
    lastSession: 'Jan 18, 2024',
    sessionsBooked: 3,
    ratings: 2
  },
  {
    id: 'm90a1b25',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Kevin',
      lastName: 'Patel'
    },
    experience: '7 years',
    experienceDescription:
      'Led multiple teams across various projects, mentored junior developers, and implemented enterprise-scale solutions.',
    profession: 'Blockchain Developer',
    email: 'k.patel@example.com',
    status: 'Approved',
    capacity: '6',
    availability: '8 hours/week',
    lastSession: 'Jan 20, 2024',
    sessionsBooked: 8,
    ratings: 4
  }
];

export const mentorRatingData: MentorRating[] = [
  {
    id: 'm1',
    identity: {
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      firstName: 'Sarah',
      lastName: 'Chen'
    },
    experience: '8',
    review:
      'Exceptional mentor who helped me transition into a senior role. Great at explaining complex system design concepts.',
    profession: 'Senior Software Architect',
    email: 'sarah.chen@techmail.com',
    lastSession: '2024-03-15',
    ratings: 4,
    ratingsGroup: {
      motivational: 4,
      communication: 5,
      knowledge: 3,
      problemSolving: 4
    }
  },
  {
    id: 'm2',
    identity: {
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      firstName: 'Michael',
      lastName: 'Rodriguez'
    },
    experience: '12',
    review:
      'Fantastic at breaking down complex frontend concepts. Really helped improve my React skills.',
    profession: 'Lead Frontend Engineer',
    email: 'm.rodriguez@devmail.com',
    lastSession: '2024-03-18',
    ratings: 3,
    ratingsGroup: {
      motivational: 3,
      communication: 3,
      knowledge: 3,
      problemSolving: 3
    }
  },
  {
    id: 'm3',
    identity: {
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      firstName: 'Priya',
      lastName: 'Patel'
    },
    experience: '6',
    profession: 'DevOps Engineer',
    email: 'priya.patel@cloudmail.com',
    lastSession: '2024-03-10',
    ratings: 5,
    ratingsGroup: {
      motivational: 5,
      communication: 5,
      knowledge: 5,
      problemSolving: 5
    }
  },
  {
    id: 'm4',
    identity: {
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      firstName: 'James',
      lastName: 'Wilson'
    },
    experience: '15',
    review:
      'Outstanding mentor for backend development. Helped me master Node.js and microservices architecture.',
    profession: 'Principal Backend Engineer',
    email: 'j.wilson@techmail.com',
    lastSession: '2024-03-20',
    ratings: 5,
    ratingsGroup: {
      motivational: 5,
      communication: 5,
      knowledge: 5,
      problemSolving: 5
    }
  },
  {
    id: 'm5',
    identity: {
      avatar: 'https://randomuser.me/api/portraits/women/82.jpg',
      firstName: 'Emma',
      lastName: 'Thompson'
    },
    experience: '10',
    review:
      'Great at teaching TypeScript and Next.js best practices. Very patient and thorough.',
    profession: 'Full Stack Developer',
    email: 'emma.t@devmail.com',
    lastSession: '2024-03-17',
    ratings: 2,
    ratingsGroup: {
      motivational: 2,
      communication: 3,
      knowledge: 1,
      problemSolving: 2
    }
  }
];
