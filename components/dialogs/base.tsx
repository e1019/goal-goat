// This is a base dialog component that displays a dialog with some inner contents.

import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";
import styles from "./style.module.css";

type DialogProps = {
    onClose: (props: any) => void;
    open: boolean;
};

type DialogState = {

};

abstract class DialogBase<P = {}, S = {}> extends React.Component<DialogProps & P, DialogState & S> {
    constructor(props) {
        super(props);
    }

    protected abstract getTitle() : string;
    protected abstract getInner() : JSX.Element;
    protected abstract getReturnProps() : any;


    protected close(){
        this.props.onClose(this.getReturnProps());
    }

    render() {
        return (
            <Dialog open={this.props.open}
                onClose={() => {
                    this.close();
                }}
            >
                <div className={styles.dialogInner}>
                    <DialogTitle>{this.getTitle()}</DialogTitle>

                    <div className={styles.dialogInner}>
                        {this.getInner()}
                    </div>
                </div>
            </Dialog>
        );
    }
}


export default DialogBase;