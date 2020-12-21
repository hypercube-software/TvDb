import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from '@material-ui/core';
import BaseComponent from '../common/BaseComponent';
import css from './ConfirmDialog.less';

export enum DialogType {
    YESNO = 1,
    ERROR,
}

export enum DialogButton {
    YES = 1,
    NO,
    OK
}

export enum DialogIcon {
    QUESTION = 1,
    ERROR
}

interface IConfirmDialogState {
}

interface IConfirmDialogProps {
    onResponse: (confirm: DialogButton) => void;
    title: string;
    content: string;
    type: DialogType;
    icon?: DialogIcon
}

export class ConfirmDialog extends BaseComponent<IConfirmDialogProps, IConfirmDialogState> {
    constructor(props: IConfirmDialogProps) {
        super(props)
    }

    onClick(confirm: DialogButton): void {
        if (this.props.onResponse) {
            this.props.onResponse(confirm);
        }
    }

    render(): ReactNode {
        let icon = "icons/question-svgrepo-com.svg";
        if ((this.props.icon && this.props.icon === DialogIcon.ERROR) || this.props.type === DialogType.ERROR) {
            icon = "icons/remove-svgrepo-com.svg";
        }
        let actions = null;
        if (this.props.type === DialogType.YESNO) {
            actions = <DialogActions>
                <Button color="secondary" onClick={this.onClick.bind(this, DialogButton.YES)}>Yes</Button>
                <Button color="primary" onClick={this.onClick.bind(this, DialogButton.NO)}>No</Button>
            </DialogActions>;
        }
        else if (this.props.type === DialogType.ERROR) {
            actions = <DialogActions>
                <Button color="secondary" onClick={this.onClick.bind(this, DialogButton.OK)}>Ok</Button>
            </DialogActions>;
        }
        return (
            <Dialog open={true}>
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent dividers className={css.dialogContent}>
                    <img src={icon} className={css.icon} />
                    <p className={css.message}>{this.props.content}</p>
                </DialogContent>
                {actions}
            </Dialog>
        );
    }
}

