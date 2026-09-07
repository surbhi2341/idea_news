import cron from 'node-cron';
import { checkScheduledPublish } from '../controllers/newsController.js';

export const startCronJobs = () => {
  // Check for scheduled articles every minute
  cron.schedule('* * * * *', () => {
    checkScheduledPublish();
  });
  console.log('[Cron] Automated cron scheduler started (checking scheduled publications every 1 minute)');
};
