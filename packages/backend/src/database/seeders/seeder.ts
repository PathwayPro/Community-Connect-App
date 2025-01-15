import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersData, MentorsData } from './data/users.seed';
import { EventsCategoriesData, EventsData, EventsInvitationsData, EventsManagersData, EventsSubscriptionsData, EventsSubscriptionsUpdatesData } from './data/events.seed';
import { NewsData } from './data/news.seed';
import { ResourcesData } from './data/resources.seed';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const emptyTables = async () => {
    try {
        // DELETING IN ORDER TO PREVENT FK ERRORS
        console.log('\n\n 1. DELETING DATA (IN ORDER) TO PREVENT FK ERRORS:\n');

        // RESOURCES
        const resourcesStatus = (await prisma.resources.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.1 RESOURCES (${resourcesStatus}!)`);

        // NEWS
        const newsStatus = (await prisma.news.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.2 NEWS (${newsStatus}!)`);
        
        // EVENTS SUBSCRIPTIONS UPDATES
        const eventsSubscriptionsUpdatesStatus = (await prisma.eventsSubscriptionsUpdates.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.3 EVENTS SUBSCRIPTIONS UPDATES (${eventsSubscriptionsUpdatesStatus}!)`);
        
        // EVENTS SUBSCRIPTIONS UPDATES
        const eventsSubscriptionsStatus = (await prisma.eventsSubscriptions.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.4 EVENTS SUBSCRIPTIONS (${eventsSubscriptionsStatus}!)`);

        // EVENTS INVITATIONS
        const eventsInvitationsStatus = (await prisma.eventsInvitations.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.5 EVENTS INVITATIONS (${eventsInvitationsStatus}!)`);

        // EVENTS MANAGERS
        const eventsManagersStatus = (await prisma.eventsManagers.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.6 EVENTS MANAGERS (${eventsManagersStatus}!)`);

        // EVENTS
        const eventsStatus = (await prisma.events.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.7 EVENTS (${eventsStatus}!)`);

        // EVENTS CATEGORIES
        const eventsCategoriesStatus = (await prisma.eventsCategories.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.8 EVENTS CATEGORIES (${eventsCategoriesStatus}!)`);

        // MENTORS
        const mentorsStatus = (await prisma.mentors.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.9 MENTORS (${mentorsStatus}!)`);

        // USERS
        const usersStatus = (await prisma.users.deleteMany({})) ? 'OK' : 'ERROR';
        console.log(`     1.10 USERS (${usersStatus}!)`);


    }catch(error){
        throw new InternalServerErrorException('| - - - - - > An error ocurred deleting records.')
    }
}

const seedUsers = async () => {
    try{
        console.log(`\n\n\n 2. SEEDING TABLE USERS:   (${UsersData.length} records)\n`)
        for(const user of UsersData){
            (await prisma.users.create({data: user})) ?  
            console.log(`     USER ID: ${user.id} created - - - - - - - > OK! `) :
            console.log(`     USER ID: ${user.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding users:', error)
    }
}
const seedMentors = async () => {
    try{
        console.log(`\n\n\n 3. SEEDING TABLE MENTORS:   (${MentorsData.length} records)\n`)
        for(const mentor of MentorsData){
            (await prisma.mentors.create({data: mentor})) ? 
            console.log(`     MENTOR ID: ${mentor.id} created - - - - - - - > OK! `) :
            console.log(`     MENTOR ID: ${mentor.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding mentors:', error)
    }

    return true;
}
const seedEventsCategories = async () => {
    try{
        console.log(`\n\n\n 3. SEEDING TABLE EVENTS CATEGORIES:   (${EventsCategoriesData.length} records)\n`)
        for(const category of EventsCategoriesData){
            (await prisma.eventsCategories.create({data: category})) ? 
            console.log(`     EVENT CATEGORY ID: ${category.id} created - - - - - - - > OK! `) :
            console.log(`     EVENT CATEGORY  ID: ${category.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events categories:', error)
    }

    return true;
}
const seedEvents = async () => {
    try{
        console.log(`\n\n\n 4. SEEDING TABLE EVENTS:   (${EventsData.length} records)\n`)
        for(const ev of EventsData){
            (await prisma.events.create({data: ev})) ? 
            console.log(`     EVENT ID: ${ev.id} created - - - - - - - > OK! `) :
            console.log(`     EVENT ID: ${ev.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events:', error)
    }

    return true;
}
const seedEventsManagers = async () => {
    try{
        console.log(`\n\n\n 5. SEEDING TABLE EVENTS MANAGERS:   (${EventsManagersData.length} records)\n`)
        for(const em of EventsManagersData){
            (await prisma.eventsManagers.create({data: em})) ? 
            console.log(`     EVENT MANAGER ID: ${em.id} created - - - - - - - > OK! `) :
            console.log(`     EVENT MANAGER ID: ${em.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events managers:', error)
    }

    return true;
}
const seedEventsInvitations = async () => {
    try{
        console.log(`\n\n\n 6. SEEDING TABLE EVENTS INVITATIONS:   (${EventsInvitationsData.length} records)\n`)
        for(const ei of EventsInvitationsData){
            (await prisma.eventsInvitations.create({data: ei})) ? 
            console.log(`     EVENT INVITATION ID: ${ei.id} created - - - - - - - > OK! `) :
            console.log(`     EVENT INVITATION ID: ${ei.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events invitations:', error)
    }

    return true;
}
const seedEventsSubscriptions = async () => {
    try{
        console.log(`\n\n\n 7. SEEDING TABLE EVENTS SUBSCRIPTIONS:   (${EventsSubscriptionsData.length} records)\n`)
        for(const es of EventsSubscriptionsData){
            (await prisma.eventsSubscriptions.create({data: es})) ? 
            console.log(`     EVENT SUBSCRIPTION ID: ${es.id} created - - - - - - - > OK! `) :
            console.log(`     EVENT SUBSCRIPTION ID: ${es.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events subscriptions:', error)
    }

    return true;
}
const seedEventsSubscriptionsUpdates = async () => {
    try{
        console.log(`\n\n\n 8. SEEDING TABLE EVENTS SUBSCRIPTIONS UPDATES:   (${EventsSubscriptionsUpdatesData.length} records)\n`)
        for(const esu of EventsSubscriptionsUpdatesData){
            (await prisma.eventsSubscriptionsUpdates.create({data: esu})) ? 
            console.log(`     EVENT SUBSCRIPTION UPDATE ID: ${esu.id} created - - - - - - - > OK! `) :
            console.log(`     EVENT SUBSCRIPTION UPDATE ID: ${esu.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding events subscriptions updates:', error)
    }

    return true;
}
const seedNews = async () => {
    try{
        console.log(`\n\n\n 9. SEEDING TABLE NEWS:   (${NewsData.length} records)\n`)
        for(const n of NewsData){
            (await prisma.news.create({data: n})) ? 
            console.log(`     NEWS ID: ${n.id} created - - - - - - - > OK! `) :
            console.log(`     NEWS ID: ${n.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding news:', error)
    }

    return true;
}
const seedResources = async () => {
    try{
        console.log(`\n\n\n 10. SEEDING TABLE RESOURCES:   (${ResourcesData.length} records)\n`)
        for(const r of ResourcesData){
            (await prisma.resources.create({data: r})) ? 
            console.log(`     RESOURCE ID: ${r.id} created - - - - - - - > OK! `) :
            console.log(`     RESOURCE ID: ${r.id} created - - - - - - - > ERROR! `);
        }
    }catch(error){
        throw new InternalServerErrorException('There was an error seeding resources:', error)
    }

    return true;
}

const seedAll = async () => {
    console.log('\n\n         - - - - - - - - - - - - - - \n       | R U N N I N G   S E E D E R | \n         - - - - - - - - - - - - - - \n\n')

    await emptyTables()
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
}

seedAll();