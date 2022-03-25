import axios from 'axios'
import {Component} from "react";
import ResponseDiv from "./ResponseDiv"
import History from "./History"
import './App.css';



let today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

class App extends Component {

    constructor(props){
        super(props);
        let comments = JSON.parse(localStorage.getItem('names'));
        this.state = {
            comments: comments,
            showResponse: false,
            name: '',
            names: this.props.names,
            isDataValidNationalize: false,
            isDataValidGender: false,
            isDataValid: false,
            itemsNation: '',
            itemsGender: '',
            nation: '',
            gender: '',
            date: date,
        };

        console.log(this.state.comments)
    }

    setItems = () => {
        let names=JSON.parse(localStorage.getItem('names') || "[]")

        let name={
            name: this.state.name,
            gender: this.state.gender,
            nation: this.state.nation,
            date: date
        }

        names.push(name)

        localStorage.setItem("names", JSON.stringify(names))
    }

    renderComments(){
        if(this.state.comments != null) {
            const ids = this.state.comments.map(o => o.name)
            const filtered = this.state.comments.filter(({name}, index) => !ids.includes(name, index + 1))
            console.log(filtered)
            return filtered.map((comment, index) =>
                <History
                    key={index}
                    name={comment.name}
                    nation={comment.nation}
                    gender={comment.gender}
                    date={comment.date}/>
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
            this.renderComments()
    }

    hideResponse = async () => {
        //OBSŁUGA API Z KRAJEM
        const nation = await axios.get('https://api.nationalize.io?name=' + this.state.name)
        this.setState({
                draft: this.state.name
            }
        )
        if (nation.request.status !== 200) {
            this.setState({
                isDataValidNationalize: false,
            })
        } else {
            this.setState({
                isDataValidNationalize: true,
                itemsNation: nation.data.country[0],
            })
        }

        if (this.state.itemsNation === undefined) {
            this.setState({
                nation: '-'
            })
        } else {
            this.setState({
                nation: this.state.itemsNation.country_id
            })
        }

        //OBSŁUGA API Z PŁCIĄ
        const gender = await axios.get('https://api.genderize.io?name=' + this.state.name)
        if (gender.request.status !== 200) {
            this.setState({
                isDataValidGender: false,
            })
        } else {
            this.setState({
                isDataValidGender: true,
                itemsGender: gender.data.gender,
            })

            if (this.state.itemsGender === null) {
                this.setState({
                    gender: '-'
                })
            } else {
                this.setState({
                    gender: this.state.itemsGender
                })
            }
        }

        if (this.state.isDataValidGender && this.state.isDataValidNationalize){
            this.state.isDataValid = true;
        }


        this.setState({
            showResponse: true,
            isDataValidGender: false
        })

        this.setItems()


    }

    getName = (event) => {
        this.setState({name: event.target.value})
        if (event.target.value === '') {
            this.setState({showResponse: false})
            console.log(this.state.itemsGender.data.gender)
        }

    }

    render() {

        const {showResponse} = this.state;
        return (
            <div className="container">
                <div className="p1">
                    <header className="header">Wpisz imię:</header>
                    <div className="inputName">
                        <input type="text" className="input" onChange={this.getName}/>
                        <button className="button" onClick={this.hideResponse}> Szukaj</button>
                    </div>
                    <div>
                        {this.state.isDataValid ? (
                            showResponse &&
                            <ResponseDiv name={this.state.name} gender={this.state.gender}
                                         nation={this.state.nation} isValid={this.state.isDataValid}/>
                        ) : (
                            showResponse && <ResponseDiv isValid={this.state.isDataValid}/>
                        )
                        }
                    </div>
                </div>

                <div className="p2">
                    <header className="header">Przeszukaj historię wyszukiwań</header>

                    <div className="inputName">
                        <input type="text" className="input" onChange={this.getName}/>
                        <button className="button"> Szukaj</button>
                    </div>
                        <div className="history">
                            <p className="historyItems">Data</p>
                            <p className="historyItems">Imie</p>
                            <p className="historyItems">Płeć</p>
                            <p className="historyItems">Kraj</p>
                        </div>

                        <hr className="line"/>
                    {this.state.comments === null ?  (
                            <p> </p>
                        ) :
                        (
                           <div> {this.renderComments()} </div>
                        )
                    }
                </div>
            </div>
        );

    }
}

export default App;
