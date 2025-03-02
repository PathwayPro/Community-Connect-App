'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/hooks/use-toast';

export function NewsletterSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement your newsletter subscription API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

      toast({
        title: 'Success!',
        description: "You've been subscribed to our newsletter."
      });

      setEmail('');
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter">
          Subscribe to our Newsletter
        </h2>
        <p className="text-muted-foreground">
          Stay up to date with our latest news and updates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
        <Input
          type="email"
          placeholder="johndoe@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </section>
  );
}
