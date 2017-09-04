import { gql } from 'react-apollo';

export default gql`
  {
    getTweets {
      text
      _id
      createdAt
      isFavorited
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
