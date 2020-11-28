import React, { useState, createContext } from "react";
import { manipluateUserCall } from '../profile/requests/requestApi'
export const FriendListContext = createContext();
export const FriendListDataContext = props => {
    const [data, setData] = useState([])
    const [filtered, setFiltered] = useState(false)
    const [isFetching, setFetching] = useState(false)
    const [activeFriends, setActiveFriends] = useState({})
    const [selectedFriend, setSelectedFriend] = useState(false)
    const SetData = data => {
        setData(data);
        setFiltered(data);
    }
    const SetFiltered = data => setFiltered(data)
    const SetFetch = () => setFetching(true)
    return (
    <FriendListContext.Provider 
        value = {
                {
                    SetFiltered :   SetFiltered,
                    filtered:       filtered,
                    data :          data, 
                    setData :       SetData, 
                    setFetch :      SetFetch,
                    isFetching :    isFetching,
                    activeFriends : activeFriends,
                    setActiveFriends : setActiveFriends,
                    selectedFriendInChat : { set : setSelectedFriend, get : selectedFriend }
                }
            }>
        {props.children}
    </FriendListContext.Provider>
    )
}

