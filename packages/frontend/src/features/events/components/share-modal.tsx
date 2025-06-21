import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Avatar } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNetworkingStore } from '@/features/networking/store';
import { useMessageStore } from '@/features/messages/store';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { Loader2, Users, MessageSquare, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useUserStore } from '@/features/user-profile/store';
import { Connection } from '@/features/networking/types';
import { formatDate } from 'date-fns';

const shareEventSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message cannot exceed 500 characters'),
  selectedConnections: z
    .array(z.number())
    .min(1, 'Please select at least one connection to share with')
});

type ShareEventForm = z.infer<typeof shareEventSchema>;

interface ShareModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  eventData?: {
    id: number;
    title: string;
    description: string;
    location?: string;
    start_date: string;
    start_time: string;
    end_time: string;
    image?: string;
    host_name: string;
  };
}

export function ShareModal({
  isOpen = false,
  onClose,
  eventData
}: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const {
    connections,
    getConnections,
    isLoading: isLoadingConnections
  } = useNetworkingStore();
  const { sendMessage } = useMessageStore();
  const { showAlert } = useAlertDialog();
  const { user } = useUserStore();

  const form = useForm<ShareEventForm>({
    resolver: zodResolver(shareEventSchema),
    defaultValues: {
      message: '',
      selectedConnections: []
    }
  });

  useEffect(() => {
    if (isOpen) {
      getConnections();
      // Set default message with event details
      if (eventData) {
        const defaultMessage = `Hey! I thought you might be interested in this event: "${eventData.title}"\n\n📅 Date: ${formatDate(eventData.start_date, 'MMM d, yyyy')}\n🕒 Time: ${eventData.start_time} - ${eventData.end_time}${eventData.location ? `\n📍 Location: ${eventData.location}` : ''}\n\nWould you like to join?`;
        form.setValue('message', defaultMessage);
      }
    }
  }, [isOpen, eventData, getConnections, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!eventData) return;

    setIsSharing(true);
    try {
      // Send message to each selected connection
      const sharePromises = data.selectedConnections.map((connectionId) =>
        sendMessage({
          recipient_id: connectionId,
          message: data.message
        })
      );

      await Promise.all(sharePromises);

      showAlert({
        type: 'success',
        title: 'Event Shared Successfully!',
        description: `Event shared with ${data.selectedConnections.length} connection${data.selectedConnections.length > 1 ? 's' : ''}.`
      });

      form.reset();
      onClose?.();
    } catch (error) {
      console.error('Error sharing event:', error);
      showAlert({
        type: 'error',
        title: 'Error Sharing Event',
        description: 'Failed to share the event. Please try again.'
      });
    } finally {
      setIsSharing(false);
    }
  });

  const handleConnectionToggle = (connectionId: number) => {
    const currentSelected = form.watch('selectedConnections');
    const isSelected = currentSelected.includes(connectionId);

    if (isSelected) {
      form.setValue(
        'selectedConnections',
        currentSelected.filter((id) => id !== connectionId)
      );
    } else {
      form.setValue('selectedConnections', [...currentSelected, connectionId]);
    }
  };

  const getConnectionName = (connection: Connection) => {
    // Determine which user is the other person (not the current user)
    const currentUserId = user?.id;

    if (connection.sender.id === currentUserId) {
      return `${connection.recipient.first_name} ${connection.recipient.last_name}`;
    } else {
      return `${connection.sender.first_name} ${connection.sender.last_name}`;
    }
  };

  const getConnectionId = (connection: Connection) => {
    const currentUserId = user?.id;

    if (connection.sender.id === currentUserId) {
      return connection.recipient.id;
    } else {
      return connection.sender.id;
    }
  };

  return (
    <>
      <AlertDialogUI />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[80vh] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Share2 className="h-5 w-5" />
              Share Event
            </DialogTitle>
            <DialogDescription>
              Share this event with your connections by sending them a message.
              Select the connections you&apos;d like to share with and customize
              your message.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Event Preview */}
              {eventData && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    {eventData.image && (
                      <Image
                        src={eventData.image}
                        alt={eventData.title}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 text-sm font-semibold">
                        {eventData.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Hosted by {eventData.host_name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(eventData.start_date, 'MMM d, yyyy')}
                        </Badge>
                        {eventData.location && (
                          <Badge variant="outline" className="text-xs">
                            {eventData.location}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Connections Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <h4 className="text-sm font-medium">Select Connections</h4>
                </div>

                {isLoadingConnections ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading connections...
                    </span>
                  </div>
                ) : connections.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No connections found</p>
                    <p className="text-xs">
                      Connect with other users to share events
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    <div className="space-y-2">
                      {connections.map((connection, index) => {
                        const connectionId = getConnectionId(connection);
                        const connectionName = getConnectionName(connection);
                        const isSelected = form
                          .watch('selectedConnections')
                          .includes(connectionId);

                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50"
                          >
                            <Checkbox
                              id={`connection-${connectionId}`}
                              checked={isSelected}
                              onCheckedChange={() =>
                                handleConnectionToggle(connectionId)
                              }
                            />
                            <Avatar className="h-8 w-8">
                              <Image
                                src="/profile/profile.png"
                                alt={connectionName}
                                width={32}
                                height={32}
                              />
                            </Avatar>
                            <label
                              htmlFor={`connection-${connectionId}`}
                              className="flex-1 cursor-pointer text-sm font-medium"
                            >
                              {connectionName}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}

                {form.formState.errors.selectedConnections && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.selectedConnections.message}
                  </p>
                )}
              </div>

              <Separator />

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  {...form.register('message')}
                  placeholder="Add a personal message to share with your connections..."
                  className="min-h-[120px]"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.message.message}
                  </p>
                )}
                <p className="text-right text-sm text-muted-foreground">
                  {form.watch('message').length}/500 characters
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10"
                disabled={isSharing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  isSharing ||
                  connections.length === 0
                }
                className="h-10"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Share Event
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
