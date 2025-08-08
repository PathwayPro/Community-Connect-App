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
import { useEffect, useState } from 'react';
import { CreateNewsDto } from '../dto/news-dto';
import { CreateOpportunityDto } from '../dto/opportunity-dto';
import { WorkSettings } from '../lib/constants/enums';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { toast } from 'sonner';
import { PermissionWrapper } from '@/shared/components/navigation/permission-wrapper/permission-wrapper';

type FormMode = 'news' | 'contentLibrary' | 'opportunities';
type FormValues = {
  news: NewsFormValues;
  contentLibrary: ResourceFormValues;
  opportunities: OpportunityFormValues;
};

const NewsForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as FormMode;
  const { showAlert } = useAlertDialog();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { createNews, fetchNews } = useNewsStore();
  const { createResource, fetchResources } = useResourcesStore();
  const {
    createOpportunity,
    fetchOpportunities,
    fetchSalaryRanges,
    salaryRanges
  } = useOpportunityStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (mode === 'opportunities') {
          await Promise.all([fetchOpportunities(), fetchSalaryRanges()]);
        } else if (mode === 'news') {
          await fetchNews();
        } else if (mode === 'contentLibrary') {
          await fetchResources();
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showAlert({
          title: 'Error',
          description: 'Failed to fetch data. Please try again.',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [
    mode,
    fetchNews,
    fetchResources,
    fetchOpportunities,
    fetchSalaryRanges,
    showAlert
  ]);

  const formSchema = {
    news: newsFormSchema,
    contentLibrary: resourceFormSchema,
    opportunities: opportunityFormSchema
  }[mode || 'news'];

  const defaultValues = {
    news: { title: '', details: '', type: '', link: '' },
    contentLibrary: { title: '', details: '', type: '', link: '', file: null },
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
    defaultValues
  });

  // Validation after all hooks
  if (!mode || !['news', 'contentLibrary', 'opportunities'].includes(mode)) {
    router.push('/resources');
    return null;
  }

  console.log('methods.formState:', methods.formState.errors);

  const { isSubmitting, errors } = methods.formState;

  const handleFileUpload = async (files: File[]) => {
    try {
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        toast.success('Image uploaded successfully');
      } else {
        setSelectedFile(null);
        toast.error('No file selected.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    }
  };

  const onSubmit = async (data: FormValues[typeof mode]) => {
    try {
      const actions = {
        news: async () => {
          const newsData = data as NewsFormValues;
          const formData = new FormData();

          // Append form data
          formData.append('title', newsData.title);
          formData.append('details', newsData.details);
          formData.append('type', newsData.type);

          // Handle link formatting
          if (newsData.link) {
            const formattedLink = newsData.link.startsWith('http')
              ? newsData.link
              : `https://${newsData.link}`;
            formData.append('link', formattedLink);
          }

          // Append file if exists
          if (selectedFile) {
            formData.append('file', selectedFile);
          }

          const result = await createNews(formData as unknown as CreateNewsDto);
          if (result) {
            showAlert({
              title: 'Success',
              description: 'News created successfully',
              type: 'success',
              redirect: '/resources'
            });
          }
        },
        contentLibrary: async () => {
          const resourceData = data as ResourceFormValues;
          const formData = new FormData();

          // Append form data
          formData.append('title', resourceData.title);
          formData.append('details', resourceData.details);
          formData.append('type', resourceData.type);

          // Handle link formatting
          if (resourceData.link) {
            const formattedLink = resourceData.link.startsWith('http')
              ? resourceData.link
              : `https://${resourceData.link}`;
            formData.append('link', formattedLink);
          }

          // Append file if exists
          if (selectedFile) {
            formData.append('file', selectedFile);
          }

          console.log('formData in the resource form: ', formData);

          for (const pair of formData.entries()) {
            console.log('FormData entry in resource form:', pair[0], pair[1]);
          }

          const result = await createResource(formData);

          if (result) {
            showAlert({
              title: 'Success',
              description: 'Resource created successfully',
              type: 'success',
              redirect: '/resources'
            });
          }
        },
        opportunities: async () => {
          const opportunityData = data as OpportunityFormValues;
          const formData = new FormData();

          // Append form data
          Object.entries(opportunityData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              // Handle link formatting for link_post and link_apply
              if ((key === 'link_post' || key === 'link_apply') && value) {
                const formattedLink = value.toString().startsWith('http')
                  ? value.toString()
                  : `https://${value.toString()}`;
                formData.append(key, formattedLink);
              } else if (key === 'salary_range_id' && value) {
                // salary_range_id is now a number, just convert to string for FormData
                formData.append(key, value.toString());
              } else {
                formData.append(key, value.toString());
              }
            }
          });

          // Append file if exists
          if (selectedFile) {
            formData.append('file', selectedFile);
          }

          const result = await createOpportunity(
            formData as unknown as CreateOpportunityDto
          );
          if (result) {
            showAlert({
              title: 'Success',
              description: 'Opportunity created successfully',
              type: 'success',
              redirect: '/resources'
            });
          }
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
    news: <BaseForm onFileUpload={handleFileUpload} />,
    contentLibrary: <ResourceForm onFileUpload={handleFileUpload} />,
    opportunities: (
      <OpportunityForm
        salaryRanges={salaryRanges}
        onFileUpload={handleFileUpload}
      />
    )
  };

  const titles = {
    news: { create: 'News', info: 'News Information' },
    contentLibrary: { create: 'Resource', info: 'Resource Information' },
    opportunities: { create: 'Opportunity', info: 'Opportunity Information' }
  };

  const submitLabels = {
    news: 'Publish News',
    contentLibrary: 'Upload Resource',
    opportunities: 'Post Opportunity'
  };

  if (isLoading) {
    return (
      <Card className="flex h-full w-full max-w-3xl flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-6 sm:p-8">
          Loading {titles[mode].create} form...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full w-full max-w-3xl flex-col rounded-[24px]">
      <AlertDialogUI />
      <CardHeader className="justify-center p-6 sm:p-8">
        <CardTitle className="flex flex-col space-y-4 text-center sm:space-y-6">
          <div className="relative flex items-center justify-center gap-2">
            <IconButton
              leftIcon="arrowLeft"
              variant="ghost"
              className="absolute left-0 h-10 w-10"
              onClick={() => router.back()}
            />
            <h2 className="break-words text-2xl font-semibold leading-tight sm:text-3xl md:text-3xl">
              Create {titles[mode].create}
            </h2>
          </div>
          <h4 className="text-base leading-snug text-muted-foreground sm:text-lg md:text-lg">
            {titles[mode].info}
          </h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4 p-4 sm:p-6">
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
                label={isSubmitting ? 'Saving...' : submitLabels[mode]}
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export const NewsFormWrapper = () => {
  return (
    <PermissionWrapper
      requiredRoles={['ADMIN', 'MENTOR']}
      fallbackRoute="/resources"
      permissionDeniedMessage="Only administrators can access this page."
    >
      <NewsForm />
    </PermissionWrapper>
  );
};
