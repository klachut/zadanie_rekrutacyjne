import axios from 'axios'
import {Component} from "react";
import ResponseDiv from "./ResponseDiv"
import History from "./History"
import './App.css';
import {ThreeCircles} from 'react-loader-spinner';


/**
 * Pobranie aktualnej daty
 */
let today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

class App extends Component {


    /**
     * Konstruktor oraz ustawienie state i pobranie danych z local storage
     */
    constructor(props){
        super(props);
        let listOfNames = JSON.parse(localStorage.getItem('names'));
        this.state = {
            listOfNames: listOfNames,
            showResponse: false,
            inputName: '',
            isDataValidNationalize: false,
            isDataValidGender: false,
            isDataValid: false,
            itemsNation: '',
            itemsGender: '',
            nation: '',
            gender: '',
            date: date,
            nameToSearch: "",
            nameToRender: {},
            searchInput: "",
            setLoading: false
        };
    }


    /**
     * Dodanie imienia, płci, narodowości oraz daty do local storage
     */
    setItems = () => {
        let names=JSON.parse(localStorage.getItem('names') || "[]")

        let name={
            name: this.state.inputName,
            gender: this.state.gender,
            nation: this.state.nation,
            date: date
        }

        if(this.state.isDataValid)
            names.push(name)


        localStorage.setItem("names", JSON.stringify(names))

        this.setState({
            listOfNames: names
        })


    }


    /**
     * Renderowanie widoków w zależności od tego, czy jest wpisane imię w wyszkiwarkę,
     * czy imię jest w liście oraz ewentualny brak wyników
     */
    renderListOfNames(){
        if(this.state.listOfNames != null) {
           const listOfNamesDuplicated = this.state.listOfNames.map(x => x.name)
           const filtered = this.state.listOfNames.filter(({name}, index) => !listOfNamesDuplicated.includes(name, index + 1))

            //Przypadek, gdy input wyszukiwania jest pusty
            if(this.state.searchInput === "") {
                return filtered.map((comment, index) =>
                    <History
                        key={index}
                        name={comment.name}
                        nation={comment.nation}
                        gender={comment.gender}
                        date={comment.date}/>
                )
            }
            //Przypadek, gdy jest input w wyszukiwarace
            else if (this.state.nameToRender !== undefined){
                return (
                    <History
                        name={this.state.nameToRender.name}
                        nation={this.state.nameToRender.nation}
                        gender={this.state.nameToRender.gender}
                        date={this.state.nameToRender.date}/>

                )
            }
            //Przypadek, gdy nie ma imienia w liście
            else{
                return (
                    <p> Brak wyników </p>
                )
            }

        }
    }

    /**
     * Pobranie danych odnośnie narodowości
     */
    getNation = async () => {
        const nation = await axios.get('https://api.nationalize.io?name=' + this.state.inputName)
        //Obsługa błędu API
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

        //Sprawdzenie, czy jest narodowość dla danego imienia
        if (this.state.itemsNation === undefined) {
            this.setState({
                isDataValidNationalize: false
            })
        } else {
            this.setState({
                nation: this.state.itemsNation.country_id
            })
        }
    }

    /**
     * Pobranie danych odnośnie płci
     */
    getGender = async () => {
        const gender = await axios.get('https://api.genderize.io?name=' + this.state.inputName)
        //Obsługa błędu API
        if (gender.request.status !== 200) {
            this.setState({
                isDataValidGender: false,
            })
        } else {
            this.setState({
                isDataValidGender: true,
                itemsGender: gender.data.gender,
            })
            //Sprawdzenie, czy istnieje płeć dla danego imienia
            if (this.state.itemsGender === null) {
                this.setState({
                    isDataValidGender: false
                })
            } else {
                this.setState({
                    gender: this.state.itemsGender
                })
            }
        }
    }

    /**
     * Ustawienie stanu, który determinuje pokazywany widok po pobraniu danych z API
     */
    isGoodOrBadResponse(){
        if (this.state.isDataValidGender === false || this.state.isDataValidNationalize === false){
            this.state.isDataValid = false;
        }
    }

    /**
     * Obsługa pobierania danych z API oraz dodawanie danych do local Storage
     */
    getResponseButton = async () => {

        this.setState({
            isDataValid: true,
            setLoading: true,
            showResponse: false
        })

        await this.getNation()
        await this.getGender()

        this.isGoodOrBadResponse()


        //Ustawienie Timeoutu, aby było widać spinner
        setTimeout(() => {  console.log("World!"); }, 30000);
        this.setItems()

        this.setState({
            showResponse: true,
            isDataValidGender: false,
            setLoading: false
        })

    }

    /**
     * Przechwytywanie danych z inputu "Wpisz imię"
     * Zabezpieczenie przed wpisaniem imienia z dużej litery
     */
    getName = (event) => {
        this.setState({inputName:  event.target.value.toLowerCase()})

        if (event.target.value === '')
            this.setState({showResponse: false})

    }

    /**
     * Przechwytywanie danych z inputu "Przeszukaj historię wyszukiwań"
     * Zabezpieczenie przed wpisaniem imienia z dużej litery
     */
    searchName = (event) => {
        this.setState({nameToSearch: event.target.value.toLowerCase()})

    }

    /**
     * Obsługa przycisku "Szukaj", zabezpieczenie przed wpisywaniem imienia dużymi literami
     * Wyszukiwanie imienia na liście
     */
    searchNameBtn = () => {
        let obj = this.state.listOfNames.find(x => x.name.toLowerCase() === this.state.nameToSearch)

        this.setState({
            nameToRender: obj,
            searchInput: this.state.nameToSearch
        })

    }

    render() {
        return (
            <div className="container">

                {/*Widok z wyświetleniem statusu API, inputem "Wpisz imię" oraz przyciskiem*/}
                <div className="p1">
                    <header className="header">Wpisz imię:</header>
                    <div className="inputName">
                        <input type="text" className="input" onChange={this.getName}/>
                        <button className="button" onClick={this.getResponseButton}> Szukaj</button>
                    </div>


                    <div>
                        {/*Wyświetlenie loadera*/}
                        <div style={{  padding: "10px", marginTop: "20px"}}>
                            {this.state.setLoading ? (
                                <ThreeCircles type="ThreeDots" color="#2BAD60" height="100" width="100"   />
                            ) : (
                                <p> </p>
                            )}
                        </div>

                        {/*Wyświetlenie czy imie zostało znalezione czy też nie*/}
                        {this.state.isDataValid ? (
                            this.state.showResponse &&
                            <ResponseDiv name={this.state.inputName} gender={this.state.gender}
                                         nation={this.state.nation} isValid={this.state.isDataValid}/>
                        ) : (
                            this.state.showResponse && <ResponseDiv isValid={this.state.isDataValid}/>
                        )
                        }
                    </div>

                </div>

                {/*Historia wyszukiwań*/}
                <div className="p2">
                    <header className="header">Przeszukaj historię wyszukiwań</header>

                    <div className="inputName">
                        <input type="text" className="input" onChange={this.searchName}/>
                        <button className="button" onClick={this.searchNameBtn}> Szukaj</button>
                    </div>
                        <div className="history">
                            <p className="historyItems">Data</p>
                            <p className="historyItems">Imie</p>
                            <p className="historyItems">Płeć</p>
                            <p className="historyItems">Kraj</p>
                        </div>

                        <hr className="line"/>

                    {/*Sprawdzenie, czy lista imion jest pusta*/}
                    {this.state.listOfNames === null ?  (
                            <p> </p>
                        ) :
                        (
                           <div> {this.renderListOfNames()} </div>
                        )
                    }
                </div>
            </div>
        );

    }


}

export default App;
