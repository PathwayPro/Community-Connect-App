import React from "react";
import { useRoutePermission } from "../../hooks/useRoutePermission";
import { EventForm } from "./event-form";

export const EventFormWrapper = () => {
  const { hasAccess, isLoading } = useRoutePermission({
    requiredRoles: ["ADMIN", "MENTOR"],
    fallbackRoute: "/events",
    permissionDeniedMessage: "Only administrators can access this page.",
  });

  if (isLoading || !hasAccess) {
    return null;
  }

  return <EventForm />;
};
