import React, { useEffect, useState } from 'react';
import './Home.component.scss';
import { 
  getUserRoutingStatus, 
} from '../../utils/genesysCloudUtils';
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

export function Home(props: IProps) {
  const [routingStatus, setRoutingStatus] = useState<string>('');

  const { 
    avatarUrl, 
    name, 
    systemPresence, 
    userEmail,
    userId, 
  } = props;

  const firstName = name.split(' ')[0] || name;

  let presenceColor: string = '';
  switch(systemPresence.toLowerCase()) {
      case 'offline': 
          presenceColor = 'grey';
          break;
      case 'available':
          presenceColor = 'green';
          break;
      case 'busy' || 'meeting':
          presenceColor = 'red';
          break;
      case 'away' || 'break' || 'meal' || 'training':
          presenceColor = 'yellow';
          break;
      default: 
          presenceColor = 'black';
  }

  const presenceStyle = {
      color: presenceColor
  };

  useEffect(() => {
    userId && getPlatformClientData();
  }, []);

  const getPlatformClientData = async() => {
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
                  <li>Displaying a user's own system info</li>
                  <li>User lookup by email and name</li>
                  <li>Displaying a user's queue information</li>
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