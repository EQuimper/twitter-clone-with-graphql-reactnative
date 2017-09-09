import { gql } from 'react-apollo';

export default gql`
  subscription {
    tweetFavorited {
      _id
      favoriteCount
    }
  }
`;
