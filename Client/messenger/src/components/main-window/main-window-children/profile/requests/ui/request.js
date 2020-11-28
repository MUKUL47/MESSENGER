import React, { useState, useContext } from "react";
import { RequestApiContext } from "../requestApi";
import {
  Tab,
  Tabs,
  Dialog,
} from "../../../../../../shared/components/material-ui-modules";
import './request.scss'
import { PendingRequests } from "./pending/pendingRequests";
export const Requests = (props) => {
  const requestContext = useContext(RequestApiContext);
  const [tab, setTab] = useState(0);
  return (
    <div className="pending-incomming-requests">
      <Dialog 
        className="pending-sent-dia"
        open={true}
        onClose = {e => props.onClose()}
       >
        <Tabs value={tab} onChange={(p, n) => setTab(n)}>
          <Tab label="sent" />
          <Tab label="Pending" />
        </Tabs>
        <div><PendingRequests tab = {tab}/>
        </div>
      </Dialog>
    </div>
  );
};
