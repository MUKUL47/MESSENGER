import React, { createRef } from 'react';
import './profile.scss'
import emptyProfile from '../../assets/emptyProfile.webp';
import { TextField, Button, CircularProgress } from '../../shared/material-modules';
export default function ProfileRenderer(props: any) {
    const { loading, name, user, setForm, updateProfile, blob, profileTouched } = props;
    const fileInp = (createRef() as any);
    const setProfileImage = (evt: any) => {
        var f = evt.target.files[0];
        if (f) {
            const r = new FileReader();
            r.onload = (e: any) => setForm({ blob: e.target.result, profileTouched: { ...profileTouched, blob: true } })
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
                                    <div className="remove-img" onClick={e => setForm({ blob: null, profileTouched: { ...profileTouched, blob: true } })}>x</div>
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
                                onChange={e => setForm({ name: e.target.value, profileTouched: { ...profileTouched, name: true } })}
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