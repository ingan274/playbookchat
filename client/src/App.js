import './App.css';
import Home from "./Home";
import UserSelect from "./User Selection";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <UserSelect />
        </Route>
        <Route exact path="/playbook">
          <Home />
        </Route>

      </Switch>
    </Router>

  );
}

export default App;
