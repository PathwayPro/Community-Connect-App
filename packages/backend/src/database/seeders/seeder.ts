import { InternalServerErrorException } from '@nestjs/common';
import { UsersData, MentorsData, UsersInterestsData } from './data/users.seed';
import { EventsCategoriesData, EventsData, EventsInvitationsData, EventsManagersData, EventsSubscriptionsData, EventsSubscriptionsUpdatesData } from './data/events.seed';
import { NewsData } from './data/news.seed';
import { ResourcesData } from './data/resources.seed';
import { PrismaClient } from '@prisma/client';
import { GoalsData } from './data/goals.seed';
import { InterestsData } from './data/interests';

const prisma = new PrismaClient();

const emptyTables = async () => {
    try {
    // DELETING IN ORDER TO PREVENT FK ERRORS
    console.log('\n\n 1. DELETING DATA (IN ORDER) TO PREVENT FK ERRORS:\n');

    // USERS-INTERESTS
    const usersInterestsStatus = (await prisma.usersInterests.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - USERS INTERESTS (${usersInterestsStatus}!)`);
    
    // INTERESTS
    const interestsStatus = (await prisma.interests.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - INTERESTS (${interestsStatus}!)`);
    
    // RESOURCES
    const resourcesStatus = (await prisma.resources.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - RESOURCES (${resourcesStatus}!)`);

    // NEWS
    const newsStatus = (await prisma.news.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - NEWS (${newsStatus}!)`);
    
    // EVENTS SUBSCRIPTIONS UPDATES
    const eventsSubscriptionsUpdatesStatus = (await prisma.eventsSubscriptionsUpdates.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - EVENTS SUBSCRIPTIONS UPDATES (${eventsSubscriptionsUpdatesStatus}!)`);
    
    // EVENTS SUBSCRIPTIONS UPDATES
    const eventsSubscriptionsStatus = (await prisma.eventsSubscriptions.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - EVENTS SUBSCRIPTIONS (${eventsSubscriptionsStatus}!)`);

    // EVENTS INVITATIONS
    const eventsInvitationsStatus = (await prisma.eventsInvitations.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - EVENTS INVITATIONS (${eventsInvitationsStatus}!)`);

    // EVENTS MANAGERS
    const eventsManagersStatus = (await prisma.eventsManagers.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - EVENTS MANAGERS (${eventsManagersStatus}!)`);

    // EVENTS
    const eventsStatus = (await prisma.events.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - EVENTS (${eventsStatus}!)`);

    // EVENTS CATEGORIES
    const eventsCategoriesStatus = (await prisma.eventsCategories.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - EVENTS CATEGORIES (${eventsCategoriesStatus}!)`);

    // MENTORS
    const mentorsStatus = (await prisma.mentors.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - MENTORS (${mentorsStatus}!)`);

    // USERS
    const usersStatus = (await prisma.users.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - USERS (${usersStatus}!)`);

    // GOALS
    const goalsStatus = (await prisma.usersGoals.deleteMany({})) ? 'OK' : 'ERROR';
    console.log(`     - GOALS (${goalsStatus}!)`);


    }catch(error){
        throw new InternalServerErrorException('| - - - - - > An error ocurred deleting records.', error)
    }
}

const seedGoals = async () => {
    try{
        console.log(`\n\n\n 2. SEEDING TABLE GOALS:   (${GoalsData.length} records)\n`)
        for(const g of GoalsData){
            if(await prisma.usersGoals.create({data: g})) 
            console.log(`     GOAL ID: ${g.id} created - - - - - - - > OK! `)
        else
            console.log(`     GOAL ID: ${g.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding goals:', error)
    }
}
const seedUsers = async () => {
    try{
        console.log(`\n\n\n 3. SEEDING TABLE USERS:   (${UsersData.length} records)\n`)
        for(const user of UsersData){
            if(await prisma.users.create({data: user}))  
            console.log(`     USER ID: ${user.id} created - - - - - - - > OK! `) 
        else
            console.log(`     USER ID: ${user.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding users:', error)
    }
}
const seedMentors = async () => {
    try{
        console.log(`\n\n\n 4. SEEDING TABLE MENTORS:   (${MentorsData.length} records)\n`)
        for(const mentor of MentorsData){
            if(await prisma.mentors.create({data: mentor})) 
            console.log(`     MENTOR ID: ${mentor.id} created - - - - - - - > OK! `)
            else
            console.log(`     MENTOR ID: ${mentor.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding mentors:', error)
    }
}
const seedEventsCategories = async () => {
    try{
        console.log(`\n\n\n 5. SEEDING TABLE EVENTS CATEGORIES:   (${EventsCategoriesData.length} records)\n`)
        for(const category of EventsCategoriesData){
            if(await prisma.eventsCategories.create({data: category})) 
            console.log(`     EVENT CATEGORY ID: ${category.id} created - - - - - - - > OK! `)
        else
            console.log(`     EVENT CATEGORY  ID: ${category.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events categories:', error)
    }
}
const seedEvents = async () => {
    try{
        console.log(`\n\n\n 6. SEEDING TABLE EVENTS:   (${EventsData.length} records)\n`)
        for(const ev of EventsData){
            if(await prisma.events.create({data: ev})) 
            console.log(`     EVENT ID: ${ev.id} created - - - - - - - > OK! `) 
        else
            console.log(`     EVENT ID: ${ev.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events:', error)
    }
}
const seedEventsManagers = async () => {
    try{
        console.log(`\n\n\n 7. SEEDING TABLE EVENTS MANAGERS:   (${EventsManagersData.length} records)\n`)
        for(const em of EventsManagersData){
            if(await prisma.eventsManagers.create({data: em})) 
            console.log(`     EVENT MANAGER ID: ${em.id} created - - - - - - - > OK! `) 
        else
            console.log(`     EVENT MANAGER ID: ${em.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events managers:', error)
    }
}
const seedEventsInvitations = async () => {
    try{
        console.log(`\n\n\n 8. SEEDING TABLE EVENTS INVITATIONS:   (${EventsInvitationsData.length} records)\n`)
        for(const ei of EventsInvitationsData){
            if(await prisma.eventsInvitations.create({data: ei})) 
            console.log(`     EVENT INVITATION ID: ${ei.id} created - - - - - - - > OK! `)
        else
            console.log(`     EVENT INVITATION ID: ${ei.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events invitations:', error)
    }
}
const seedEventsSubscriptions = async () => {
    try{
        console.log(`\n\n\n 9. SEEDING TABLE EVENTS SUBSCRIPTIONS:   (${EventsSubscriptionsData.length} records)\n`)
        for(const es of EventsSubscriptionsData){
            if(await prisma.eventsSubscriptions.create({data: es})) 
            console.log(`     EVENT SUBSCRIPTION ID: ${es.id} created - - - - - - - > OK! `)
        else
            console.log(`     EVENT SUBSCRIPTION ID: ${es.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events subscriptions:', error)
    }
}
const seedEventsSubscriptionsUpdates = async () => {
    try{
        console.log(`\n\n\n 10. SEEDING TABLE EVENTS SUBSCRIPTIONS UPDATES:   (${EventsSubscriptionsUpdatesData.length} records)\n`)
        for(const esu of EventsSubscriptionsUpdatesData){
            if(await prisma.eventsSubscriptionsUpdates.create({data: esu})) 
            console.log(`     EVENT SUBSCRIPTION UPDATE ID: ${esu.id} created - - - - - - - > OK! `)
        else
            console.log(`     EVENT SUBSCRIPTION UPDATE ID: ${esu.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events subscriptions updates:', error)
    }
}
const seedNews = async () => {
    try{
        console.log(`\n\n\n 11. SEEDING TABLE NEWS:   (${NewsData.length} records)\n`)
        for(const n of NewsData){
            if(await prisma.news.create({data: n})) 
            console.log(`     NEWS ID: ${n.id} created - - - - - - - > OK! `)
        else
            console.log(`     NEWS ID: ${n.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding news:', error)
    }
}
const seedResources = async () => {
    try{
        console.log(`\n\n\n 12. SEEDING TABLE RESOURCES:   (${ResourcesData.length} records)\n`)
        for(const r of ResourcesData){
            if(await prisma.resources.create({data: r})) 
            console.log(`     RESOURCE ID: ${r.id} created - - - - - - - > OK! `) 
        else
            console.log(`     RESOURCE ID: ${r.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding resources:', error)
    }
}
const seedInterests = async () => {
    try{
        console.log(`\n\n\n 13. SEEDING TABLE INTERESTS:   (${InterestsData.length} records)\n`)
        for(const i of InterestsData){
            if(await prisma.interests.create({data: i})) 
            console.log(`     INTEREST ID: ${i.id} created - - - - - - - > OK! `) 
        else
            console.log(`     INTEREST ID: ${i.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding interests:', error)
    }
}
const seedUsersInterests = async () => {
    try{
        console.log(`\n\n\n 14. SEEDING TABLE USERS-INTERESTS:   (${UsersInterestsData.length} records)\n`)
        for(const ui of UsersInterestsData){
            if(await prisma.usersInterests.create({data: ui})) 
            console.log(`     USERS-INTERESTS ID: ${ui} created - - - - - - - > OK! `) 
        else
            console.log(`     USERS-INTERESTS ID: ${ui} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding users-interests:', error)
    }
}

const seedAll = async () => {
    console.log('\n\n         - - - - - - - - - - - - - - \n       | R U N N I N G   S E E D E R | \n         - - - - - - - - - - - - - - \n\n')

    await emptyTables()
    await seedGoals()
    await seedUsers()
    await seedMentors()
    await seedEventsCategories()
    await seedEvents()
    await seedEventsManagers()
    await seedEventsInvitations()
    await seedEventsSubscriptions()
    await seedEventsSubscriptionsUpdates()
    await seedNews()
    await seedResources()
    await seedInterests()
    await seedUsersInterests()
}

seedAll();