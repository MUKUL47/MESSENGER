import React from 'react';
import './profile.scss'
import namasteImg from '../../assets/namaste.png'
import { TextField, Button } from '../../shared/material-modules';
export default function ProfileRenderer() {
    return (
    <>
        <div className="profile-layout">
            <p id='heading'>My Profile</p>
            <div className="profile">
                <div className="profile-form">
                    <div className="profile-img">
                        <img src={namasteImg} width="100px" height="100px"/>
                        <div className="remove-img">x</div>
                    </div>
                    <div className="profile-name form-inp">
                        <div id='inp-text'><strong>Name</strong></div>
                        <TextField
                            id="outlined-basic"
                            placeholder="Name"
                            variant="outlined"
                            className="input-text"
                        />
                    </div>
                    <div className="profile-emailMobile form-inp">
                        <div id='inp-text'><strong>Email or Mobile</strong></div>
                        <TextField
                            id="outlined-basic"
                            placeholder="Email or Mobile"
                            variant="outlined"
                            className="input-text"
                        />
                    </div>
                    <div className="submit-profile">
                        <Button variant="contained" color="primary">Submit</Button>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}