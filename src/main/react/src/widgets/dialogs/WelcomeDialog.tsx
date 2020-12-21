import React, { ReactNode} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Box, Button } from '@material-ui/core';
import BaseComponent from '../common/BaseComponent';

interface IWelcomeDialogState {
}
interface IWelcomeDialogProps {
    onGetIn?: () => void;
}

export default class WelcomeDialog extends BaseComponent<IWelcomeDialogProps, IWelcomeDialogState> {
    constructor(props: IWelcomeDialogProps) {
        super(props)
    }

    onClick():void {
        if (this.props.onGetIn)
        {
            this.props.onGetIn(); 
        }
    }

    render():ReactNode {
        return (
            <Dialog open={true}>
                <DialogTitle>Welcome to TvDb</DialogTitle>
                <DialogContent dividers>
                    This demo application demonstrates the use of <b>ReactJs</b> with <b>SpringBoot</b>. The backend connects to a remote service from <a href="https://www.tvmaze.com/">TvMaze</a> server.
          <Box display="flex" flexDirection="row" alignItems="center" style={{ paddingTop: "20px" }}>
                        <img src="logo_raw.svg" width={128} />
                        <p style={{ paddingLeft: "20px" }}>All widgets are based on <a href="https://material-ui.com/">Material UI</a> Library</p>
                    </Box >
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.onClick}>Get in</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
