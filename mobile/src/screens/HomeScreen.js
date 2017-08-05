import React, { Component } from 'react';
import styled from 'styled-components/native';

import FeedCard from '../components/FeedCard/FeedCard';

const Root = styled.View`
  flex: 1;
  paddingTop: 5;
`;

const List = styled.ScrollView``

class HomeScreen extends Component {
  state = {  }
  render() {
    return (
      <Root>
        <List>
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </List>
      </Root>
    );
  }
}

export default HomeScreen;
