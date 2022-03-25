import {Component} from "react";
import './App.css';

class ResponseDiv extends Component {

    state={
        name: this.props.name,
        gender: '',
        nation: ''
    }

    render() {
        if(this.props.isValid === true ){
          return (
            <div>
                <p className="success"> Sukces </p>
                <div className="goodResponse">
                    <div className="items">
                    <p>Imię</p>
                    <p className="itemsNoBold">{this.props.name}</p>
                    </div>
                    <div className="items">
                        <p >Płeć</p>
                            <p className="itemsNoBold">{this.props.gender}</p>
                    </div>
                    <div className="items">
                        <p >Kraj</p>
                            <p className="itemsNoBold">{this.props.nation}</p>
                    </div>

                </div>

            </div>
        );}
        else {
            return (
                <div className="badResponse">
                    <p className="error"> Error </p>
                    <p className="error-2">Nie znaleziono wyników</p>
                </div>

            );
        }

    }
};

export default ResponseDiv;