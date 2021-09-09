import { fireEvent, render, screen } from '@testing-library/react';
import { Home } from './components/home/Home.component';
import { Queues } from './components/queues/Queues.component';
import { UserSearch } from './components/user-search/UserSearch.component';
import * as utils from './utils/genesysCloudUtils';

jest.mock('./utils/genesysCloudUtils')

// Home component
test('renders user info in Home component', async () => {
  const mockRoutingStatus = jest.spyOn(utils, 'getUserRoutingStatus');
  mockRoutingStatus.mockResolvedValue({ status: 'OFF_QUEUE' });
  render(<Home avatarUrl="image.png" name="Snake Plissken" systemPresence="Available" userEmail="s.plissken@yahoo.com" userId="userId"/>);
  const userInfoHeader = await screen.findByText('Available');
  expect(userInfoHeader).toBeInTheDocument();
});

// Queues component
test('renders queues in Queues component', async () => {
  const mockQueues = jest.spyOn(utils, 'getQueues');
  const mockQueueObservations = jest.spyOn(utils, 'getQueueObservations')
  mockQueues.mockResolvedValue({
    entities: [{
      activeUsers: 1,
      id: 333,
      name: 'The Best Queue',
      onQueueUsers: 3,
    }]
  });
  mockQueueObservations.mockResolvedValue({
    results: [{
      group: {
        queueId: 333
      },
      data: [{
        metric: 'oActiveUsers',
        stats: {
          count: 1
        }
      },
      {
        metric: 'oOnQueueUsers',
        stats: {
          count: 3
        }
      }]
    }]
  })
  render(<Queues userId="userId"/>);
  const activeMembers = await screen.findByText('Active Members:');
  expect(activeMembers).toBeInTheDocument();
});

// User Search component
test('renders user cards in User Search component', async () => {
  const mockUserByEmail = jest.spyOn(utils, 'getUserByEmail');
  const mockUserDetails = jest.spyOn(utils, 'getUserDetails');
  mockUserByEmail.mockResolvedValue({
    results: [{
      email: 'example@gmail.com',
      id: 'userId',
      name: 'John Wu'
    }]
  });
  mockUserDetails.mockResolvedValue({
    id: 'userId',
    images: [{
      imageUri: "image.jpeg"
    }],
    presence: {
      presenceDefinition: {
        systemPresence: "Offline"
      }
    }
  })
  render(<UserSearch />);
  const searchInput = screen.getByPlaceholderText('Search users by email or name...');
  fireEvent.change(searchInput, { target: { value: 'search phrase'}})
  const name = await screen.findByText('John Wu');
  expect(name).toBeInTheDocument();
});
