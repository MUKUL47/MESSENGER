import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';

export function SnackBar(props){
        return (
            <Snackbar
                anchorOrigin={{
                vertical: props.vertical,
                horizontal: props.horizontal,
                }}
                open={props.open}
                autoHideDuration={props.timer} 
                message = {props.message}
            > 
          </Snackbar>
        )
}


           