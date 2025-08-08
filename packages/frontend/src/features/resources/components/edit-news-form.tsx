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
import { CreateOpportunityDto } from '../dto/opportunity-dto';
import { WorkSettings } from '../lib/constants/enums';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PermissionWrapper } from '@/shared/components/navigation/permission-wrapper/permission-wrapper';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { News } from '../types';
import { ResourceDto } from '../dto/resource-dto';
import { OpportunityResponseDto } from '../dto/opportunity-dto';

type FormMode = 'news' | 'contentLibrary' | 'opportunities';
type FormValues = {
  news: NewsFormValues;
  contentLibrary: ResourceFormValues;
  opportunities: OpportunityFormValues;
};

type EditData = News | ResourceDto | OpportunityResponseDto | null;

const EditNewsForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as FormMode;

  const { showAlert } = useAlertDialog();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<EditData>(null);

  const { editNews, fetchNewsById, currentNews } = useNewsStore();
  const { updateResource, getResourceById } = useResourcesStore();
  const {
    editOpportunity,
    salaryRanges,
    fetchSalaryRanges,
    fetchOpportunityById,
    selectedOpportunity
  } = useOpportunityStore();

  console.log('id in the edit news form:', id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch the specific item data based on mode
        if (mode === 'news') {
          await fetchNewsById(id);
          // The news data will be available in the store
          // We'll get it from the store in the form initialization
        } else if (mode === 'contentLibrary') {
          const resourceData = await getResourceById(id);
          if (resourceData) {
            setEditData(resourceData);
          }
        } else if (mode === 'opportunities') {
          await fetchSalaryRanges();
          await fetchOpportunityById(Number(id));
          // The opportunity data will be available in the store
          // We'll get it from the store in the form initialization
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
    id,
    fetchNewsById,
    getResourceById,
    fetchSalaryRanges,
    fetchOpportunityById,
    showAlert
  ]);

  // Update editData when selectedOpportunity changes (for opportunities)
  useEffect(() => {
    if (mode === 'opportunities' && selectedOpportunity) {
      setEditData(selectedOpportunity);
    }
  }, [mode, selectedOpportunity]);

  // Update editData when currentNews changes (for news)
  useEffect(() => {
    if (mode === 'news' && currentNews) {
      setEditData(currentNews);
    }
  }, [mode, currentNews]);

  const formSchema = {
    news: newsFormSchema,
    contentLibrary: resourceFormSchema,
    opportunities: opportunityFormSchema
  }[mode || 'news'];

  const defaultValues = {
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
    values: editData as FormValues[typeof mode] | undefined
  });

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
      type ActionMap = Record<FormMode, () => Promise<void>>;

      const actions: ActionMap = {
        news: async () => {
          const newsData = data as NewsFormValues;
          const formData = new FormData();

          // Append form data
          Object.entries(newsData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });

          // Handle link formatting
          if (newsData.link) {
            const formattedLink = newsData.link.startsWith('http')
              ? newsData.link
              : `https://${newsData.link}`;
            formData.set('link', formattedLink);
          }

          // Handle file removal flag
          if (newsData.removeImage) {
            formData.append('removeImage', 'true');
          }

          // Append file if exists
          if (selectedFile) {
            formData.append('file', selectedFile);
          }

          console.log('form data in edit news form: ', formData);

          const response = await editNews(id, formData);

          console.log('response in edit news form: ', response);

          if (response?.success) {
            showAlert({
              title: 'Success',
              description: 'News updated successfully',
              type: 'success',
              redirect: '/resources'
            });
          }
        },
        contentLibrary: async () => {
          const resourceData = data as ResourceFormValues;
          const formData = new FormData();

          // Append form data
          Object.entries(resourceData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });

          // Handle link formatting
          if (resourceData.link) {
            const formattedLink = resourceData.link.startsWith('http')
              ? resourceData.link
              : `https://${resourceData.link}`;
            formData.set('link', formattedLink);
          }

          // Handle file removal flag
          if (resourceData.removeFile) {
            formData.append('removeFile', 'true');
          }

          // Append file if exists
          if (selectedFile) {
            formData.append('file', selectedFile);
          }

          const response = await updateResource(id, formData);

          console.log('response in edit resource form: ', response);

          if (response?.success) {
            showAlert({
              title: 'Success',
              description: 'Resource updated successfully',
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
                opportunityData[key] = formattedLink;
              } else if (key === 'salary_range_id' && value) {
                // salary_range_id is now a number, just convert to string for FormData
                formData.append(key, value.toString());
              } else {
                formData.append(key, value.toString());
              }
            }
          });

          // Handle file removal flag
          if (opportunityData.removeImage) {
            formData.append('removeImage', 'true');
          }

          // Append file if exists
          if (selectedFile) {
            formData.append('file', selectedFile);
          }

          const response = await editOpportunity(
            Number(id),
            formData as unknown as CreateOpportunityDto
          );

          console.log('response in edit opportunity form: ', response);

          if (response?.success) {
            showAlert({
              title: 'Success',
              description: 'Opportunity updated successfully',
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

  // Prepare existing files for display
  const getExistingFiles = () => {
    if (!editData) return [];

    if (mode === 'news' && 'image' in editData && editData.image) {
      return [
        {
          name: editData.image.split('/').pop() || 'news-image',
          url: editData.image.startsWith('http')
            ? editData.image
            : `${process.env.NEXT_PUBLIC_API_URL}/files/${editData.image}`,
          type: 'image/jpeg',
          size: 0
        }
      ];
    }

    if (mode === 'contentLibrary' && 'file' in editData && editData.file) {
      return [
        {
          name: editData.file.split('/').pop() || 'resource-file',
          url: editData.file.startsWith('http')
            ? editData.file
            : `${process.env.NEXT_PUBLIC_API_URL}/files/${editData.file}`,
          type: 'application/pdf',
          size: 0
        }
      ];
    }

    if (mode === 'opportunities' && 'image' in editData && editData.image) {
      return [
        {
          name: editData.image.split('/').pop() || 'company-logo',
          url: editData.image.startsWith('http')
            ? editData.image
            : `${process.env.NEXT_PUBLIC_API_URL}/files/${editData.image}`,
          type: 'image/jpeg',
          size: 0
        }
      ];
    }

    return [];
  };

  const formComponents = {
    news: (
      <BaseForm
        onFileUpload={handleFileUpload}
        existingFiles={getExistingFiles()}
      />
    ),
    contentLibrary: (
      <ResourceForm
        onFileUpload={handleFileUpload}
        existingFiles={getExistingFiles()}
      />
    ),
    opportunities: (
      <OpportunityForm
        salaryRanges={salaryRanges}
        onFileUpload={handleFileUpload}
        existingFiles={getExistingFiles()}
      />
    )
  };

  const titles = {
    news: 'Edit News',
    contentLibrary: 'Edit Resource',
    opportunities: 'Edit Opportunity'
  };

  if (isLoading) {
    return (
      <Card className="flex h-full w-full max-w-3xl flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-6 sm:p-8">
          Loading {titles[mode]} form...
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
            <h2 className="break-words text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
              {titles[mode]}
            </h2>
          </div>
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
                label={
                  isSubmitting
                    ? 'Updating...'
                    : `Update ${mode === 'contentLibrary' ? 'Resource' : mode}`
                }
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export const EditNewsFormWrapper = ({ id }: { id: string }) => {
  return (
    <PermissionWrapper
      requiredRoles={['ADMIN', 'MENTOR']}
      fallbackRoute="/resources"
      permissionDeniedMessage="Only administrators can access this page."
    >
      <EditNewsForm id={id} />
    </PermissionWrapper>
  );
};
