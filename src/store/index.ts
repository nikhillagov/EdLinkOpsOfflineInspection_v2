/**
 * Vuex Store Configuration
 */

import { createStore } from 'vuex';

// Core modules
import inspectionModule from './modules/inspection';
import syncModule from './modules/sync';

// Authentication & User modules
import authModule from './modules/auth';
import userModule from './modules/user';

// Business domain modules
import entityModule from './modules/entity';
import licenseModule from './modules/license';
import actionRequestModule from './modules/action-request';
import serviceRequestModule from './modules/service-request';
import vorModule from './modules/vor';

// UI & App modules
import appModule from './modules/app';
import uiModule from './modules/ui';

export default createStore({
  modules: {
    // Core modules
    inspection: inspectionModule,
    sync: syncModule,

    // Auth & User
    auth: authModule,
    user: userModule,

    // Business domains
    entity: entityModule,
    license: licenseModule,
    actionRequest: actionRequestModule,
    serviceRequest: serviceRequestModule,
    vor: vorModule,

    // UI & App
    app: appModule,
    ui: uiModule
  }
});
