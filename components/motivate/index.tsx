import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";

import coolImages from "cool-images";
import quote from "inspirational-quotes";

import styles from "./motivate.module.css"



type MotivateState = {
    currQuote;
    currImg: string;
}

class Motivate extends React.Component<{}, MotivateState> {
    constructor(props){
        super(props);
        
        this.state = {
            currQuote: null,
            currImg: null
        };
    }

    componentDidMount(){
        this.setState({currQuote: quote.getQuote(), currImg: coolImages.one(600, 800, true, true)})
    }

    render(){
        if(!this.state.currQuote) return <CircularProgress />
        if(!this.state.currImg) return <CircularProgress />
        return <div className={styles.container}>

            <Typography>
                {this.state.currQuote.text}
            </Typography>
            <Typography color="textSecondary">
                - {this.state.currQuote.author}
            </Typography>

            <img src="https://picsum.photos/g/800/600" />
        </div>;
    }
}

export default Motivate;