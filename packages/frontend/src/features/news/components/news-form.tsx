'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { IconButton } from '@/shared/components/ui/icon-button';
import { FormProvider, useForm } from 'react-hook-form';
import { NewsFormValues } from '../lib/validation';
import { usePathname } from 'next/navigation';
import { BaseForm } from './common/forms/base-form';

interface NewsFormProps {
  mode: 'create' | 'edit';
  newsId?: string;
}

export const NewsForm = ({ mode, newsId }: NewsFormProps) => {
  const methods = useForm<NewsFormValues>();
  const pathname = usePathname();

  console.log(mode, newsId);

  const onSubmit = (data: NewsFormValues) => {
    console.log(data);
  };

  const getNewsPageContent = (pathname: string) => {
    if (pathname === '/news/create') {
      return <BaseForm mode="create" />;
    }
  };

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
      <CardHeader className="justify-center p-8">
        <CardTitle className="flex flex-col space-y-6 text-center">
          <h2 className="font-semibold">Upload News</h2>
          <h4>News Information</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {getNewsPageContent(pathname)}
            <div className="flex w-full gap-4 pt-5">
              <IconButton
                className="w-full"
                type="submit"
                disabled={methods.formState.isSubmitting}
                rightIcon="arrowRight"
                label="Publish News"
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
