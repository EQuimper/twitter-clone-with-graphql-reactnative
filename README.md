# Twitter Clone with Graphql and React-Native

- [Part 1](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-1)
- [Part 2](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-2---tweet-basic-crud)
- [Part 3](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-3---creation-of-the-user-with-signup-and-login-resolvers)
- [Part 4](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-4---authentication-server-side-with-jwt)
- [Part 5](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-5---add-tweet-belongs-to-user)
- [Part 6](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-6---setup-of-mobile-side)
- [Part 7](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-7---design-of-feed-card)
- [Part 8](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative/tree/ep08#part-8---setup-the-navigations)
- [Part 9](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-9---connect-the-mobile-app-with-the-server)
- [Part 10](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-10---designing-the-signup-screen)
- [Part 11](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-11---authorization-and-apollo-middleware)
- [Part 12](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-12---me-query-with-header-avatar-and-logout)
- [Part 13](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-13---designing-the-newtweetscreen)
- [Part 14](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-14---createtweet-mutation-add-to-the-newscreentweet--optimistic-ui)
- [Part 15](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-15---subscriptions-for-real-time-data---tweetcreation)
- [Part 16-Prelude](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-16-prelude---talk-about-the-favorite-tweet-features)
- [Part 16](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-16---code-the-favorite-tweet-features-server-side)
- [Part 17](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-17---favorite-tweet-mutation-mobile-side)
- [Part 18](https://github.com/EQuimper/twitter-clone-with-graphql-reactnative#part-18---adding-ui-change-for-the-favorite-tweet)

### What is this?

This is a simple Youtube tutorial where we go over some new tech. The end product is to build a Twitter kind of clone where we have real time updates.

[End Product Intro Video](https://youtu.be/U9OfNJ9Ia70)

### Prerequisites

- Installation of MongoDB, React Native and Nodejs
- Understanding of MongoDB, Nodejs, React Native and a bit of GraphQL
- Know what websocket are
- Be patient with me ;)

## Part 1

### Video

- [The Setup](https://youtu.be/33qP1QMmjv8)
- [Part 1](https://youtu.be/qLBwByURMf8)

This part is mainly for the basic setup of the server. We go over the installation of Express and the basic GraphQL setup. We also add MongoDB and we make mocks on it.

1. Create a folder to put the server and mobile folder in
2. Cd into the server folder and run the command `yarn init` and click enter on each question
3. Run `yarn add express cross-env body-parser`
4. Create a folder called `src` and create a file inside called `index.js`
5. Put the basic setup of express at the top of the file

```js
import express from 'express';
import bodyParser from 'body-parser';

const app = express(); // create an instance of express

const PORT = process.env.PORT || 3000; // create the port

app.use(bodyParser.json()); // add body-parser as the json parser middleware

app.listen(PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`App listen on port: ${PORT}`);
  }
});
```
5. Now we need to install babel in the devDependencies because we want to write in latest javascript feature.

`yarn add -D babel-cli babel-plugin-transform-object-rest-spread babel-preset-env`

6. Go into your `package.json` and add this script under the scripts:

```json
"dev": "cross-env NODE_ENV=dev nodemon --exec babel-node src/index.js"
```

7. Create a `.babelrc` with these settings:

```
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "node": "6.10"
        }
      }
    ]
  ],
  "plugins": [
    [
      "transform-object-rest-spread",
      {
        "useBuiltIns": true
      }
    ]
  ]
}
```

Here I make use of `babel-preset-env`. This helps us to setup babel without pain.

8. Now it is time to set up some GraphQL stuff. First create a folder called `graphql` inside `src`. After that create a `schema.js` file and put the follow in it:

```js
export default`
  type Tweet {
    _id: String
    text: String
  }

  type Query {
    getTweets: [Tweet]
  }

  schema {
    query: Query
  }
`;
```

Here we have a basic schema for the tweet. Also we have a query call `getTweets` you render a list of this tweet.

9. Now it's time to write the resolver for the `getTweets`. Create a folder `resolvers` inside `src/graphql/`. After that, create a file called `tweet-resolver.js`. Inside this one put this:

```js
import Tweet from '../../models/Tweet';

export default {
  getTweets: () => Tweet.find({})
}
```

And create a `index.js` file inside `src/graphql/resolvers/` folder and put :

```js
import TweetResolvers from './tweet-resolver';

export default {
  Query: {
    getTweets: TweetResolvers.getTweets
  }
}
```

But where did this `Tweet` models come from? Yes, this is time to setup the db.

10. Create a `db.js` inside the `src/config/` folder. Put this lines in after running this command.

`yarn add mongoose`

```js
/* eslint-disable no-console */

import mongoose from 'mongoose';

import constants from './constants';

mongoose.Promise = global.Promise;

mongoose.set('debug', true); // debug mode on

try {
  mongoose.connect(constants.DB_URL, {
    useMongoClient: true,
  });
} catch (err) {
  mongoose.createConnection(constants.DB_URL, {
    useMongoClient: true,
  });
}

mongoose.connection
  .once('open', () => console.log('MongoDB Running'))
  .on('error', e => {
    throw e;
  });
```

Nothing crazy here just the basic setup of a db with mongodb. But where do the constants file came ? Time to create it. So inside the `src/config/` folder create a file called `constants.js'` and put these lines in.

```js
export default {
  PORT: process.env.PORT || 3000,
  DB_URL: 'mongodb://localhost/tweeter-development',
  GRAPHQL_PATH: '/graphql'
}
```

Here, these are the constants where we put the base configuration of the server.

  - PORT -> the port of the app
  - DB_URL -> url for the db
  - GRAPHQL_PATH -> the url for graphql server

11. Time to create the Mongodb schema of the tweet. Inside `src/` folder create `models` folder and inside this one `Tweet.js` file. Inside this one we create a basic schema for now ;)

```js
import mongoose, { Schema } from 'mongoose';

const TweetSchema = new Schema({
  text: String,
});

export default mongoose.model('Tweet', TweetSchema);
```

12. Time to update the simple express server for add graphql on it inside `src/index.js`

`yarn add apollo-server-express graphql-tools`

```js
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { createServer } from 'http';
import bodyParser from 'body-parser';

import './config/db';
import constants from './config/constants';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

app.use(bodyParser.json());

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: constants.GRAPHQL_PATH,
  }),
);

app.use(
  constants.GRAPHQL_PATH,
  graphqlExpress({
    schema
  }),
);

graphQLServer.listen(constants.PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`App running on port: ${constants.PORT}`);
  }
});
```

Nothing crazy here, basic setup + add graphiql the IDE of grahpql.

13. Time to mocks some stuff ? Sure ;) That's gonna be easy, first think add `yarn add -D faker` which is a library to help you with mock data. We will create 10 fake mock tweet.

Inside `src` create a folder `mocks` and a file `index.js` inside this one.

```js
import faker from 'faker';

import Tweet from '../models/Tweet';

const TWEETS_TOTAL = 10;

export default async () => {
  try {
    await Tweet.remove();

    await Array.from({ length: TWEETS_TOTAL }).forEach(async () => {
      await Tweet.create({
        text: faker.lorem.paragraphs(1),
      })
    });
  } catch (error) {
    throw error;
  }
}
```

14. Add this mocks promise to the server inside `src/index.js`

```js
// all other import
import mocks from './mocks';

// other code here

mocks().then(() => {
  graphQLServer.listen(constants.PORT, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`App running on port: ${constants.PORT}`);
    }
  });
});
```

15. Time to test it. Go on https://github.com/skevy/graphiql-app and download the app. Why ? Because we will need this jwt auth later ;)

16. Open this tool now and add this in the left part. This is a simple query where we get all 10 tweets. Don't forget to put the url `http://localhost:3000/graphql`

```js
{
  getTweets {
    _id
		text
  }
}
```

17. If all work you should see that

![](https://image.ibb.co/huhn5Q/Screen_Shot_2017_07_19_at_7_10_45_PM.png)

Good Job!

---

## Part 2 - Tweet Basic Crud

### Video

- [Video here](https://youtu.be/tYiGpJGJatE)

This part is going to be about creating the resolver for creating and get a single Tweet

1. Go inside `src/graphql/schema.js` and add this to the query object.

```js
getTweet(_id: ID!): Tweet
```

As you can see here we create a resolver called getTweet where we pass in the _id **Required** for fetching the tweet. Pretty simple here. The `!` mean this is required. The ID is a type build in Graphql. This is for a unique identifier, which is the key for cache.

2. After we can go inside `src/graphql/resolvers/tweet-resolvers.js` and add this one.

```js
getTweet: (_, { _id }) => Tweet.findById(_id),
```

Here we just find one single item by providing the id. Mongoose have an awesome method called `findById()` to make your life easier ;). Inside the resolver we have a function which takes 3 arguments. First one is the parent : "We gonna talk about it later", second one is the args object inside the argument inside the `schema.js` file. The third one is the context and we will also talk about it later. Here you see me destructuring the `{ _id }`,  `_id` prop from the args. This is just to make my code a bit cleaner.

3. Now we need to go inside `src/graphql/resolvers/index.js` and add what we just did in the Query object

```js
getTweet: TweetResolvers.getTweet,
```

Try it inside Graphiql, take a _id of one of the object by redoing the `getTweets` query and do this one

![](https://image.ibb.co/cuhHqQ/Screen_Shot_2017_07_20_at_5_26_05_PM.png)

4. Now time to do the mutataion one. For now I'm gonna break the code in 3 example and you can just put them in the file associate at the top of it.

##### src/grahpql/schema.js`

```js
type Mutation {
  createTweet(text: String!): Tweet
}

schema {
  query: Query
  mutation: Mutation
}
```

Here simple creation which requires a text to make it work. We also add this resolver inside a new type call Mutation. Mutation is all about everything else than GET, like PUT, DELETE, POST. Also we need to add this Mutation inside the schema object.

##### src/graphql/resolvers/tweet-resolvers.js

```js
createTweet: (_, args) => Tweet.create(args),
```

Here we pass the full args object "Grahpql filter for us". For the validation that's gonna be later.

##### src/grahpql/resolvers/index.js

```js
Mutation: {
  createTweet: TweetResolvers.createTweet,
}
```

We pass the resolver createTweet inside the new object Mutation.

Try it inside you graphiql ide.

![](https://image.ibb.co/jzUac5/Screen_Shot_2017_07_20_at_5_24_55_PM.png)

5. Perfect so now we can create a tweet. Time to update it ;)

##### src/grahpql/schema.js

```js
updateTweet(_id: ID!, text: String): Tweet
```

Add this one inside the Mutation type.

##### src/graphql/resolvers/tweet-resolvers.js

```js
updateTweet: (_, { _id, ...rest }) => Tweet.findByIdAndUpdate(_id, rest, { new: true }),
```

O boy, what we just did here ? If you don't understand the `...rest` I have made a video where I explain this thing ;) [Link Here](https://youtu.be/UA6fvCcSluA).

We find the tweet by using the id and we make use of the `findByIdAndUpdate()` method of mongoose. First argument is the id of the object. The second is the object we change. The `{ new: true }` mean we want to send back the new object.

##### src/grahpql/resolvers/index.js

```js
updateTweet: TweetResolvers.updateTweet,
```

6. Now time to delete our awesome tweet ;)

##### src/grahpql/schema.js

```js
deleteTweet(_id: ID!): Status
```

Where this Status type came ? Time to create it :)

```js
type Status {
  message: String!
}
```

This is my way for show in the front-end the message of something happening. Because remember when you delete something that does not exist anymore.

##### src/graphql/resolvers/tweet-resolvers.js

```js
deleteTweet: async (_, { _id }) => {
  try {
    await Tweet.findByIdAndRemove(_id);
    return {
      message: 'Delete Success!'
    }
  } catch (error) {
    throw error;
  }
}
```

Here this is the bigger resolver we create for this part. First this function gonna be an `async` one who mean this is gonna be asynchronous. First we delete the tweet and after we send the success message.

##### src/grahpql/resolvers/index.js

```js
deleteTweet: TweetResolvers.deleteTweet
```

Put this inside Mutation.

Time to test it.

![](https://image.ibb.co/btPGH5/Screen_Shot_2017_07_20_at_6_17_25_PM.png)

7. But now the problem is the tweet came in descendant fashion. We still don't have a way to managed it like in twitter the last tweet is at the top of the feed not the other way around. We can change that, its easy. Go inside the tweets models

##### src/models/Tweet.js

```js
const TweetSchema = new Schema({
  text: String,
}, { timestamps: true });
```

Here I add the timestamps who give us 2 new field to our model. `createdAt` and `updatedAt` who are dates. Cause of it we gonna add in the schema this 2 field. Also we gonna create a `scalar Date` which is the way to do a custom type in graphql.

##### src/graphql/schema.js

```js
scalar Date

type Tweet {
  _id: ID!
  text: String!
  createdAt: Date!
  updatedAt: Date!
}
```

Now go inside the main resolver file after install `yarn add graphql-date`

##### src/grahpql/resolvers/index.js

```js
import GraphQLDate from 'graphql-date';

import TweetResolvers from './tweet-resolvers';

export default {
  Date: GraphQLDate,
  Query: {
    getTweet: TweetResolvers.getTweet,
    getTweets: TweetResolvers.getTweets,
  },
  Mutation: {
    createTweet: TweetResolvers.createTweet,
    updateTweet: TweetResolvers.updateTweet,
    deleteTweet: TweetResolvers.deleteTweet
  }
};
```

Graphql gonna always use this Date here when he see the type. Why we do this ? This is for serializing the input.

Now time to add the sort on mongoose for get the lastone create first

##### src/grahpql/resolvers/tweet-resolvers.js

```js
import Tweet from '../../models/Tweet';

export default {
  createTweet: (_, args) => Tweet.create(args),
  getTweet: (_, { _id }) => Tweet.findById(_id),
  getTweets: () => Tweet.find({}).sort({ createdAt: -1 }),
  updateTweet: (_, { _id, ...rest }) => Tweet.findByIdAndUpdate(_id, rest, { new: true }),
  deleteTweet: async (_, { _id }) => {
    try {
      await Tweet.findByIdAndRemove(_id);
      return {
        message: 'Delete Success!'
      }
    } catch (error) {
      throw error;
    }
  }
};
```

---

## Part 3 - Creation of the user with signup and login resolvers

### Video

[Link](https://youtu.be/3BeFarO6Wt8)

In this part we go over the basic signup and login features for our app. We gonna start by creating the user schema for mongodb, after we gonna jump on the schema model inside grahpql. And finally we gonna work with the resolver and add action for crypt the user password.

1. First we need to make the basic setup for the user schema for mongodb. Create a new file inside `src/models/` call `User.js`.

```js
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  avatar: String,
  password: String,
  email: String,
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
```

Here we just setup the basic field of what our user gonna need.

2. Now time to create the user schema inside the defs of graphql.

##### src/graphql/schema.js

```js
type User {
  _id: ID!
  username: String
  email: String!
  firstName: String
  lastName: String
  avatar: String
  createdAt: Date!
  updatedAt: Date!
}
```

Ok what happen here ? Why do we don't have password ? We don't put the password for one unique and good reason. We don't want the client to have access to the password. In rest we need to manage a good way inside the models or maybe the controler for don't let a client access it. But in grahpql this is much more easy ;)

3. Perfect time to work on the signup resolver. inside `src/graphql/resolvers/` create a file call `user-resolvers.js`

```js
import User from '../../models/User';

export default {
  signup: (_, { fullName, username, password, email, avatar }) => {
    const [firstName, ...lastName] = fullName.split(' ');
    return User.create({ firstName, lastName, username, password, email, avatar });
  },
}
```

??? What did I just did with the `fullName.split(' ')` what is this dark margic ;) "I'm just joking here ;)".

Here as you can see first we make use of destructuring for get all the single value. I don't want to need to make use of args.email everywhere. After the thing is I want my client to have only one single input for get the fullName of the user. Less input and easier to work with. So the fullName came as a string with surely at least 2 words. the split method break the string inside an array when he see space. That's why the `(' ')`. After we say the first index = firstName and all the others equals the lastName. After we push it inside the new user creation.

Now we need to add this inside the resolver index.

##### src/graphql/resolvers/index.js

```js
import GraphQLDate from 'graphql-date';

import TweetResolvers from './tweet-resolvers';
import UserResolvers from './user-resolvers';

export default {
  Date: GraphQLDate,
  Query: {
    getTweet: TweetResolvers.getTweet,
    getTweets: TweetResolvers.getTweets,
  },
  Mutation: {
    createTweet: TweetResolvers.createTweet,
    updateTweet: TweetResolvers.updateTweet,
    deleteTweet: TweetResolvers.deleteTweet,
    signup: UserResolvers.signup,
  }
};
```

And finally inside the schema graphql file

##### src/graphql/schema.js

```js
signup(email: String!, fullName: String!, password: String!, avatar: String, username: String): User
```

For now we return the User type.

Try it ;)

![](https://image.ibb.co/cD3Ns5/Screen_Shot_2017_07_23_at_11_57_09_AM.png)

4. We have a little problem at this point. If you check in your db using `Robo 3T` app or with the terminal you gonna see we save the password as a plain text string. This is REALLLLLLYYYYY bad. We need to crypt this thing and thank to the communities we have a simple packages who can make it for us easy.

`yarn add bcrypt-nodejs`

##### src/models/User.js

```js
import mongoose, { Schema } from 'mongoose';
import { hashSync } from 'bcrypt-nodejs';

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  avatar: String,
  password: String,
  email: String,
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
}

export default mongoose.model('User', UserSchema);
```

Here we have import the function `hashSync` who hash the password for you. We make use of the pre hook method built in mongodb where before the user save we check first if he really modified the password. Because maybe we want to update the username of the user and we don't want to hash again the password for nothing. After we call a methods function call `_hashPassword()` who take the current password and return the hashing version. A methods is a function who can be use by the instance of the schema. Also `hashSync` is asyncronous.

So now if you try again you should see a version hash of the password inside mongodb.

![](https://image.ibb.co/gyb625/Screen_Shot_2017_07_23_at_12_05_40_PM.png)\

5. Time to loged this user. First because the user schema file is open we can create a function who decrypt the password and make sure this is the equivalent of what the use sent.

##### src/models/User.js

```js
import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  avatar: String,
  password: String,
  email: String,
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.password);
  },
};

export default mongoose.model('User', UserSchema);
```

Here we add the `compareSync` import at the top. And finally we just create a methods on the user call `authenticateUser` who take the password coming from the client and return a boolean if the password match the one crypt.

Time to jump on the resolver

##### src/graphql/resolvers/user-resolvers.js

```js
import User from '../../models/User';

export default {
  signup: (_, { fullName, username, password, email, avatar }) => {
    const [firstName, ...lastName] = fullName.split(' ');
    return User.create({ firstName, lastName, username, password, email, avatar });
  },
  login: async (_, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not exist!');
    }

    if (!user.authenticateUser(password)) {
      throw new Error('Password not match!');
    }

    return user;
  }
}
```

Here lot of code happening in the login but nothing crazy. First this gonna be an async function. After we destructuring the email and password field.

First we find the user by his email. If no user came back we return an error about user not exist.

After that mean a user exist we check if it match the password crypting version. If no we return an error about password don't match.

Finally we return the user if all the guard case is good.

##### src/graphql/resolvers/index.js

```js
Mutation: {
  createTweet: TweetResolvers.createTweet,
  updateTweet: TweetResolvers.updateTweet,
  deleteTweet: TweetResolvers.deleteTweet,
  signup: UserResolvers.signup,
  login: UserResolvers.login
}
```

Add the login inside the mutation.

##### src/graphql/schema.js

```js
type Mutation {
  createTweet(text: String!): Tweet
  updateTweet(_id: ID!, text: String): Tweet
  deleteTweet(_id: ID!): Status
  signup(email: String!, fullName: String!, password: String!, avatar: String, username: String): User
  login(email: String!, password: String!): User
}
```

Add this in the schema grahpql. Here for now we return the user.

Try it ;)

![](https://image.ibb.co/dLpyFQ/Screen_Shot_2017_07_23_at_12_12_51_PM.png)

---

## Part 4 - Authentication server side with JWT

### Video

[Link](https://youtu.be/2mXUcBHoJcA)

In this part we go throught the user authentication server side. We gonna make use of JWT "json web token" [JWT Website](https://jwt.io) for being the strategy we use. Why ? Because that keep the server serverless, and this is really easy to implement in mobile app and also web app.

First thing we gonna need a new package for the app.

`yarn add jsonwebtoken`

This is a library who gonna help you create a jwt and also verify this last one.

1. We need to create a JWT_SECRET constants for the app. This way we make sure the JWT is provide by our server.

##### src/config/constants.js

```js
export default {
  PORT: process.env.PORT || 3000,
  DB_URL: 'mongodb://localhost/tweet-development',
  GRAPHQL_PATH: '/graphql',
  JWT_SECRET: 'thisisasecret123'
};
```

For now we put a really bad secret. We gonna change that on production.

2. We gonna add a methods on the user for creating the jwt by taken his information.

#####  src/models/User.js

```js
import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import constants from '../config/constants';

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  firstName: String,
  lastName: String,
  avatar: String,
  password: String,
  email: String
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }

  return next();
});

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_SECRET,
    );
  },
}

export default mongoose.model('User', UserSchema);
```

Here we add the method `createToken()` who finally return a JWT with the payload of the user id in. As you can see we need the secret for the creation.

P.S we don't make it expires for this tutorial.

3. Now we gonna create the services for authentication for the server. I like to keep this kind of strategies outside of my current code. So if I decide to change stuff I know where to go.

##### src/services/auth.js

```js
import jwt from 'jsonwebtoken';

import User from '../models/User';
import constants from '../config/constants';

export async function requireAuth(user) {
  if (!user || !user._id) {
    throw new Error('Unauthorized');
  }

  const me = await User.findById(user._id);

  if (!me) {
    throw new Error('Unauthorized');
  }

  return me;
}

export function decodeToken(token) {
  const arr = token.split(' ');

  if (arr[0] === 'Bearer') {
    return jwt.verify(arr[1], constants.JWT_SECRET);
  }

  throw new Error('Token not valid!');
}
```

Here I create a function call `requireAuth` who take a user object. This is coming from the client side inside the context "We gonna talk about this later".

First I make sure we have user is not null and also _id prop too.

After I search for the user with the user._id. Just again for security and maybe too if my user delete is account and try to do other stuff we make sure if the jwt pass the validation we can push out the user from our app.

We return it for maybe take it inside resolver later.

The second function is `decodeToken` who take a token string. First thing we split it because I want the jwt too look like `Bearer oiwgnwioeungowingonwogn`. But the `jwt.verify` only need the token himself.

3. But now how can we access the user for make the requireAuth function work ?

First we gonna refact the code.

We gonna break up all the middlewares inside the same file and we gonna import it inside the index.js file

##### src/config/middlewares.js

```js
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import constants from './constants';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default app => {
  app.use(bodyParser.json());
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: constants.GRAPHQL_PATH,
    }),
  );
  app.use(
    constants.GRAPHQL_PATH,
    graphqlExpress({
      schema,
      context: {
        user: req.user,
      },
    }),
  );
};
```

##### src/index.js

```js
/* eslint-disable no-console */

import express from 'express';
import { createServer } from 'http';

import './config/db';
import constants from './config/constants';
import middlewares from './config/middlewares';
import mocks from './mocks';

const app = express();

middlewares(app);

const graphQLServer = createServer(app);

mocks().then(() => {
  graphQLServer.listen(constants.PORT, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`App listen to port: ${constants.PORT}`);
    }
  });
});
```

Why do this ? Just for make my code cleaner ;)

Now time to add a middleware inside express who gonna add the user inside the context. So this way we have access to it on every request.

##### src/config/middlewares.js

```js
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import constants from './constants';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';
import { decodeToken } from '../services/auth';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token != null) {
      const user = await decodeToken(token);
      req.user = user; // eslint-disable-line
    } else {
      req.user = null; // eslint-disable-line
    }
    next();
  } catch (error) {
    throw error;
  }
}

export default app => {
  app.use(bodyParser.json());
  app.use(auth);
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: constants.GRAPHQL_PATH,
    }),
  );
  app.use(
    constants.GRAPHQL_PATH,
    graphqlExpress(req => ({
      schema,
      context: {
        user: req.user,
      },
    })),
  );
};
```

If you look at the function auth we make a middleware who check the headers authorization. If he find one he decode the token provide in it and if a user come from it he put it inside the req object.

After inside the graphqlExpress middleware we add the req callback and we return the user inside the context.

After we can change the resolvers for the tweet.

##### src/graphql/resolvers/tweet-resolvers.js

```js
import Tweet from '../../models/Tweet';
import { requireAuth } from '../../services/auth';

export default {
  getTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.findById(_id);
    } catch (error) {
      throw error;
    }
  },

  getTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.find({}).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  createTweet: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.create(args);
    } catch (error) {
      throw error;
    }
  },

  updateTweet: async (_, { _id, ...rest }, { user }) => {
    try {
      await requireAuth(user);
      return Tweet.findByIdAndUpdate(_id, rest, { new: true });
    } catch (error) {
      throw error;
    }
  },

  deleteTweet: async (_, { _id }) => {
    try {
      await Tweet.findByIdAndRemove(_id);
      return {
        message: 'Delete Success!',
      };
    } catch (error) {
      throw error;
    }
  },
};
```

Now we make sure all this function work only on when is auth. That gonna help you a lot for add the user id inside the Tweet in the next part too. As you can see I add also some trycatch for make sure if error we throw it.

4. Now we can also add a resolver call me where we can receive the user object in the front end.

##### src/graphql/resolvers/user-resolvers.js

```js
import User from '../../models/User';
import { requireAuth } from '../../services/auth';

export default {
  signup: async (_, { fullName, ...rest }) => {
    const [firstName, ...lastName] = fullName.split(' ');
    try {
      const user = await User.create({ firstName, lastName, ...rest });
      return {
        token: user.createToken(),
      };
    } catch (error) {
      throw error;
    }
  },

  login: async (_, { email, password }) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not exist!');
      }

      if (!user.authenticateUser(password)) {
        throw new Error('Password not match!');
      }

      return {
        token: user.createToken(),
      };
    } catch (error) {
      throw error;
    }
  },

  me: async (_, args, { user }) => {
    try {
      const me = await requireAuth(user);
      return me;
    } catch (error) {
      throw error;
    }
  },
};
```

We get the me object from the function `requireAuth` build earlier.

Now the schema should look like this

##### src/graphql/schema.js

```js
export default`
  scalar Date

  type Status {
    message: String!
  }

  type Auth {
    token: String!
  }

  type User {
    _id: ID!
    username: String
    email: String!
    firstName: String
    lastName: String
    avatar: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Me {
    _id: ID!
    username: String
    email: String!
    firstName: String
    lastName: String
    avatar: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Tweet {
    _id: ID!
    text: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    getTweet(_id: ID!): Tweet
    getTweets: [Tweet]
    me: Me
  }

  type Mutation {
    createTweet(text: String!): Tweet
    updateTweet(_id: ID!, text: String): Tweet
    deleteTweet(_id: ID!): Status
    signup(email: String!, fullName: String!, password: String!, avatar: String, username: String): Auth
    login(email: String!, password: String!): Auth
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
```

Now you see we return a auth type not anymore the user.

Finally inside the index resolvers we do

##### src/graphql/resolvers/index.js

```js
import GraphQLDate from 'graphql-date';

import TweetResolvers from './tweet-resolvers';
import UserResolvers from './user-resolvers';

export default {
  Date: GraphQLDate,
  Query: {
    getTweet: TweetResolvers.getTweet,
    getTweets: TweetResolvers.getTweets,
    me: UserResolvers.me
  },
  Mutation: {
    createTweet: TweetResolvers.createTweet,
    updateTweet: TweetResolvers.updateTweet,
    deleteTweet: TweetResolvers.deleteTweet,
    signup: UserResolvers.signup,
    login: UserResolvers.login
  }
};
```

---


## Part 5 - Add tweet belongs to user

### Video

[Link](https://youtu.be/G2vt7BW4Sgw)

In this part we go over the setup for adding a reference of the user inside the tweet schema. This way we can track who is the creator of this tweet and make sure he can be the only one to update this one or delete it.

1. We need to change the setup of the tweet schema for mongodb.

##### src/models/Tweet.js

```js
import mongoose, { Schema } from 'mongoose';

const TweetSchema = new Schema({
  text: {
    type: String,
    minlength: [5, 'Text need to be longer'],
    maxlength: [144, 'Text too long'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  favoriteCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Tweet', TweetSchema);
```

Here you see I add some database validation about the text. I add a minimun of 5 and a maximum of 144 characters. The thing in the bracket with the number are the error message show by the database.

user here are reference of the User model we create earlier. We just need to save the id here.

2. Add the user inside the create tweet resolvers.

##### src/graphql/resolvers/tweet-resolvers.js

```js
createTweet: async (_, args, { user }) => {
  try {
    await requireAuth(user);
    return Tweet.create({ ...args, user: user._id });
  } catch (error) {
    throw error;
  }
},
```

Here I spread my args to make sure we don't add an object in a object. This way each property get out of the last object and become a part of the new one. You can see too I add the `user._id` inside the user. This is how you add references to it. But this user came from the jwt so that's why he need to be authorized.

3. We can do the same too with the update and delete so we can make sure the user who create it his the only who can update or delete it.

##### src/graphql/resolvers/tweet-resolvers.js

```js
updateTweet: async (_, { _id, ...rest }, { user }) => {
  try {
    await requireAuth(user);
    const tweet = await Tweet.findOne({ _id, user: user._id });

    if (!tweet) {
      throw new Error('Not found!');
    }

    Object.entries(rest).forEach(([key, value]) => {
      tweet[key] = value;
    });

    return tweet.save();
  } catch (error) {
    throw error;
  }
},
deleteTweet: async (_, { _id }, { user }) => {
  try {
    await requireAuth(user);
    const tweet = await Tweet.findOne({ _id, user: user._id });

    if (!tweet) {
      throw new Error('Not found!');
    }
    await tweet.remove();
    return {
      message: 'Delete Success!'
    }
  } catch (error) {
    throw error;
  }
}
```

For the update we get the tweet from the promise resolve. As you can see I make use of the `findOne` function who return only one document. I search a tweet who have the tweet id provide inside the args but also the user id provide from the jwt. If I have no tweet return that mean the tweet don't exist or the tweet exist but it's not belongs the user.

After I loop over the rest object for update the tweet with the method `Object.entries` who give you access to the key and value. And finally we return the promise `tweet.save()`.

For the delete almost the same process but we delete it and return a message.

4. Now we can return an array of tweets belongs the user himself.

##### src/graphql/resolvers/tweet-resolvers.js

```js
getUserTweets: async (_, args, { user }) => {
  try {
    await requireAuth(user);
    return Tweet.find({ user: user._id }).sort({ createdAt: -1 })
  } catch (error) {
    throw error;
  }
},
```

This way we can as the mobile dev take it for show the user tweets in his profile.

But don't forget the add this to the index resolver

##### src/graphql/resolvers/index.js

```js
export default {
  Date: GraphQLDate,
  Tweet: {
    user: ({ user }) => User.findById(user),
  },
  Query: {
    getTweet: TweetResolvers.getTweet,
    getTweets: TweetResolvers.getTweets,
    getUserTweets: TweetResolvers.getUserTweets, // here
    me: UserResolvers.me
  },
  Mutation: {
    createTweet: TweetResolvers.createTweet,
    updateTweet: TweetResolvers.updateTweet,
    deleteTweet: TweetResolvers.deleteTweet,
    signup: UserResolvers.signup,
    login: UserResolvers.login
  }
};
```

5. Finally we can update the mocks for create the user + tweet with it.

##### src/mocks/index.js

```js
import faker from 'faker';

import Tweet from '../models/Tweet';
import User from '../models/User';

const TWEETS_TOTAL = 3;
const USERS_TOTAL = 3;

export default async () => {
  try {
    await Tweet.remove();
    await User.remove();

    await Array.from({ length: USERS_TOTAL }).forEach(async (_, i) => {
      const user = await User.create({
        username: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        avatar: `https://randomuser.me/api/portraits/women/${i}.jpg`,
        password: 'password123'
      });

      await Array.from({ length: TWEETS_TOTAL }).forEach(
        async () => await Tweet.create({ text: faker.lorem.sentence(), user: user._id }),
      );
    });
  } catch (error) {
    throw error;
  }
};
```

---

## Part 6 - Setup of mobile side

### Video

[Link](https://youtu.be/c_8M5l4itrA)

---

## Part 7 - Design of feed card

### Video

[Link](https://youtu.be/Lkn1FDbUU0U)

#### End Result Of This Episode

<img src="https://image.ibb.co/nGHnpv/Screen_Shot_2017_08_03_at_8_31_10_PM.png" height="75%" width="75%" border="0">

---

## Part 8 - Setup the navigations

### Video

[Link](https://youtu.be/RrIPpWcuN5w)

#### End Result Of This Episode

<img src="https://preview.ibb.co/eKsdWa/Screen_Shot_2017_08_05_at_10_57_43_AM.png" alt="Screen_Shot_2017_08_05_at_10_57_43_AM" border="0">

---

## Part 9 - Connect the Mobile app with the Server

### Video

[Link](https://youtu.be/LVr3qaZGqUw)

---

## Part 10 - Designing the Signup Screen

### Video

[Link](https://youtu.be/Zca5Kyi9cyc)

#### End Result Of This Episode

<img src="https://image.ibb.co/iX2rNF/Screen_Shot_2017_08_09_at_8_02_22_AM.png" alt="Screen_Shot_2017_08_05_at_10_57_43_AM" border="0">
<img src="https://image.ibb.co/j27QhF/Screen_Shot_2017_08_09_at_8_02_25_AM.png" alt="Screen_Shot_2017_08_05_at_10_57_43_AM" border="0">

---

## Part 11 - Authorization and Apollo Middleware

### Video

[Link](https://youtu.be/Ttvt3JhzGQ4)

---

## Part 12 - Me Query with Header avatar and logout

### Video

[Link](https://youtu.be/DDeNQ55mWTQ)

---

## Part 13 - Designing the NewTweetScreen

### Video

[Link](https://youtu.be/0u_HUWkEIII)

<img src="https://image.ibb.co/jrQBcF/Screen_Shot_2017_08_15_at_8_43_24_AM.png" alt="Screen_Shot_2017_08_05_at_10_57_43_AM" border="0">

<img src="https://image.ibb.co/dLYKWa/Screen_Shot_2017_08_15_at_8_43_29_AM.png" alt="Screen_Shot_2017_08_05_at_10_57_43_AM" border="0">

---

## Part 14 - CreateTweet mutation add to the NewScreenTweet + Optimistic-ui

### Video

[Link](https://youtu.be/sDCfEh6XIU0)

## Part 15 - Subscriptions for real time data -> TweetCreation

### Video

[Link](https://youtu.be/V472NiWt2Jg)

---

## Part 16-Prelude - Talk about the Favorite Tweet features

### Video

[Link](https://youtu.be/h6m1gs9OjB4)

---

## Part 16 - Code the favorite tweet features server side

### Video

[Link](https://youtu.be/n8VNuRvMYv4)

---

## Part 17 - Favorite tweet mutation mobile side

### Video

[Link](https://youtu.be/8zNfgm_vp3A)

---

## Part 18 - Adding ui change for the favorite tweet

### Video

[Link](https://youtu.be/iAxeLDaU-ms)

---

## Part 19 - Subscription for the favorite tweet

### Video

[Link](https://youtu.be/2zHBhSp8V3c)