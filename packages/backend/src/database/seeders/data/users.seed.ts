import { mentors, users } from "@prisma/client";

const GeneralUsersData = {
    middle_name: "Password123!",
    password_hash: "$2b$10$Kf9ZbgWNeJX8HT9we5l4K.fMUdrPQEv8WRwYuQDEGoYoEelvntSdG",
    dob: undefined,
    show_dob: false,
    arrival_in_canada: undefined,
    goal_id: 0,
    verification_token: "",
    email_verified: true,
    refresh_token: "",
    last_logout: new Date()
};

export const UsersData:users[] = [
    {id: 1,first_name: "U test",last_name: "User1",email: "user1@sv.com",role:"USER",...GeneralUsersData},
    {id: 3,first_name: "U test",last_name: "User2",email: "user2@sv.com",role:"USER",...GeneralUsersData},
    {id: 7,first_name: "U-M test",last_name: "User w Mentor",email: "um@sv.com",role:"USER",...GeneralUsersData},
    {id: 8,first_name: "M test",last_name: "Mentor1",email: "mentor1@sv.com",role:"MENTOR",...GeneralUsersData},
    {id: 9,first_name: "M test",last_name: "Mento2",email: "mentor2@sv.com",role:"MENTOR",...GeneralUsersData},
    {id: 10,first_name: "A test",last_name: "Admin1",email: "admin1@sv.com",role:"ADMIN",...GeneralUsersData},
    {id: 11,first_name: "A test",last_name: "Admin2",email: "admin2@sv.com",role:"ADMIN",...GeneralUsersData},
];

export const MentorsData:mentors[] = [
    {id: 1,max_mentees: 20,availability: "Mondays around 8PM MST",has_experience: true,experience_details: "I have experience...",status: "PENDING",user_id: 7},
    {id: 2,max_mentees: 50,availability: "Tuesday to Saturday, anytime",has_experience: true,experience_details: "Some experience details...",status: "APPROVED",user_id: 8},
    {id: 5,max_mentees: 50,availability: "EDITED: Monday to Friday after 3PM MST",has_experience: true,experience_details: "Some details about a experience",status: "APPROVED",user_id: 9},
];