export type Mentee = {
  id: string;
  identity: {
    avatar: string;
    name: string;
  };
  date: string;
  profession: string;
};

export type Sessions = {
  id: string;
  identity: {
    avatar: string;
    name: string;
  };
  date: string;
  profession: string;
};

export const menteesData: Mentee[] = [
  {
    id: '728ed52f',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      name: 'John Doe'
    },
    date: '2024-01-01',
    profession: 'Software Engineer'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      name: 'Jane Doe'
    },
    date: '2024-01-02',
    profession: 'Product Manager'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      name: 'Jane Doe'
    },
    date: '2024-01-02',
    profession: 'Product Manager'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      name: 'Jane Doe'
    },
    date: '2024-01-02',
    profession: 'Product Manager'
  },
  {
    id: '489e1d42',
    identity: {
      avatar: 'https://github.com/shadcn.png',
      name: 'Jane Doe'
    },
    date: '2024-01-02',
    profession: 'Product Manager'
  }
];
