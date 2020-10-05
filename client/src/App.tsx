import React from 'react';
import { Box } from 'rebass';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Header from './Header';
import Map from './pages/map';
import Profile from './pages/profile';


const App = () => {

  return (
    <Box bg='background' pb={70}>
      <Router>
        <Header />
        <Switch>

          <Route path="/map">
            <Map />
          </Route>

          <Route path="/profile/:guid">
            <Profile />
          </Route>

          <Route path="/">
            <Redirect to="/map" />
          </Route>

        </Switch>
      </Router>
    </Box>
  );
}

export default App;
