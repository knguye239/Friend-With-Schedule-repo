import dotenv from 'dotenv';
import express from 'express';
import { google } from "googleapis";
import { useState } from 'react';

dotenv.config();

const router = express.Router();

// Google OAuth2.0 setup
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.readonly'];

router.get('/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type : "offline",
        scope : scopes
    });
    res.redirect(url);
});
const handleSubmit = (e)=>{
    e.preventDefault()
}
const [summary, setSummary]= useState('')
const [description, setDescription]= useState('')
const [location, setLocation]= useState('')
const [startDateTime, setStartDateTime]= useState('')
const [endDateTime, setendDateTime]= useState('')



// when google account successfully login and the page will redirect
router.get('/google/redirect', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Initialize calendar here
        const calendar = google.calendar({
            version: "v3",
            auth: oauth2Client
        });

        // check user's calendar list
        const calendarListResponse = await calendar.calendarList.list();
        const calendarIds = calendarListResponse.data.items.map(item => ({
            id: item.id,
            summary: item.summary
        }));

        if (calendarIds.length) {
            res.render('googleCalendar', { calendarIds: calendarIds });
        } else {
            res.send('No calendars found.');
        }

    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events.');
    }
});

// Add an event function
router.post('/createevent', async (req, res, next) => {
    try {
        const { calendarId, summary, description, location, startDateTime, endDateTime } = req.body;

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = {
            summary: summary,
            description: description,
            location: location,
            start: {
                dateTime: startDateTime,
                timeZone: 'UTC', // Adjust timeZone accordingly
            },
            end: {
                dateTime: endDateTime,
                timeZone: 'UTC', // Adjust timeZone accordingly
            },
        };

        const createdEvent = await calendar.events.insert({
            calendarId: calendarId,
            resource: event,
        });

        res.json({ message: 'Event created successfully', event: createdEvent.data });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});
router.post('/fetchEventsByCalendarId', async (req, res) => {
    const calendarId = req.body.calendarId;  
    
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // set 3 month
        const lastDayOfTargetMonth = new Date(now.getFullYear(), now.getMonth() + 3, 0);

        const calendar = google.calendar({version: 'v3', auth: oauth2Client});
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: firstDayOfMonth.toISOString(),
            timeMax: lastDayOfTargetMonth.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        const events = response.data.items;
        if (events.length) {
            let eventArray = events.map(event => {
                const start = event.start.dateTime || event.start.date;
                return {
                    title: event.summary,
                    start: start
                };
            });
            res.json(eventArray); 
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events.');
    }
});

export default router;
