export default `
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
