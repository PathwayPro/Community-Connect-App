'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { IconButton } from '@/shared/components/ui/icon-button';
import { FormProvider, useForm } from 'react-hook-form';
import { NewsFormValues } from '@/features/news/lib/validation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { BaseForm } from './forms/base-form';
import { ResourceForm } from './forms/resource-form';
import { OpportunityForm } from './forms/opportunity-form';

interface NewsFormProps {
  newsId?: string;
}

export const NewsForm = ({ newsId }: NewsFormProps) => {
  const methods = useForm<NewsFormValues>();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();

  console.log(mode, newsId);

  const onSubmit = (data: NewsFormValues) => {
    console.log(data);
  };

  const getNewsPageContent = () => {
    if (mode === 'news') {
      return <BaseForm mode="create" />;
    }
    if (mode === 'resources') {
      return <ResourceForm />;
    }
    if (mode === 'opportunities') {
      return <OpportunityForm />;
    }
  };

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <div className="relative flex items-center justify-center gap-2">
            <IconButton
              leftIcon="arrowLeft"
              variant="ghost"
              className="absolute left-0 h-10 w-10"
              onClick={() => router.back()}
            />
            <h2 className="font-semibold">
              Create{' '}
              {mode === 'news'
                ? 'News'
                : mode === 'resources'
                  ? 'Resource'
                  : 'Opportunity'}
            </h2>
          </div>
          <h4>
            {mode === 'news'
              ? 'News Information'
              : mode === 'resources'
                ? 'Resource Information'
                : 'Opportunity Information'}
          </h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {getNewsPageContent()}
            <div className="flex w-full gap-4 pt-5">
              <IconButton
                className="w-full"
                type="submit"
                disabled={methods.formState.isSubmitting}
                // rightIcon="arrowRight"
                label={
                  mode === 'news'
                    ? 'Publish News'
                    : mode === 'resources'
                      ? 'Upload Resource'
                      : 'Post Opportunity'
                }
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
