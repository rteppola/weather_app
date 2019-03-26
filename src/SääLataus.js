import React, { Component } from 'react';
import {sääasemadata} from './sääasema';


  class SääLataus extends Component {

    constructor(props){
      super(props);
      console.log("SääLataus.constructor");
      this.state = {ladattu: false, asema_id: 0, data: null};
    }

    componentDidMount() {
        console.log("SääLataus.componentDidMount");
        this.getWeatherData();
    }

    getWeatherData() {
        let komponentti = this;
        let url = "http://tie.digitraffic.fi/api/v1/data/weather-data/" + this.props.asema_id_parentilta;
        console.log ("SääLataus.getWeatherData: url: ", url);
        komponentti.setState( {asema_id:  this.props.asema_id_parentilta, ladattu: false } );
        if (true){   // true ladataan verkosta, false käytetään tiedoston dataa
            
            fetch(url)
            .then(response => response.json())
            .then(json => {
                
                console.log("SääLataus.getWeatherData: Fetch-kutsu valmis!");
//                console.log(json);
                komponentti.setState({ladattu: true, data: json });
                console.log("SääLataus.getWeatherData: SetState-rutiinia kutsuttu");
                }
            );
        console.log("SääLataus.getWeatherData: fetch-kutsu tehty.");
        }
        else
        {
            komponentti.setState({ladattu: true, data: sääasemadata});
            console.log("SääLataus.componentDidMount: käytetään tallennettu dataa.");    
        };
        
    }

    render() {
    console.log("SääLataus.render state.asema_id", this.state.asema_id);
    console.log("SääLataus.render props.asema_id_parentilta", this.props.asema_id_parentilta);
    console.log("SääLataus.render state.asema_nimi_parentilta", this.props.asema_nimi_parentilta);
        
    if((this.state.asema_id !== this.props.asema_id_parentilta) && this.state.ladattu ===true  ) // jos uusi haku
    {
        console.log("SääLataus.render: Päivitys lähtee kohta.");
        //this.setState({ladattu: false});
        this.getWeatherData();
    }
    else{
        console.log("SääLataus.render: Ei uusi haku.");
    }
    
      if (this.state.ladattu === false){
        console.log("SääLataus.render: Odota, ladataan tietoja...");
          return(
              <div className="container">
                <p></p>
                <h5>Odota, ladataan tietoja...</h5>
              </div>
          );
      }
      else 
      {
        let id_taulu =  [ 1, 2, 3, 4, 7, 16, 17, 18, 21, 22, 23, 25, 26, 28, 58, 99 ];  //tulostettavat sensori id:t
        let asema = this.state.data.weatherStations[0];
        let sensori = this.state.data.weatherStations[0].sensorValues;  // taulukkoviittaus sensoriarvoihin
        let tiedot = [];                                                // tulostettava html taulu

        for (let i = 0; i < id_taulu.length; i++) {
            let index=0;
            let sensori_id;
            let nimi;
            let arvo;
            let yksikkö;
            let sensori_löytyi = false;
            
            do{
                sensori_id = sensori[index].id;
                if (id_taulu[i] !== sensori_id){
                    index++;
                }
                else{
                    nimi = sensori[index].name.toLowerCase();
                    nimi = nimi.replace(/_/g, " ");             // replace "_" with " "
                    arvo = sensori[index].sensorValue;
                    yksikkö = sensori[index].sensorUnit;
                    if ((yksikkö === "///") || (yksikkö === "***") ){
                        yksikkö = sensori[index].sensorValueDescriptionFi;
                    }
                    else{
                        if ((yksikkö === "???") || (yksikkö === "###") ){
                            yksikkö = "";
                        }
                    }
                    sensori_löytyi = true;
                    break;
                }
            } while (index < sensori.length)
                      
            if (sensori_löytyi){
                tiedot.push(
                <tr key={i}>
                    <td>{sensori_id}</td>
                    <td>{nimi}</td>
                    <td className="text-right">{arvo}</td>
                    <td>{yksikkö}</td>
                </tr>);           
                sensori_löytyi = false;
            } 
        }

        let pvm = new Date(asema.measuredTime);
        let pvm_aika = pvm.toLocaleDateString() + "   " + pvm.toLocaleTimeString();

        return (
            <div>
                <p></p>
                <table className="table table-sm table-dark">
                    <thead>
                        <tr>
                            <th scope="col">tiesääasema</th>
                            <th scope="col">mittausaika</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                           <td>{this.props.asema_nimi_parentilta} {this.props.asema_id_parentilta}</td>
                           <td>{pvm_aika}</td>
                        </tr>
                    </tbody>
                    </table>
                <table className="table table-sm table-dark">
                    <thead>
                        <tr>
                        <th scope="col">ant. #</th>
                        <th scope="col">nimi</th>
                        <th scope="col" className="text-right">arvo</th>
                        <th scope="col">yksikkö</th>
                        </tr>
                    </thead>
                    <tbody>
                           {tiedot}
                    </tbody>
                </table>   
            </div>
        );
      }
    }
  }

export default SääLataus;
