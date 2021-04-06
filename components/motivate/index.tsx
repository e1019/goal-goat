// This component provides a square that contains a motivational quote and photo.

import React from "react";
import quote from "inspirational-quotes";

import { CircularProgress, Typography } from "@material-ui/core";

import styles from "./motivate.module.css";


type MotivateState = {
    currQuote;
}

class Motivate extends React.Component<{}, MotivateState> {
    constructor(props){
        super(props);
        
        this.state = {
            currQuote: null
        };
    }

    componentDidMount(){
        this.setState({currQuote: quote.getQuote()});
    }

    // photos are provided by Lorem Picsum, https://picsum.photos/ 
    render(){
        if(!this.state.currQuote) return <CircularProgress />;
        return <div className={styles.container}>

            <Typography>
                {this.state.currQuote.text}
            </Typography>
            <Typography color="textSecondary">
                - {this.state.currQuote.author}
            </Typography>

            <img style={{height: "321px"}} src="https://picsum.photos/g/800/600" />
        </div>;
    }
}

export default Motivate;