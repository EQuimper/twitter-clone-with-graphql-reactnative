import { gql } from 'react-apollo';

export default gql`
  {
    getTweets {
      text
      _id
      createdAt
      favoriteCount
      user {
        username
        avatar
        lastName
        firstName
      }
    }
  }
`;
