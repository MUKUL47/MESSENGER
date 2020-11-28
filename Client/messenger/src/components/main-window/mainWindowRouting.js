import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { DefaultChatArea } from './chat-window/default/defaultChatArea'
import { Profile } from './chat-window/profile/profile'
export class MainWindowController extends React.Component{
  render(){
    let route = 
    <Router>
      <Switch>
        <Route exact path="/home/p" component = {Profile}></Route>
        <Route path="/" component = {DefaultChatArea}></Route>
      </Switch>
    </Router>
    return (route);
  }
}