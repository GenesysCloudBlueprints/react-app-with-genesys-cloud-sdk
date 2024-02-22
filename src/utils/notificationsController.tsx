/**
 * This file manages the channel that listens to conversation events.
 */

import platformClient from 'purecloud-platform-client-v2';
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
       .then((data: platformClient.Models.Channel) => {
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
           .then((_: platformClient.Models.ChannelTopicEntityListing) => {
               subscriptionMap[topic] = callback;
               console.log(`Added subscription to ${topic}`);
           });
    }
}