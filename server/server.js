import './config/env.js'; // MUST be first import
import app from './app.js';
import { ensureAdminExists } from './utils/adminInit.js';
import { fixMobileColumn } from './utils/schemaFix.js';
import { migrateEquipmentOwners } from './utils/equipmentOwnerMigration.js';
import { startCronJobs } from './utils/cronJobs.js';

const PORT = process.env.PORT || 5000;

// Initialize Database, Admin, Cron Jobs and Start Server
(async () => {
    await fixMobileColumn();
    await ensureAdminExists();
    await migrateEquipmentOwners();
    startCronJobs();

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
})();

