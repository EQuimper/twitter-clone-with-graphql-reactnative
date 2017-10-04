import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { FlatList } from 'react-native';

import ProfileHeader from '../components/ProfileHeader';
import FeedCard from '../components/FeedCard/FeedCard';

import GET_USER_TWEETS_QUERY from '../graphql/queries/getUserTweets';

const Root = styled.View`
  flex: 1;
  backgroundColor: #f1f6fa;
`;

const T = styled.Text``

class ProfileScreen extends Component {
  state = {  }

  _renderItem = ({ item }) => <FeedCard {...item} />;

  _renderPlaceholder = () => (
    <FeedCard
      placeholder
      isLoaded={this.props.data.loading}
    />
  )

  render() {
    const { info, data } = this.props;

    return (
      <Root>
        <ProfileHeader {...info} />
        {data.loading ? (
          <FlatList
            data={[1, 2, 3]}
            renderItem={this._renderPlaceholder}
            keyExtractor={item => item}
            contentContainerStyle={{ alignSelf: 'stretch' }}
          />
        ) : (
          <FlatList
            data={data.getUserTweets}
            renderItem={this._renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ alignSelf: 'stretch' }}
          />
        )}
      </Root>
    );
  }
}

export default compose(
  graphql(GET_USER_TWEETS_QUERY),
  connect(state => ({ info: state.user.info }),
))(ProfileScreen);
