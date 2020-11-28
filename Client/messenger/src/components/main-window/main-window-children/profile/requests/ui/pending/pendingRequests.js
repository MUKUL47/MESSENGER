import React, { useState, useContext, useEffect } from "react";
import { RequestApiContext } from "../../requestApi";
import {
  defaultProfile,
  Pagination,
  CancelIcon,
  LoopIcon,
  Tooltip,
  Button,
  CheckCircleOutlineIcon,
} from "../../../../../../../shared/components/material-ui-modules";
import { manipluateUserCall } from '../../requestApi'
import * as _ from 'lodash'
import "./pendingRequests.scss";
export const PendingRequests = (props) => {
  console.log(props)
  const requestApiContext = useContext(RequestApiContext);
  const [inProgress, setInProgress] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [paginationStats, setPaginationStats] = useState({
    start : 0,
    count : 5
  });
  const [isCancelling,setIsCancelling] = useState(false)
  const getPending = async (page) => {
    setInProgress(true);
    const resp = await requestApiContext.getMyNetwork(
      props.tab == 0 ? "P@" : 'P',
      paginationStats.start,
      paginationStats.count
    );
    setInProgress(false);
    if(resp.data.users.length > 0){
      setPendingRequests([...pendingRequests, ...resp.data.users])
    }
  };

  const resetPagination = () => {
    setIsCancelling(false)
    setInProgress(true)
    setPendingRequests([])
    setPaginationStats({start : 0, count : 5})
    console.log('props changed')
  }

  const cancelRequest = async index => {
    if(isCancelling) return
    try{
      setIsCancelling(true)
      const userS = [...pendingRequests]
      await requestApiContext.initiateRequest('revoke', userS[index].userId)
      userS.splice(index, 1)
      setPendingRequests(userS);
      setIsCancelling(false)
    }catch(ee){
      setIsCancelling(false)
    }
  }

  const answer = async (ans, index) => {
    if(isCancelling) return
    setIsCancelling(true)
    try{
      const userS = [...pendingRequests]
      await requestApiContext.initiateRequest('respond', userS[index].userId, ans)
      userS.splice(index, 1)
      setPendingRequests(userS);
      setIsCancelling(false)
      manipluateUserCall.next({ type : 'respond', resp : ans, id : userS[index].userId, addedUser : userS[index] })
    }catch(ee){
      setIsCancelling(false)
    }
  }

  useEffect(() => { getPending() },[paginationStats]);

  useEffect(() => { resetPagination() }, [props.tab])

  return !inProgress && pendingRequests.length > 0? (
    <div className="pending-requests-parent">
      <div className="pending-requests" onScrollCapture={e => console.log(e.target.value)}>
        {pendingRequests.map((r, i) => {
            return (
              <div className="icon-name-cancel m-b-10" key={i}>
                <span className="f-l">
                  <img
                    src={r.image ? r.image : defaultProfile}
                    id="profile-img"
                    alt={r.name}
                  />
                </span>
                <span className="name f-l">{r.name}</span>
                { props.tab === 0 ? sent(cancelRequest, i) : pending(answer, i) }
              </div>
            );
        })}
        {pendingRequests.length >= 5 ? 
        <div className="load-more">
        <Tooltip title="Show more">
          <LoopIcon onClick = {e => setPaginationStats({ count : paginationStats.count+5, start : paginationStats.start+5 })}/>
        </Tooltip>
      </div>: null}
      </div>
    </div>
  ) : 
  (!inProgress ? <div className="no-users">
    {props.tab === 0 ? 'No sent request found' : 'No pending request found'}
  </div> : null);
};

function sent(cancelRequest, i){
  return (
    <span className="cancel">
      {<CancelIcon 
        id="cancel"
        onClick={e => cancelRequest(i)}
        />}
    </span>
  )
}

function pending(answer, i){
  return (
  <span className="approve-reject f-r btn-a-p">
      <div className="full-size">
          <Button className="approve" 
              onClick={e => answer(1, i)}>
              <CheckCircleOutlineIcon id='m-r-10'/>
              Approve
          </Button>
          <Button className="reject"
              onClick={e => answer(0, i)}>
              <CancelIcon id='m-r-10'/>
              Reject
          </Button>
      </div>
      <div className="mobile-size">
          <CheckCircleOutlineIcon 
              className = "approve-icon"
              onClick={e => answer(1, i)}/>
          <CancelIcon onClick={e => answer(0, i)}/>
      </div>
  </span>)
}