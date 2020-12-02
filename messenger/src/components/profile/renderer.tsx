import React, { createRef, Ref, useEffect, useRef } from 'react';
import './profile.scss'
import namasteImg from '../../assets/namaste.png'
import emptyProfile from '../../assets/emptyProfile.webp';
import { TextField, Button, CircularProgress } from '../../shared/material-modules';
export default function ProfileRenderer(props: any) {
    const { loading, name, user, setForm, updateProfile, blob, changed } = props;
    const fileInp = (createRef() as any);
    const setProfileImage = (evt: any) => {
        var f = evt.target.files[0];
        if (f) {
            const r = new FileReader();
            r.onload = (e: any) => setForm({ blob: e.target.result, changed: true })
            r.readAsDataURL(f);
        }
    }
    return (
        <>
            <input type='file' hidden id='hidden-file' ref={fileInp} onChange={setProfileImage} />
            <div className="profile-layout">
                <p id='heading'>My Profile</p>
                <div className="profile">
                    <div className="profile-form">
                        <div className="profile-img">
                            <img src={blob ? blob : emptyProfile} width="100px" height="100px" onClick={e => fileInp.current.click()} />
                            {
                                blob ?
                                    <div className="remove-img" onClick={e => setForm({ blob: null, changed: true })}>x</div>
                                    : null
                            }
                        </div>
                        <div className="profile-name form-inp">
                            <div id='inp-text'><strong>Name</strong></div>
                            <TextField
                                id="outlined-basic"
                                placeholder="Name"
                                variant="outlined"
                                className="input-text"
                                disabled={loading}
                                value={name || ''}
                                onChange={e => setForm({ name: e.target.value, changed: true })}
                            />
                        </div>
                        <div className="profile-emailMobile form-inp">
                            <div id='inp-text'><strong>Email or Mobile</strong></div>
                            <TextField
                                id="outlined-basic"
                                placeholder="Email or Mobile"
                                variant="outlined"
                                className="input-text"
                                disabled={true}
                                value={user || ''}
                            />
                        </div>
                        <div className="submit-profile">
                            <Button variant="contained" color="primary"
                                disabled={loading}
                                onClick={e => updateProfile()}
                            >
                                {
                                    loading ?
                                        <CircularProgress className="submit-profile__loader" /> :
                                        'Submit'
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}