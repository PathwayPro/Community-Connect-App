import { Events, EventsCategories, EventsInvitations, EventsManagers, EventsSubscriptions, EventsSubscriptionsUpdates } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const GeneralEventsData = {
    subtitle: "A subtitle for an event",
    description: "Event description...",
    location: "1519 11th Ave SW, CA, AB, T3C 0N1",
    link: "https://event-link.ca",
    image: "https://event-link.ca",
    price: new Decimal(0),
    created_at: new Date('2024-12-18 02:48:22:738'),
    updated_at: new Date()
};

export const EventsCategoriesData: EventsCategories[] = [
    {id:1, name:"WORKSHOP"},
    {id:2, name:"MENTORSHIP"},
    {id:3, name:"NETWORKING"},
    {id:4, name:"OTHER"},
    {id:7, name:"POSTMAN2"},
    {id:8, name:"POSTAM2"},
];

export const EventsData: Events[] = [
    {id: 1,title: "Event 1",type: "PUBLIC",requires_confirmation: false,accept_subscriptions: true,category_id: 3,...GeneralEventsData},
    {id: 2,title: "Event 2",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: false,category_id: 7,...GeneralEventsData},
    {id: 3,title: "Event 3",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: false,category_id: 4,...GeneralEventsData},
    {id: 4,title: "Event 4",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: true,category_id: 3,...GeneralEventsData},
    {id: 5,title: "Event 5",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: true,category_id: 2,...GeneralEventsData},
    {id: 6,title: "Event 6",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: true,category_id: 2,...GeneralEventsData},
    {id: 7,title: "Event 7",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: true,category_id: 2,...GeneralEventsData},
    {id: 8,title: "Event 8",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: true,category_id: 2,...GeneralEventsData},
    {id: 9,title: "Event 9",type: "PUBLIC",requires_confirmation: false,accept_subscriptions: true,category_id: 2,...GeneralEventsData},
    {id: 10,title: "Event 10",type: "PUBLIC",requires_confirmation: true,accept_subscriptions: true,category_id: 7,...GeneralEventsData}
];

export const EventsInvitationsData: EventsInvitations[] = [
    {id: 1,inviter_id: 8,invitee_id: 9,event_id: 7,message: "Invitation message...",created_at: new Date('2024-12-19 01:48:22:738')},
    {id: 3,inviter_id: 9,invitee_id: 3,event_id: 7,message: "Invitation message...",created_at: new Date('2024-12-19 02:48:22:738')},
    {id: 4,inviter_id: 8,invitee_id: 3,event_id: 6,message: "Invitation message...",created_at: new Date('2024-12-19 03:48:22:738')},
    {id: 5,inviter_id: 10,invitee_id: 3,event_id: 6,message: "Invitation message...",created_at: new Date('2024-12-19 04:48:22:738')},
    {id: 6,inviter_id: 10,invitee_id: 1,event_id: 7,message: "Invitation message...",created_at: new Date('2024-12-19 05:48:22:738')},
    {id: 7,inviter_id: 11,invitee_id: 3,event_id: 7,message: "Invitation message...",created_at: new Date('2024-12-19 06:48:22:738')},
    {id: 10,inviter_id: 9,invitee_id: 3,event_id: 3,message: "Invitation message...",created_at: new Date('2024-12-19 07:48:22:738')},
    {id: 11,inviter_id: 8,invitee_id: 3,event_id: 3,message: "Invitation message...",created_at: new Date('2024-12-19 08:48:22:738')},
];

export const EventsManagersData: EventsManagers[] = [
    {id: 4,user_id: 8,event_id: 10,is_speaker: true},
    {id: 6,user_id: 9,event_id: 9,is_speaker: true},
    {id: 7,user_id: 9,event_id: 8,is_speaker: false},
    {id: 8,user_id: 9,event_id: 7,is_speaker: true},
    {id: 9,user_id: 9,event_id: 6,is_speaker: false},
    {id: 10,user_id: 8,event_id: 7,is_speaker: true},
    {id: 11,user_id: 10,event_id: 7,is_speaker: false},
    {id: 12,user_id: 11,event_id: 7,is_speaker: true},
    {id: 13,user_id: 9,event_id: 5,is_speaker: false},
    {id: 14,user_id: 9,event_id: 4,is_speaker: true},
    {id: 15,user_id: 9,event_id: 3,is_speaker: true},
    {id: 16,user_id: 9,event_id: 2,is_speaker: false},
    {id: 18,user_id: 9,event_id: 10,is_speaker: false},
    {id: 19,user_id: 9,event_id: 1,is_speaker: false},
    {id: 20,user_id: 8,event_id: 3,is_speaker: false},
];

export const EventsSubscriptionsData: EventsSubscriptions[] = [
    {id: 2,user_id: 1,event_id: 2,status: "IN_PROGRESS",created_at: new Date('2024-12-21 18:39:51:606'),updated_at: new Date('2024-12-21 19:39:51:606')},
    {id: 3,user_id: 3,event_id: 2,status: "APPROVED",created_at: new Date('2024-12-21 18:39:51:606'),updated_at: new Date('2024-12-21 19:39:51:606')},
    {id: 5,user_id: 1,event_id: 4,status: "REJECTED",created_at: new Date('2024-12-22 18:39:51:606'),updated_at: new Date('2024-12-22 19:39:51:606')},
    {id: 7,user_id: 1,event_id: 1,status: "APPROVED",created_at: new Date('2024-12-21 18:39:51:606'),updated_at: new Date('2024-12-21 19:39:51:606')},
    {id: 8,user_id: 1,event_id: 7,status: "PENDING",created_at: new Date('2024-12-21 18:39:51:606'),updated_at: new Date('2024-12-21 19:39:51:606')},
    {id: 10,user_id: 8,event_id: 10,status: "PENDING",created_at: new Date('2024-12-22 18:39:51:606'),updated_at: new Date('2024-12-22 19:39:51:606')},
    {id: 11,user_id: 8,event_id: 4,status: "PENDING",created_at: new Date('2024-12-22 18:39:51:606'),updated_at: new Date('2024-12-22 19:39:51:606')},
    {id: 17,user_id: 3,event_id: 4,status: "PENDING",created_at: new Date('2024-12-22 18:39:51:606'),updated_at: new Date('2024-12-22 19:39:51:606')},
];

export const EventsSubscriptionsUpdatesData: EventsSubscriptionsUpdates[] = [
    {id: 1,message: "Is in review now",subscription_id: 3,prev_status: "PENDING",new_status: "IN_PROGRESS",updated_by: 1,created_at: new Date('2024-12-21 19:40:35.4')},
    {id: 2,message: "Not a nice application",subscription_id: 3,prev_status: "IN_PROGRESS",new_status: "REJECTED",updated_by: 1,created_at: new Date('2024-12-21 19:42:34.339')},
    {id: 3,message: "The other status was for a different subscription",subscription_id: 3,prev_status: "REJECTED",new_status: "APPROVED",updated_by: 9,created_at: new Date('2024-12-21 19:43:25.121')},
    {id: 4,message: "Testing...",subscription_id: 3,prev_status: "APPROVED",new_status: "APPROVED",updated_by: 9,created_at: new Date('2024-12-21 19:46:32.08')},
    {id: 5,message: "",subscription_id: 5,prev_status: "PENDING",new_status: "IN_PROGRESS",updated_by: 9,created_at: new Date('2025-01-05 03:35:43.113')},
    {id: 6,message: "This message is optional anyway...",subscription_id: 5,prev_status: "IN_PROGRESS",new_status: "REJECTED",updated_by: 11,created_at: new Date('2025-01-05 03:36:19.515')},
];