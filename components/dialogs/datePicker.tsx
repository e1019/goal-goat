
import Callable from "../../util/Callable";
import DAbstractCompletion from "../../util/Completions/DAbstractCompletion";
import DCompletionHistory from "../../util/Completions/DCompletionHistory";
import { DGoal } from "../../util/DGoal";

import { withRouter } from "react-router-dom";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import DateFnsUtils from '@date-io/date-fns';
import DialogBase from "./base"

type DatePickerProps = {
    initialDate: Date;
    onlyPast: boolean;
}

type DatePickerState = {
    date: Date;
}

class DatePickerDialog extends DialogBase<DatePickerProps, DatePickerState> {
    constructor(props) {
        super(props);

        this.state = {
            date: props.initialDate
        };
    }

    protected getTitle() {
        return "Select a date";
    }

    protected getReturnProps(){
        return this.state.date;
    }

    protected getInner() {
        return <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker disableToolbar variant="inline"
                format="yyyy-MM-dd"
                value={this.state.date}
                onChange={(date) => {
                    this.setState({ date });
                }}
                onSubmit={() => {this.close()}}
                disableFuture={this.props.onlyPast}
            />
        </MuiPickersUtilsProvider>;
    }
}

export default DatePickerDialog;