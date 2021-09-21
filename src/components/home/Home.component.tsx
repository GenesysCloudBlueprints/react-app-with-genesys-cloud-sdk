import React, { useEffect, useState } from 'react';
import './Home.component.scss';
import { 
  getUserRoutingStatus, 
} from '../../utils/genesysCloudUtils';
import notificationsController from '../../utils/notificationsController';
import defaultAvatar from '../../assets/default.svg' ;

interface IProps {
  avatarUrl: string,
  name: string,
  systemPresence: string,
  userEmail: string,
  userId: string
}

interface IRoutingStatus {
  status: string
}

interface IPresenceResponse {
  eventBody: IPresenceBody,
}

interface IPresenceBody {
  presenceDefinition: IPresenceDefinition
}

interface IPresenceDefinition {
  systemPresence: string
}

interface IRoutingResponse {
  eventBody: IRoutingBody,
}

interface IRoutingBody {
  routingStatus: IRoutingStatus
}


export function Home(props: IProps) {
  const { 
    avatarUrl, 
    name, 
    systemPresence: initSystemPresence, 
    userEmail,
    userId, 
  } = props;

  const [routingStatus, setRoutingStatus] = useState<string>('');
  const [systemPresence, setSystemPresence] = useState<string>(initSystemPresence)

  const firstName = name.split(' ')[0] || name;

  let presenceColor: string = '';
  switch(systemPresence.toLowerCase()) {
      case 'offline': 
          presenceColor = 'grey';
          break;
      case 'available':
          presenceColor = '#7D2';
          break;
      case 'busy' || 'meeting':
          presenceColor = 'red';
          break;
      case 'away' || 'break' || 'meal' || 'training':
          presenceColor = '#FB3';
          break;
      case 'on queue':
          presenceColor = '#52cef8';
          break;
      default: 
          presenceColor = 'black';
  }

  const presenceStyle = {
      color: presenceColor
  };

  useEffect(() => {
    if (userId) {
      getPlatformClientData();
      setupSubscriptions();
    }
  }, [userId]);

  async function setupSubscriptions() {
    const presenceTopic = `v2.users.${userId}.presence`;
    const routingStatusTopic = `v2.users.${userId}.routingStatus`;

    const presenceCallback = (data: IPresenceResponse) => {
      console.log('PRESENCE NOTIFICATION', data);
      const presence = data.eventBody?.presenceDefinition?.systemPresence;
      if (presence) {
        setSystemPresence(presence.toUpperCase().charAt(0) + presence.toLowerCase().slice(1));
      }
    };

    const routingStatusCallback = (data: IRoutingResponse) => {
      console.log('ROUTING NOTIFICATION', data);
      const status = data.eventBody?.routingStatus?.status;
      if (status) {
        setRoutingStatus(status);
      }
    };

    await notificationsController.createChannel()
      .then(() => {
        notificationsController.addSubscription(presenceTopic, presenceCallback);
      })
      .then(() => {
        notificationsController.addSubscription(routingStatusTopic, routingStatusCallback);
      })
  }

  async function getPlatformClientData() {
    await getUserRoutingStatus(userId)
      .then((routingStatusResponse: IRoutingStatus) => {
        console.log('ROUTING STATUS', routingStatusResponse);
        setRoutingStatus(routingStatusResponse.status);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  return routingStatus 
    ? (
      <div className="home">
          <div className="home__header">
            <div style={{ border: `4px solid ${presenceColor}`}}>
              <img src={avatarUrl || defaultAvatar} alt="user" height="auto" width="115px"/>
            </div>
            <h3>Welcome, {name}!</h3>
            <i style={presenceStyle}>{systemPresence}</i>
          </div>
          <div className="home__description">
            <div className="home__description-title">
              <h4>What is this App?</h4>
            </div>
            <p>This is a blueprint demonstrating some functionality of the Genesys Cloud SDK in a React setting.</p>
            <div>
              It contains examples for:
                <ul>
                  <li>Displaying a user's own live system info</li>
                  <li>User lookup by email and name</li>
                  <li>Displaying a user's real-time queue information</li>
                </ul>
            </div>
          </div>
          <div className="home__footer">
            <h6>User Info for {firstName}</h6>
              <ul>
                <li key="user-info-1"><strong>id:</strong> {userId} </li>
                <li key="user-info-2"><strong>name:</strong> {name}</li>
                <li key="user-info-3"><strong>email:</strong> {userEmail}</li>
                <li key="user-info-4"><strong>status:</strong> {routingStatus}</li>
              </ul>
          </div>
      </div>
    )
    : (
      <div>
      </div>
    );
}