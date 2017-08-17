import { gql } from 'react-apollo';

export default gql`
  subscription {
    tweetAdded {
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
