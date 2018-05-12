import { RestItem } from './rest-item';

export class MarathonApp extends RestItem {
    id: String;
    name: String;
    instances: Number;
    healthyness: number;

    // deployments: String;
    // configuredInstances: String;
    // tasksStaged: String;
    // tasksHealthy: String;
    // tasksUnhealthy: String;
    // tasksRunning: String;
    
  }