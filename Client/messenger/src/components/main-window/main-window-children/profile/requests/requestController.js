import React, { useState } from "react";
import { Requests } from "./ui/request";
import { RequestApi } from "./requestApi";
export function RequestController(props) {
  const [requestTab, setRequestTab] = useState(0);
  return (
    <RequestApi>
      <Requests 
        requestTab={requestTab} 
        onTabChange={(n) => setRequestTab(n)}
        onClose = {props.onClose}
        />
    </RequestApi>
  );
}
