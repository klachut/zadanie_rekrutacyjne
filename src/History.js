import {Component} from "react";
import './MainPage.css';

class History extends Component {

    render() {
        return (
            <div >
                <div className="history">
                    <p className="historyItemsNoBold">{this.props.date}</p>
                    <p className="historyItemsNoBold" >{this.props.name}</p>
                    <p className="historyItemsNoBold" >{this.props.gender}</p>
                    <p className="historyItemsNoBold">{this.props.nation}</p>
                </div>
            </div>
        )
    }
    }


export default History;