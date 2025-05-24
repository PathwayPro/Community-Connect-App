import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEventStore } from "../store";
import { useAlertDialog } from "@/shared/hooks/use-alert-dialog";
import { IconButton } from "@/shared/components/ui/icon-button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/shared/components/ui/card";
import { BaseForm } from "./common/base-form";
import { FormProvider, useForm } from "react-hook-form";
import {
  eventFormSchema,
  EventFormValues,
  EventsTypes,
} from "../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimeLocationForm } from "./common/time-location-form";
import { UpdateEventDto } from "../dto";
import { AlertDialogUI } from "@/shared/components/notification/alert-dialog";

export const EventForm = () => {
  const router = useRouter();
  const { createEvent, editEvent } = useEventStore();
  const { showAlert } = useAlertDialog();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(1);

  const eventData: UpdateEventDto = searchParams.get("data")
    ? JSON.parse(decodeURIComponent(searchParams.get("data")!))
    : null;

  const isEdit = pathname.startsWith("/events/edit");
  const eventButtonText = isEdit ? "Update Event" : "Publish Event";

  const defaultValues = {
    title: eventData?.title || "",
    description: eventData?.description || "",
    category_id: eventData?.category_id?.toString() || "",
    location: eventData?.location || "",
    link: eventData?.link || "",
    is_free: eventData?.is_free ?? true,
    type: eventData?.type || EventsTypes.PUBLIC,
    requires_confirmation: false,
    accept_subscriptions: true,
    start_date: eventData?.start_date || "",
    start_time: eventData?.start_time || "",
    end_time: eventData?.end_time || "",
    file: eventData?.file || undefined,
  };

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (data.start_date) {
        const startDate = new Date(data.start_date);
        formData.append("start_date", startDate.toISOString());
      }

      if (data.link) {
        const formattedLink = data.link.startsWith("http")
          ? data.link
          : `https://${data.link}`;
        formData.append("link", formattedLink);
      }

      if (data.category_id) {
        formData.append("category_id", String(data.category_id));
      }

      formData.append("location", data.location || "Online");
      formData.append("is_free", String(data.is_free));
      formData.append("requires_confirmation", String(false));
      formData.append("accept_subscriptions", String(true));

      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "file" &&
          key !== "start_date" &&
          key !== "link" &&
          key !== "category_id" &&
          key !== "location" &&
          key !== "is_free" &&
          key !== "requires_confirmation" &&
          key !== "accept_subscriptions" &&
          value !== undefined &&
          value !== null
        ) {
          formData.append(key, String(value));
        }
      });

      if (isEdit && eventData) {
        const result = await editEvent(eventData.id, formData);
        if (result) {
          showAlert({
            type: "success",
            title: "Event Updated Successfully!",
            description: "Your event has been successfully updated.",
            redirect: "/events",
          });
        }
      } else {
        const result = await createEvent(formData);
        if (result) {
          showAlert({
            type: "success",
            title: "Event Created Successfully!",
            description: "Your event has been successfully created.",
            redirect: "/events",
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showAlert({
        type: "error",
        title: isEdit ? "Event Update Failed" : "Event Creation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your input and try again.",
      });
    }
  };

  return (
    <Card className="flex w-[840px] flex-col rounded-[24px]">
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
            <h2 className="font-semibold">
              {isEdit ? "Edit Event" : "Create New Event"}
            </h2>
          </div>
          <h4>
            {activeStep === 1 ? "Event Information" : "Event Time & Location"}
          </h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {activeStep === 1 ? (
              <BaseForm onFileSelect={handleFileSelect} />
            ) : (
              <TimeLocationForm />
            )}
            <div className="flex w-full gap-4 pt-5">
              {activeStep === 2 && (
                <IconButton
                  className="w-full"
                  type="button"
                  disabled={methods.formState.isSubmitting}
                  rightIcon="arrowLeft"
                  label="Previous"
                  variant="outline"
                  onClick={handlePrevious}
                />
              )}
              <IconButton
                className="w-full"
                type={activeStep === 2 ? "submit" : "button"}
                disabled={
                  methods.formState.isSubmitting ||
                  !checkStepValidity(
                    methods.getValues(),
                    activeStep,
                    methods.formState
                  )
                }
                rightIcon="arrowRight"
                label={activeStep === 1 ? "Next" : eventButtonText}
                onClick={activeStep === 1 ? handleNext : undefined}
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
