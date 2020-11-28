import React from 'react'
import { Helmet } from 'react-helmet'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './profile.css'
import Tooltip from '@material-ui/core/Tooltip';
import defaultProfile from '../../../assets/images/emptyProfile.webp'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Api, globalMessages } from '../../../shared/components/calls/server'
import { parseError } from '../../../shared/components/utils/short'
export class Profile extends React.Component{
    constructor(props){
        super(props)
        this.fileInput = React.createRef()
        const image = 
        this.state = {
            name : props.location.state ? (props.location.state.name ? props.location.state.name : '') : '',
            imageBlob : props.location.state ? (props.location.state.image ? props.location.state.image : defaultProfile) : defaultProfile,
            imageUpdated : props.location.state ? (props.location.state.image ? props.location.state.image : false) : false,
            isSubmit : false,
            isUpdating : false,
            change : false
        }
    }

    componentWillMount(){
        console.log(this.props.location.state)
        if(!this.props.location.state || !this.props.location.state.header && !this.profile.location.state.isFromHome){
            this.props.history.push('/home')
        }
    }

    render(){
        return (
        <div className="parent">
            {this.profile()}
            <Helmet>
                <title>Messenger - Profile</title>
            </Helmet>
        </div>)
    }

    profile(){
        const submitOrLoading = this.state.isUpdating ? 
        <CircularProgress style={{ marginTop : '6px' }}/> : 
        <Button onClick={this.onUpdateProfile} disabled={!this.state.change} className='profile-btn f-l' variant="contained" color="primary">
                   SUBMIT
        </Button>
        const removeCurrentImage = this.state.imageUpdated ? <b className="remove-image" onClick={() => this.removeCurrentImage()}>x</b> : null;
        return (
        <div>
           <h2 className='headerMessage'>{this.props.location.state ? this.props.location.state.header : ''}</h2>
            <div className="profileModal">
                <input ref={this.fileInput} type='file' onChange={this.onPictureChange} accept="image/*" hidden/>
                <Tooltip title="Upload profile image" placement="right">
                    <img className="profileIcon" src={this.state.imageBlob} onClick={() => this.fileInput.current.click()}/>                    
                </Tooltip>
                {removeCurrentImage}
                <div>
                    <span>
                        Display Name :
                    </span>
                    <TextField 
                    onChange={this.onNameChange}
                    value={this.state.name}
                    className="fields w-100" id="outlined-basic" label="Display Name" variant="outlined"/>
                </div>
                <div className="p-f-20">
                    <span>
                        Email or Mobile :
                    </span>
                    <TextField className="fields w-100 ellpisis" id="outlined-basic" label="Identity" disabled variant="outlined" value={this.props.location.state ? this.props.location.state.identity : ''}/>
                </div>
                {submitOrLoading}
                <Button className='profile-btn black f-r' variant="contained" color="primary" onClick = {this.skipForNow}>
                    Skip
                </Button>
            </div>
        </div>)
    }

    skipForNow = e => {
        this.props.history.push({pathname : '/home'})
    }

    onPictureChange = evt => {
        var f = evt.target.files[0]; 
        if (f){
            var r = new FileReader();
            r.onload = function(e){    
                this.setState({...this.state, imageBlob : e.target.result, imageUpdated : true, change : true})
            }.bind(this)
        r.readAsDataURL(f);
        } 
    }

    onNameChange = e => {
        const myNme = e.target.value;
        this.setState({
            ...this.state, 
            name : myNme.trim().toLowerCase(), 
            isSubmit : myNme.trim().length > 0 && myNme.trim() != this.props.location.state.identity,
            change : true
        })
    } 

    removeCurrentImage = e => {
        this.setState({...this.state, imageBlob : defaultProfile, imageUpdated : false, change : true})
    }

    onUpdateProfile = async e => {
        try{
            this.setState({...this.state, isUpdating : true})
            // let imageBlob = null;
            // if(this.state.imageUpdated){
            //     const splits = this.state.imageBlob.split(/[,;:]/);
            //     // console.log(splits, this.state.imageBlob)
            //     imageBlob = convertBaseToBlob(splits[3], splits[1])
            // }
            await Api.updateProfile(this.state.name, this.state.imageUpdated ? this.state.imageBlob : [])
            this.setState({...this.state, isUpdating : false})
            globalMessages.next({message : "Profile updated successfully"})
            this.props.history.push({pathname : '/home'})
        }catch(ee){
            this.setState({...this.state, isUpdating : false})
            globalMessages.next({message : `Error : ${parseError(ee)}`})
            // this.props.history.push({pathname : '/home'})
        }
    }
}