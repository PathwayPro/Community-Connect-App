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

export type MentorshipAdmin = {
  id: string;
  identity: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
  experience: string;
  profession: string;
  email: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

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
      lastName: 'Doe'
    },
    experience: '10 years',
    profession: 'Software Engineer',
    email: 'john.doe@example.com',
    status: 'Approved'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Jane',
      lastName: 'Doe'
    },
    experience: '10 years',
    profession: 'Software Engineer',
    email: 'jane.doe@example.com',
    status: 'Pending'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Jones',
      lastName: 'Doe'
    },
    experience: '10 years',
    profession: 'Software Engineer',
    email: 'jones@example.com',
    status: 'Rejected'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      firstName: 'Liberty',
      lastName: 'Doe'
    },
    experience: '10 years',
    profession: 'Software Engineer',
    email: 'liberty@example.com',
    status: 'Pending'
  }
];
