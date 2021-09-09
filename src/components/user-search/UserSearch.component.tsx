import React, { useState } from 'react';
import { getUserByEmail, getUserDetails } from '../../utils/genesysCloudUtils';
import defaultAvatar from '../../assets/default.svg';
import './UserSearch.component.scss'

interface IUser {
    id: string,
    imageUrl?: string,
    name: string,
    email: string,
    systemPresence?: string
}

interface IUserResponse {
    results: IUser[] 
}

interface IUserDetails {
    id: string,
    images: IImage[],
    presence: {
        presenceDefinition: {
            systemPresence: string
        }
    }
}

interface IImage {
    imageUri: string
}

export function UserSearch() {
    const [searchString, setSearchString] = useState<string>('');
    const [users, setUsers] = useState<any[]>([])

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let searchTerm: string = e.target.value;
        setSearchString(searchTerm);
        let tempUsers: any[];
        await getUserByEmail(searchTerm.trim())
            .then((userResponse: IUserResponse) => {
                const userResults = (userResponse.results || []).map((result: any) => {
                    const userResult: IUser = {
                        id: result.id || '',
                        imageUrl: '',
                        name: result.name || '',
                        email: result.email || '',
                        systemPresence: ''
                    };
                    return userResult;
                });
                tempUsers = userResults || [];
                return Promise.all(userResults.map((userResult: any) => getUserDetails(userResult.id)));
            })
            .then((userDetailsResponse: IUserDetails[]) => {
                console.log('USER DETAILS RESPONSE', userDetailsResponse);
                userDetailsResponse.forEach((userDetail: any) => {
                    const presence = userDetail.presence?.presenceDefinition?.systemPresence || '';
                    const url = userDetail.images?.[userDetail.images?.length - 1]?.imageUri || '';
                    const user = tempUsers.find((user: IUser) => user.id === userDetail.id);
                    user.imageUrl = url;
                    user.systemPresence = presence;
                });
                setUsers(tempUsers);
            })
            .catch((err: any) => {
                console.error(err);
            })
    }

    function renderUserCards(user: any, index: number) {
        const {
            email,
            id,
            imageUrl,
            name,
            systemPresence
        } = user;

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
        };

        const presenceStyle = {
            color: presenceColor
        };

        return (
            <div key={`user-card-${index}`} className="user-search__card">
                <span className="user-search__card-left">
                    <img src={imageUrl || defaultAvatar} alt="user" width="auto" height="70px" />
                </span>
                <span className="user-search__card-center">
                    <div>
                        <h5>{name || ''}</h5>
                    </div>
                    <div>
                        id: {id || ''}
                    </div>
                    <div>
                        email: {email || ''}
                    </div>
                </span>
                <span className="user-search__card-right">
                    <div>
                        <i style={presenceStyle}>{systemPresence || ''}</i>
                    </div>
                </span>
            </div>
        );
    }

    return (
        <div className="user-search">
            <div className="user-search__title">
                <h3>User Search</h3>
                <input value={searchString} onChange={handleChange} placeholder="Search users by email or name..." />
            </div>
            {users.map((user: any, i: number) => {
              return renderUserCards(user, i);
            })} 
        </div>
    )
}