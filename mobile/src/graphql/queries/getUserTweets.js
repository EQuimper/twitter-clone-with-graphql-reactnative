import { gql } from 'react-apollo';

export default gql`
  {
    getUserTweets {
      _id
      text
      createdAt
      favoriteCount
      isFavorited
      user {
        firstName
        lastName
        avatar
        username
      }
    }
  }
`;
