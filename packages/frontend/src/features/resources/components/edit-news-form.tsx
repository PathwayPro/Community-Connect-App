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
import { useNewsStore } from '../store';
import { useOpportunityStore } from '../store';
import { useResourcesStore } from '../store';
import { useEffect } from 'react';
import { CreateNewsDto } from '../dto/news-dto';
import { CreateResourceDto } from '../dto/resource-dto';
import { CreateOpportunityDto } from '../dto/opportunity-dto';
import { WorkSettings } from '../lib/constants/enums';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';

type FormMode = 'news' | 'contentLibrary' | 'opportunities';
type FormValues = {
  news: NewsFormValues;
  contentLibrary: ResourceFormValues;
  opportunities: OpportunityFormValues;
};

export const EditNewsForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as FormMode;
  const id = searchParams.get('id');
  const formData = searchParams.get('data')
    ? JSON.parse(decodeURIComponent(searchParams.get('data')!))
    : null;
  const { showAlert } = useAlertDialog();

  const { updateNews } = useNewsStore();
  const { updateResource } = useResourcesStore();
  const { updateOpportunity, salaryRanges } = useOpportunityStore();

  const formSchema = {
    news: newsFormSchema,
    contentLibrary: resourceFormSchema,
    opportunities: opportunityFormSchema
  }[mode || 'news'];

  const defaultValues =
    formData ||
    {
      news: { title: '', details: '', type: '', link: '' },
      contentLibrary: { title: '', details: '', type: '', link: '' },
      opportunities: {
        job: '',
        salary_range_id: '',
        description: '',
        link_post: '',
        link_apply: '',
        company: '',
        province: '',
        city: '',
        settings: WorkSettings.REMOTE
      }
    }[mode || 'news'];

  const methods = useForm<FormValues[typeof mode]>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: formData
  });

  const { isSubmitting, errors } = methods.formState;

  const onSubmit = async (data: FormValues[typeof mode]) => {
    try {
      const actions = {
        news: async () => {
          await updateNews(id!, data as CreateNewsDto);
          showAlert({
            title: 'Success',
            description: 'News updated successfully',
            type: 'success',
            redirect: '/resources'
          });
        },
        contentLibrary: async () => {
          await updateResource(id!, data as CreateResourceDto);
          showAlert({
            title: 'Success',
            description: 'Resource updated successfully',
            type: 'success',
            redirect: '/resources'
          });
        },
        opportunities: async () => {
          await updateOpportunity(Number(id!), data as CreateOpportunityDto);
          showAlert({
            title: 'Success',
            description: 'Opportunity updated successfully',
            type: 'success',
            redirect: '/resources'
          });
        }
      };

      if (mode && actions[mode]) {
        await actions[mode]();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit form';
      showAlert({
        title: 'Error',
        description: errorMessage,
        type: 'error'
      });
    }
  };

  const formComponents = {
    news: <BaseForm />,
    contentLibrary: <ResourceForm />,
    opportunities: <OpportunityForm salaryRanges={salaryRanges} />
  };

  const titles = {
    news: 'Edit News',
    contentLibrary: 'Edit Resource',
    opportunities: 'Edit Opportunity'
  };

  return (
    <Card className="flex h-full w-[840px] flex-col rounded-[24px]">
      <AlertDialogUI />
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <div className="relative flex items-center justify-center gap-2">
            <IconButton
              leftIcon="arrowLeft"
              variant="ghost"
              className="absolute left-0 h-10 w-10"
              onClick={() => router.back()}
            />
            <h2 className="font-semibold">{titles[mode]}</h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {formComponents[mode]}
            {Object.keys(errors).length > 0 && (
              <div className="text-sm text-red-500">
                Please fix the errors in the form before submitting.
              </div>
            )}
            <div className="flex w-full gap-4 pt-5">
              <IconButton
                className="w-full"
                type="submit"
                disabled={isSubmitting}
                label={`Update ${mode === 'contentLibrary' ? 'Resource' : mode}`}
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
