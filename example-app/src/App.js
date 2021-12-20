import './assets/stylesheets/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './pages/Home'
import Login from './pages/Login'
import Teste from './pages/Teste'
import Teste2 from './pages/Teste2'
import Teste3 from './pages/Teste3'

function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/teste">
          <Teste />
        </Route>
        <Route path="/teste2">
          <Teste2 />
        </Route>
        <Route path="/teste3">
          <Teste3 />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
