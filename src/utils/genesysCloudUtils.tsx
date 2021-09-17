import { clientConfig } from '../clientConfig';
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');

interface IPresenceData {
    id: string,
    systemPresence: string
}

interface IPresenceDefinitionsResponse {
    entities: IPresenceData[]
}

interface IQueue {
    id: string,
    activeUsers: number,
    onQueueUsers: number
}

const searchApi = new platformClient.SearchApi();
const usersApi = new platformClient.UsersApi();
const analyticsApi = new platformClient.AnalyticsApi();
const tokensApi = new platformClient.TokensApi();
const routingApi = new platformClient.RoutingApi();
const presenceApi = new platformClient.PresenceApi();

let offlinePresenceId = '';

const client = platformClient.ApiClient.instance;
const { clientId, redirectUri } = clientConfig;

export function authenticate() {
    return client.loginImplicitGrant(clientId, redirectUri, { state: 'state' })
        .then((data: any) => {
            return presenceApi.getPresencedefinitions();
        })
        .then((data: IPresenceDefinitionsResponse) => {
            if (!data.entities) return;
            console.log('PRESENCE DATA', data.entities);
            // Get the ID of the Offline Presence
            offlinePresenceId = data.entities
               .find((p: any) => p.systemPresence === 'Offline')!.id!;
            // Get the list for the other presences
            return data;
        })
        .catch((err: any) => {
            console.error(err);
        });
}

export function getUserByEmail(email: string) {
    const body = {
        pageSize: 25,
        pageNumber: 1,
        query: [{
            type: "TERM",
            fields: ["email", "name"],
            value: email
        }]
    };
    return searchApi.postUsersSearch(body);
}

export function getQueues(userId: string) {
    return usersApi.getUserQueues(userId);
}

export function getUserRoutingStatus(userId: string) {
    return usersApi.getUserRoutingstatus(userId);
}

export function logoutUser(userId: string) {
    return Promise.all([
        tokensApi.deleteToken(userId),
        presenceApi.patchUserPresence(userId, 'PURECLOUD', {
            presenceDefinition: { id: offlinePresenceId }
        })
    ])
}

export async function logoutUsersFromQueue(queueId: string) {
    routingApi.getRoutingQueueMembers(queueId)
        .then((data: any) => {
            return Promise.all(data.entities.map((user: any) => logoutUser(user.id)));
        })
        .catch((err: any) => {
            console.error(err);
        })
}

export function getQueueObservations(queues: IQueue[]) {
    const predicates = queues.map((queue: IQueue) => {
        return {
            type: 'dimension',
            dimension: 'queueId',
            operator: 'matches',
            value: queue.id
        }
    })
    const body = {
        filter: {
           type: 'or',
           predicates
        },
        metrics: [ 'oOnQueueUsers', 'oActiveUsers' ],
    }
    return analyticsApi.postAnalyticsQueuesObservationsQuery(body);
}

export function getUserMe() {
  return usersApi.getUsersMe({ 
      expand: ['routingStatus', 'presence'],
    });
}

export function getUserDetails(id: string) {
    return usersApi.getUser(id, { 
        expand: ['routingStatus', 'presence'],
      });
  }
