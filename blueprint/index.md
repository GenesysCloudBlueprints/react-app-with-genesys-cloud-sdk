---
title: Develop a React app with Typescript that uses the Genesys Cloud Platform SDK
author: jacob.shaw
indextype: blueprint
icon: blueprint
image: images/flowchart.png
category: 6
summary: |
  This Genesys Cloud Developer Blueprint demonstrates how to integrate the Genesys Cloud Javascript Platform SDK into a React app. This solution uses Typescript, although the implementation will be similar if you're using plain JavaScript.  This solution includes a sample React app that explores use cases such as creating a profile page for a user and completing admin operations such as signing all the users out of a queue.
---

This Genesys Cloud Developer Blueprint demonstrates how to integrate the Genesys Cloud Javascript Platform SDK into a React app. This solution uses Typescript, although the implementation will be similar if you're using plain JavaScript.  This solution includes a sample React app that explores use cases such as creating a profile page for a user and completing admin operations such as signing all the users out of a queue.

## Contents

* [Solution components](#solution-components "Goes to the Solutions components section")
* [Prerequisites](#prerequisites "Goes to the Prerequisites section")
* [Sample React app](#sample-react-app "Goes to the Sample React app section")
* [Configure the React project to use Genesys Cloud SDK](#configure-the-react-project-to-use-genesys-cloud-sdk "Goes to the Configure the React project to use Genesys Cloud SDK section")
* [Additional resources](#additional-resources "Goes to the Additional resources section")

![React App Flowchart](images/flowchart.png)

## Solution components

* **Genesys Cloud** - A suite of Genesys cloud services for enterprise-grade communications, collaboration, and contact center management. In this solution, a Genesys Cloud user account is required in order for the React app to be authorized to integrate with Genesys Cloud.
* **React** - A JavaScript library for efficiently building interactive user interfaces.  
* **TypeScript** - An object-oriented programming language that facilitates the development of JavaScript applications by supporting static typing.  

### Software development kits

* **Platform API Client SDK - Javascript** - Client libraries used to simplify application integration with Genesys Cloud by handling low-level HTTP requests. In this solution, the SDK authorizes the user and performs the API calls required to execute the administrator features.

***Question*** Please verify that second sentence

## Prerequisites

### Specialized knowledge

* Experience using the Genesys Cloud Platform API
* Experience with React
* Experience with Typescript or JavaScript  

### Genesys Cloud account requirements

This solution requires a Genesys Cloud license. For more information on licensing, see [Genesys Cloud Pricing](https://www.genesys.com/pricing "Opens the pricing article").

A recommended Genesys Cloud role for the solutions engineer is Master Admin. For more information on Genesys Cloud roles and permissions, see the [Roles and permissions overview](https://help.mypurecloud.com/?p=24360 "Opens the Roles and permissions overview article").

## Sample React app

Key features of the sample React app are:

* **User Home Page** - Displays meaningful information about the present user
* **User Search** - Allows a user to dynamically search for other Genesys Cloud users by name or email.
* **User Queues** - Displays information for the queues the user belongs to and provides an admin option to log out all users from the queue.

### Genesys Cloud Utils

The `genesysCloudUtils` file contains the intermediate functions that in turn call Genesys Cloud SDK methods. These functions return promises that are handled upon resolution in the file and in the invoking components themselves.

### User Home Page

The home page serves as a profile page for the logged in user.  It formats meaningful information about the user into sections on the page.  Profile image, name, and user presence are at the top, and more detailed information about the user is found at the bottom.

### User Search

This search page allows the user to search listings of other users by name or email.  The results are cards that act as miniature profile pages for the found users.

### User Queues

The queue page contains listings for all the queues the logged in user belongs to.  The queue name is displayed along with some statistics about the queue. An example of admin functionality is also found here in the form of a button that logs out all the members of a queue.

### Run the sample React app

### Create an Implicit Grant OAuth in Genesys Cloud

1. Log in to your Genesys Cloud organization and create a new OAuth Credential (Implicit Grant). [Create an OAuth Client](https://help.mypurecloud.com/articles/create-an-oauth-client/)
2. Add **http://localhost:3000** to the **Authorized redirect URIs**. Note: If you've changed the **redirecUri** value in the config file, then you need to add that new URI instead.
3. Add the following in the Scopes section:
    * analytics
    * authorization
    * presence
    * routing
    * users
4. Save the Client ID for use in the configuration of the project.

### Download the repository containing the project files
Go to the [React App With Genesys Cloud SDK](https://github.com/GenesysCloudBlueprints/react-app-with-genesys-cloud-sdk) repository and clone it to your machine.

```bash
git clone https://github.com/GenesysCloudBlueprints/react-app-with-genesys-cloud-sdk.git
```

## Implementation steps

## Create a Client Credentials OAuth Grant in Genesys Cloud

1. Log in to your Genesys Cloud organization and create a new OAuth Credential (Client Credentials Grant). [Create an OAuth Client](https://help.mypurecloud.com/articles/create-an-oauth-client/)
2. Select all of the admin **roles** for the OAuth client.
3. Take note of the Client ID and Client Secret.

### Update the configuration file

Modify the values in the configuration file before running the app. Use the values from the OAuth Client your created in the last step as follows:

clientConfig.js:

```javascript
export const clientConfig = {
  GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
  REDIRECT_URI: '<YOUR PRODUCTION URI HERE>',
};
```

### Run the app

Open a terminal and set the working directory to the root directory of the project, then run the following:

```bash
npm install
npm run start
```

## Configure the React project to use the Genesys Cloud SDK

Now we'll look at the steps needed to integrate the Genesys Cloud SDK into your own React app.

### Create a React project

If you are creating a new app from scratch, run the following commands in a terminal in the directory of your choice:

```bash
npm install -g npx
npx create-react-app name-of-your-app --template typescript
```

If you're configuring an existing React app, it is suggested that you use a version greater than v16.0, since the sample app uses React hooks introduced in React v16.0.
See the tsconfig.json file in the root directory of this project for a typescript configuration example.

### Install NPM packages

1. Install the Genesys Cloud Platform Client:

    ```bash
    npm install purecloud-platform-client-v2
    ```

### Import the platform-client-sdk to your project

Use the following to import the platform-client-sdk:

```javascript
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
```
You can now use the various API tools contained in the platformClient object.

Example:

```javascript
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
const searchApi = new platformClient.SearchApi();
const usersApi = new platformClient.UsersApi();
const analyticsApi = new platformClient.AnalyticsApi();
const tokensApi = new platformClient.TokensApi();
const routingApi = new platformClient.RoutingApi();
const presenceApi = new platformClient.PresenceApi();
```

## Additional resources

* [Genesys Cloud Platform SDK - Javascript](/api/rest/client-libraries/javascript/ "Goes to the Platform API Client SDK - JavaScript page") in the Genesys Cloud Developer Center
* [Create a New React App](https://reactjs.org/docs/create-a-new-react-app.html)
* [Github Repository](https://github.com/GenesysCloudBlueprints/react-app-with-genesys-cloud-sdk)
