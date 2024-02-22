import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home } from './components/home/Home.component';
import { NavBar } from './components/navbar/NavBar.component';
import { Queues } from './components/queues/Queues.component';
import { UserSearch } from './components/user-search/UserSearch.component';
import { authenticate, getUserByEmail, getUserMe } from './utils/genesysCloudUtils';
import { Models } from 'purecloud-platform-client-v2';
import './App.scss';

interface IUserDetails {
  images: IImage[],
  email: string,
  presence: {
    presenceDefinition: {
      systemPresence: string
    }
  }
}

interface IImage {
  imageUri: string
}


function App() {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [systemPresence, setSystemPresence] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    getPlatformClientData();
  }, []);

  async function getPlatformClientData() {
    await authenticate()
      .then((data: any) => {
        console.log('AUTH', data)
        return getUserMe();
      })
      .then((userDetailsResponse: IUserDetails) => {
        console.log('USER ME RESPONSE', userDetailsResponse);
        const presence = userDetailsResponse.presence?.presenceDefinition?.systemPresence || '';
        const url = userDetailsResponse.images?.[userDetailsResponse.images?.length - 1]?.imageUri || '';
        const userEmail = userDetailsResponse.email || '';
        userEmail && setUserEmail(userEmail);
        url && setAvatarUrl(url);
        presence && setSystemPresence(presence);
        return getUserByEmail(userEmail);
      })
      .then((userResponse: Models.UsersSearchResponse) => {
        console.log('USER', userResponse);
        const name: string | undefined = userResponse.results[0]?.name;
        name && setName(name);
        const userId: string | undefined = userResponse.results[0]?.id;
        userId && setUserId(userId);
        setInitialized(true)
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  return (
    <BrowserRouter>
        <NavBar/>
        <div className="content-wrapper">
          <Routes>
            <Route path='/' element={ 
              initialized && 
              <Home 
                avatarUrl={avatarUrl} 
                name={name} 
                systemPresence={systemPresence} 
                userEmail={userEmail} 
                userId={userId} /> 
            } />
            <Route path='/queues' element={ initialized && <Queues userId={userId}/> } />

            <Route path='/user-search' element={ initialized && <UserSearch/> } />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
