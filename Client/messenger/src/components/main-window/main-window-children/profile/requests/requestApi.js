import React, { useState, createContext, useEffect } from "react";
import {
  Api,
  globalMessages,
} from "../../../../../shared/components/calls/server";
import { parseError } from "../../../../../shared/components/utils/short";
import { Subject } from 'rxjs'
export const manipluateUserCall = new Subject()
export const RequestApiContext = createContext();
export const RequestApi = (props) => {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const initiateRequest = (requestType, toId, answer, addedUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        setRequestInProgress(true);
        if (requestType === "add") {
          await Api.sendRequest(toId);
          manipluateUserCall.next({type : 'add', id : toId})
        } else if (requestType === "revoke") {
          await Api.revokeRequest(toId);
        } else if (requestType === "respond") {
          console.log('addedUser--',addedUser)
          await Api.respondRequest(toId, answer);
          manipluateUserCall.next({ type : 'respond', resp : answer, id : toId })
        } else if (requestType === "remove") {
          await Api.removeUser(toId);
          manipluateUserCall.next({type : 'remove', id : toId})
        }
        setRequestInProgress(false);
        resolve()
      } catch (ee) {
        reject()
        setRequestInProgress(false);
        globalMessages.next({ message: parseError(ee) });
      }
    })
  };
  const getMyNetwork = (type, count, start) => {
    return new Promise(async (rs, rj) => {
      try {
        setRequestInProgress(true);
        const response = Api.getMyNetwork(type, count, start);
        setRequestInProgress(false);
        rs(response);
      } catch (ee) {
        setRequestInProgress(false);
        rj();
        globalMessages.next({ message: parseError(ee) });
      }
    });
  };
  return (
    <RequestApiContext.Provider
      value={{
        requestInProgress: requestInProgress,
        initiateRequest: initiateRequest,
        getMyNetwork: getMyNetwork,
      }}
    >
      {props.children}
    </RequestApiContext.Provider>
  );
};
