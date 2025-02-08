'use client';

import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

export const NewsList = () => {
  const router = useRouter();

  return (
    <div>
      <h1>NewsList</h1>
      <Button onClick={() => router.push('/news/create')}>Create News</Button>
    </div>
  );
};
