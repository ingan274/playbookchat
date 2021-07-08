import './App.css';
import MCCCrew from "./MCCCrew";
import MCC from "./MCCView";
import Crew from "./Crew";
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
        <Route exact path="/playbookmcccrew">
          <MCCCrew />
        </Route>
        <Route exact path="/playbookcrew">
          <Crew />
        </Route>
        <Route exact path="/playbookmcc">
          <MCC />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
