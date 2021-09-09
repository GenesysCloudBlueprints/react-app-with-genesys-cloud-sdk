---
title: Develop a React App with Typescript that uses the Genesys Cloud Platform SDK
author: Jacob Shaw
indextype: blueprint
icon: blueprint
image: images/5.png
category: 6
summary: |
  This Genesys Cloud Developer Blueprint demonstrates how to integrate the Genesys Cloud Javascript Platform SDK into your React app.  This example uses Typescript, although the implementation will be similar if you're using plain javascript.  The sample app provides examples of use cases such as creating a profile page for a user and admin operations like signing all the users out of a queue.  The blueprint will describe the steps needed to integrate the Genesys Cloud SDK into your React app.
---

<!-- no toc -->
* [Sample Application Features](#sample-application-features "Goes to the Sample Application Features section")
* [Solution Components](#solution-components "Goes to the Solutions Components section")
* [Requirements](#requirements "Goes to the Requirements section")
* [Running Locally](#running-locally "Goes to the Running Locally section")
* [Sample App Overview](#sample-app-overview "Overview of the sample app's features")
* [Configuring the Angular Project to use Genesys Cloud SDK](#configuring-the-angular-project-to-use-genesys-cloud-sdk "How to integrate the Genesys Cloud SDK")
* [Additional resources](#additional-resources "Goes to the Additional resources section")


![React App Flowchart](images/flowchart.png)

## Sample Application Features

- **User Home Page** - Displays meaningful information about the present user
- **User Search** - Allows a user to dynamically search for other Genesys Cloud users by name or email.
- **User Queues** - Displays information for the queues the user belongs to and provides an admin option to log out all users from the queue.

## Solution Components

- **React Application** - The React application that will be setup to use the Genesys Cloud Javascript Platform SDK
- **TypeScript** - Used alongside the React application in the sample app

### Software Development Kit (SDK)

- **Genesys Cloud Javascript Platform SDK** - Providing the steps for integrating this SDK and using it in meaningful ways is the focus of the sample app.

## Requirements

### Specialized knowledge

Implementing this solution requires experience in several areas or a willingness to learn:

- Genesys Cloud Platform API knowledge
- React knowledge
- Typescript knowledge

### Genesys Cloud account requirements

This solution requires a Genesys Cloud license. For more information on licensing, see [Genesys Cloud Pricing](https://www.genesys.com/pricing "Opens the pricing article").

A recommended Genesys Cloud role for the solutions engineer is Master Admin. For more information on Genesys Cloud roles and permissions, see the [Roles and permissions overview](https://help.mypurecloud.com/?p=24360 "Opens the Roles and permissions overview article").

## Running Locally

### Download the repository containing the project files
Go to the [repository](https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk) and clone it to your machine.

```bash
git clone https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk.git
```

### Create an Implicit Grant OAuth

1. Login to your Genesys Cloud organization and create a new OAuth Credential (Implicit Grant). [Create an OAuth Client](https://help.mypurecloud.com/articles/create-an-oauth-client/)
2. Add **https://localhost/** to the **Authorized redirect URIs**. Note: If you've changed the **redirecUri** value in the config file, then you need to add that new URI instead.
3. Add the following in the Scopes section:
    * analytics
    * authorization
    * presence
    * routing
    * users
4. Save the Client ID for use in the configuration of the project.

### Create a Client Credentials OAuth Grant for Genesys Cloud

1. Login to your Genesys Cloud organization and create a new OAuth Credential (Client Credentials Grant). [Create an OAuth Client](https://help.mypurecloud.com/articles/create-an-oauth-client/)
2. Select all of the admin **roles** for the OAuth client.
3. Take note of the Client ID and Client Secret.

### Update Configuration File

Modify the values in the configuration file before running the app. Use the values from the OAuth Client your created in the last step as follows:

clientConfig.js:

```javascript
export const clientConfig = {
  GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
  REDIRECT_URI: '<YOUR PRODUCTION URI HERE>',
};
```

### Run the App

Open a terminal and set the working directory to the root directory of the project, then run the following:

```bash
npm run install
npm run start
```

## Sample App Overview

### Genesys Cloud Utils

The `genesysCloudUtils` file contains the intermediate functions that in turn call Genesys Cloud SDK methods. These functions return promises that are handled upon resolution in the file and in the invoking components themselves.

### User Home Page

The home page serves as a profile page for the logged in user.  It formats meaningful information about the user into sections on the page.  Profile image, name, and user presence are at the top, and more detailed information about the user is found at the bottom.

### User Search

This search page allows the user to search listings of other users by name or email.  The results are cards that act as miniature profile pages for the found users.

### User Queues

The queue page contains listings for all the queues the logged in user belongs to.  The queue name is displayed along with some statistics about the queue. An example of admin functionality is also found here in the form of a button that logs out all the members of a queue.

## Configuring the React Project to use Genesys Cloud SDK

Now we'll look at the steps needed to integrate the Genesys Cloud SDK into your own React app.

### Creating a React Project

If you are creating a new app from scratch, run the following command in a terminal in the directory of your choice:

```bash
npx create-react-app name-of-your-app --template typescript
```
If you're configuring an existing React app, it is suggested that you use a version greater than v16.0, since the sample app uses React hooks introduced in React v16.0

### Installing NPM Packages

1. Install the Genesys Cloud Platform Client:

    ```bash
    npm install purecloud-platform-client-v2
    ```

### Import the platform-client-sdk to your Project

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

## Additional Resources

* [Genesys Cloud Platform SDK - Javascript](https://developer.genesys.cloud/api/rest/client-libraries/javascript/)
* [Github Repository](https://github.com/GenesysCloudBlueprints/react-app-with-genesys-cloud-sdk)
