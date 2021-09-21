/**
 * This file manages the channel that listens to conversation events.
 */

interface IChannelResponse {
    connectUri: string,
    expires: string,
    id: string
}

interface IEntity {
    id: string
}

interface ISubscriptionResponse {
    entities: IEntity[]
}

const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
const notificationsApi = new platformClient.NotificationsApi();
 
let channel: any = {};
let ws = null;
 
// Object that will contain the subscription topic as key and the
// callback function as the value
const subscriptionMap: any = {
    'channel.metadata': () => {
        console.log('Notification heartbeat.');
    }
};
 
/**
 * Callback function for notications event-handling.
 * It will reference the subscriptionMap to determine what function to run
 * @param {Object} event 
 */
function onSocketMessage(event: any){
    const data = JSON.parse(event.data);

    subscriptionMap[data.topicName](data);
}

export default {
    /**
     * Creation of the channel. If called multiple times,
     * the last one will be the active one.
     */
    createChannel(){
       return notificationsApi.postNotificationsChannels()
       .then((data: IChannelResponse) => {
            console.log('---- Created Notifications Channel ----');
            channel = data;
            ws = new WebSocket(channel.connectUri);
            ws.onmessage = onSocketMessage;
       });
    },

    /**
     * Add a subscription to the channel
     * @param {String} topic Genesys Cloud notification topic string
     * @param {Function} callback callback function to fire when the event occurs
     */
    addSubscription(topic: string, callback: any){
        const body = [{'id': topic}];

        return notificationsApi.postNotificationsChannelSubscriptions(channel.id, body)
           .then((data: ISubscriptionResponse) => {
               subscriptionMap[topic] = callback;
               console.log(`Added subscription to ${topic}`);
           });
    }
}