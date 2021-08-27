import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import ChatPage from './page/Chatpage';
import ChannelListPage from './page/ChannelListPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/front/chat/:channelId" component={ChatPage}/>
        <Route path="/front/">
          <ChannelListPage />
        </Route>
        <Route path="/">
          <ChannelListPage />
        </Route>
      </Router>
    </div>
  );
}

export default App;
