export const EventForm = () => {
  const router = useRouter();
  const { createEvent, editEvent } = useEventStore();
  const { showAlert } = useAlertDialog();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(1);

  // Check permissions after hooks
  const { hasAccess, isLoading } = useRoutePermission({
    requiredRoles: ["ADMIN", "MENTOR"],
    fallbackRoute: "/events",
    permissionDeniedMessage: "Only administrators can access this page.",
  });

  if (isLoading || !hasAccess) {
    return null;
  }

  // Rest of the component code...
};
