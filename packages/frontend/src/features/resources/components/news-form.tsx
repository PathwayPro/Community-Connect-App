'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { IconButton } from '@/shared/components/ui/icon-button';
import { FormProvider, useForm } from 'react-hook-form';
import {
  NewsFormValues,
  ResourceFormValues,
  OpportunityFormValues
} from '@/features/resources/lib/validation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { BaseForm } from './forms/base-form';
import { ResourceForm } from './forms/resource-form';
import { OpportunityForm } from './forms/opportunity-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  newsFormSchema,
  resourceFormSchema,
  opportunityFormSchema
} from '@/features/resources/lib/validation';

interface NewsFormProps {
  newsId?: string;
}

type FormMode = 'news' | 'contentLibrary' | 'opportunities';
type FormValues = {
  news: NewsFormValues;
  contentLibrary: ResourceFormValues;
  opportunities: OpportunityFormValues;
};

export const NewsForm = ({ newsId }: NewsFormProps) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as FormMode;

  const methods = useForm<FormValues[typeof mode]>({
    resolver: zodResolver(
      mode === 'news'
        ? newsFormSchema
        : mode === 'contentLibrary'
          ? resourceFormSchema
          : opportunityFormSchema
    ),
    defaultValues:
      mode === 'news'
        ? { title: '', content: '', subtitle: '', keywords: '' }
        : mode === 'contentLibrary'
          ? { title: '', description: '', link: '' }
          : {
              title: '',
              description: '',
              link: '',
              apply_link: '',
              job_link: ''
            }
  });

  const router = useRouter();

  console.log(mode, newsId);

  const onSubmit = (data: FormValues[typeof mode]) => {
    console.log(data);
  };

  const getNewsPageContent = () => {
    switch (mode) {
      case 'news':
        return <BaseForm mode="create" />;
      case 'contentLibrary':
        return <ResourceForm />;
      case 'opportunities':
        return <OpportunityForm />;
      default:
        return null;
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
                : mode === 'contentLibrary'
                  ? 'Resource'
                  : 'Opportunity'}
            </h2>
          </div>
          <h4>
            {mode === 'news'
              ? 'News Information'
              : mode === 'contentLibrary'
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
                    : mode === 'contentLibrary'
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
