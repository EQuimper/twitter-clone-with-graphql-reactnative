# Twitter Clone with Graphql and React-Native

### What is this ?

This is a simple Youtube tutorial where we go over some new tech. The end product is to build a Twitter kind of clone where we have real time updates.

[End Product Intro Video](https://youtu.be/U9OfNJ9Ia70)

### Prerequisite

- Installation of Mongodb, ReactNative and Nodejs
- Understanding of Mongodb, Nodejs, ReactNative and a bit of Graphql
- Know what is websocket
- Be patient with me ;)

## Part 1

### Video

- [The Setup](https://youtu.be/33qP1QMmjv8)
- [Part 1](https://youtu.be/qLBwByURMf8)

This part is mainly for the basic setup of the server. We go over the installation of express and the basic graphql setup. We also add Mongodb and we make mocks on it.

1. Create a folder where we will put the server and mobile folder in
2. Cd into the server folder and run the command `yarn init` + click enter on each question
3. Run `yarn add express cross-env body-parser`
4. Create a folder called `src` and create a file inside called `index.js`
5. Put the basic setup of express at the top of the file .

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

6. Go into your `package.json` and add this scripts file:

```json
"dev": "cross-env NODE_ENV=dev nodemon --exec babel-node src/index.js"
```

7. Create a `.babelrc` with these settings : 

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

8. Now it is time to setup some graphql stuff. First create a folder called `graphql` inside `src`. After that create a `schema.js` file and put that in :

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

9. Now time to write the resolver for this `getTweets`. Create a folder `resolvers` inside `src/graphql/`. After that, create a file called `tweet-resolver.js`. Inside this one put this:

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

But where did this `Tweet` models come from ? Yes, this is time to setup the db.

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
