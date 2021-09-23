import React, { useEffect, useRef, useState } from 'react';
import { 
    getQueues, 
    getQueueObservations, 
    logoutUsersFromQueue 
} from '../../utils/genesysCloudUtils';
import notificationsController from '../../utils/notificationsController';
import './Queues.component.scss'

interface IQueueResponse {
    entities: IQueue[]
}

interface IQueueObservationResponse {
    results: IQueueObservation[]
}

interface IQueue {
    id: string,
    activeUsers: number,
    onQueueUsers: number
}

interface IQueueObservation {
    data: IData[],
    group: {
        queueId: string
    }
}

interface IData {
    metric: string,
    stats: {
        count: number
    }
}

interface IProps {
    userId: string
}

export function Queues(props: IProps) {
    const [queues, setQueues] = useState<IQueue[]>([]);

    const queueRef: React.MutableRefObject<any> = useRef({});
    queueRef.current = queues;

    useEffect(() => {
        getQueueInfo();
        refreshQueueObservations();
    }, []);

    async function getQueueInfo() {
      const { userId } = props;
      let tempQueues: any;
      await getQueues(userId)
        .then((queueResponse: IQueueResponse) => {
          console.log('QUEUES', queueResponse);
          tempQueues = queueResponse?.entities;
          return getQueueObservations(tempQueues)
        })
        .then((queueObservationResponse: IQueueObservationResponse) => {
          console.log('OBSERVATION METRICS', queueObservationResponse);
          const { results = [] } = queueObservationResponse;
          results.forEach((result: any) => {
            const queue = (tempQueues || [])
              .find((queue: any) => queue.id === result.group?.queueId );
            const activeUsersMetric = result.data
              .find((datum: any) => datum.metric === 'oActiveUsers');
            queue.activeUsers = activeUsersMetric?.stats?.count || 0;
            const onQueueUsersMetric = result.data
              .find((datum: any) => datum.metric === 'oOnQueueUsers')
            queue.onQueueUsers = onQueueUsersMetric?.stats?.count || 0;
          })
          tempQueues && setQueues(tempQueues);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }

    function refreshQueueObservations() {
      setInterval(async() => {
        queueObservationWrapper();
      }, 30000);
    }
  
  
    async function queueObservationWrapper() {
      const tempQueues = queueRef.current;
      await getQueueObservations(queueRef.current)
        .then((queueObservationResponse: IQueueObservationResponse) => {
          console.log('OBSERVATION METRICS', queueObservationResponse);
          const { results = [] } = queueObservationResponse;
          if (results.length > 0) {
            results.forEach((result: any) => {
              const queue = (tempQueues || [])
                .find((queue: any) => queue.id === result.group?.queueId);
              const activeUsersMetric = (result?.data || [])
                .find((datum: any) => datum.metric === 'oActiveUsers');
              if (queue) {
                queue.activeUsers = activeUsersMetric?.stats?.count || 0;
                const onQueueUsersMetric = (result?.data || [])
                  .find((datum: any) => datum.metric === 'oOnQueueUsers')
                queue.onQueueUsers = onQueueUsersMetric?.stats?.count || 0;
              }
            });
            tempQueues && setQueues(tempQueues);
          }
        })
        .catch((err: any) => {
          console.error(err);
        })
    }
    

    async function handleQueueLogout(e: React.MouseEvent<HTMLButtonElement>) {
        const queueId = e.currentTarget.value;
        await logoutUsersFromQueue(queueId)
          .then((data: any) => {
            queueObservationWrapper();
          })
      }

    function renderQueueCards(queue: any, index: number) {
        return (
          <div key={`queue-card-${index}`} className="queue__card">
              <div className="queue__card-left">
                <div>
                  <h5>{queue.name}</h5>
                </div>
                <div>
                <span className="queue__property-title">id: </span><span>{queue.id}</span>
                </div>
              </div>
              <div className="queue__card-center">
                <span>
                  <span className="queue__property-title">On Queue:</span> {queue.onQueueUsers}
                </span>
                <span>
                  <span className="queue__property-title">Active Members:</span> {queue.activeUsers}
                </span>
              </div>
              <div className="queue__card-right">
                <button className="btn btn-primary" onClick={handleQueueLogout} value={queue.id}>
                  Log Out All Agents
                </button>
              </div>
            </div>
        );
    }

    return (
        <div className="queue">
            <div className="queue__title">
                <h3>Queue Membership</h3>
                <p>This is a list of the queues you belong to.</p>
            </div>
            {queues.map((queue: any, i: number) => {
              return renderQueueCards(queue, i);
            })}
        </div>
    )
}