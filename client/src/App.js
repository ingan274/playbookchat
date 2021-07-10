import './App.css';
import MCCCrew from "./MCCCrew";
import Crew from "./Crew";
import IVview from "./MCCandCrew";
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
        <Route exact path="/playbookivview">
          <IVview />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
