import React, { Component } from 'react';
import {sääasemalista} from './sääasema';
import SääLataus from './SääLataus';

  class SääAsemaLataus extends Component {

    constructor(props){
      super(props);
      console.log("SääAsemaLataus.constructor");
      this.state = {station_list_ready: false, asema_id: 12001, asema_nimi: "Tie 4 Oulu, Ouluntulli", options: null, weather_data: null };

      this.handleSelectClick = this.handleSelectClick.bind(this);
    }

    handleSelectClick(event) {
      if (event.target.value.length > 0) {
        let index = event.nativeEvent.target.selectedIndex;
        let nimi = event.nativeEvent.target[index].text;
        let asema_id = event.target.value;
        console.log("value: ", event.target.value, "text: ", nimi);

        this.setState( { asema_nimi: nimi, asema_id: asema_id } );
        this.getWeatherData(asema_id);
        
      }
    }

    getWeatherData(stationId) {
      let komponentti = this;
      let url = "http://tie.digitraffic.fi/api/v1/data/weather-data/" + stationId;
      console.log ("SääAsemaLataus.getWeatherData: url: ", url);
      komponentti.setState( { station_list_ready: false } );
      
      fetch(url)
      .then(response => response.json())
      .then(json => {
          
          console.log("SääAsemaLataus.getWeatherData: Fetch-kutsu valmis!");

          komponentti.setState({station_list_ready: true, weather_data: json });
          console.log("SääAsemaLataus.getWeatherData: SetState-rutiinia kutsuttu");
          }
      );
      console.log("SääAsemaLataus.getWeatherData: fetch-kutsu tehty.");
  }

    dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          if(sortOrder === -1){
              return b[property].localeCompare(a[property]);
          }else{
              return a[property].localeCompare(b[property]);
          }        
      }
    }

    componentDidMount() {
    let lista_komponentti = this;

      console.log("SääAsemaLataus.componentDidMount");
        
        fetch('https://tie.digitraffic.fi/api/v1/metadata/weather-stations')
        .then(response => response.json())
        .then(json => {
            
            console.log("Fetch-kutsu valmis!");

            let stationList;
            stationList = this.teeValintalista(json);
            lista_komponentti.setState({station_list_ready: true, options: stationList});
            console.log("SetState-rutiinia kutsuttu");
            }
        );
        
        console.log("SääAsemaLataus.componentDidMount: fetch-kutsu tehty.");

        this.getWeatherData(this.state.asema_id); // fetch the first (default) weather data
        this.setState({station_list_ready: true, asema_id: 12001, data: sääasemalista});  
        console.log("SääAsemaLataus.componentDidMount: käytetään tallennettu dataa.");  
    }

    render() {
      console.log("SääAsemaLataus.render");
      
      if (this.state.station_list_ready === false){
          return(
              <div className="container">
                <h5>Odota, ladataan tietoja...</h5>
              </div>
          );
      }
      else {           
        return (
          <div>
            <form>
              <div className="form-group container bg-dark text-white">         
                <select value={this.state.asema_id} id="lista" className="form-control bg-secondary text-white" size="8" onChange={this.handleSelectClick}>
                  {this.state.options}
                </select>
              </div>
            </form>
            <div className="container bg-dark text-white">
              <SääLataus  
                asema_id_parentilta = {this.state.asema_id}
                asema_nimi_parentilta = {this.state.asema_nimi}
                weather_data_from_parent = {this.state.weather_data}/>              
            </div>
          </div>
        );
      }
    }

    teeValintalista(data) { // luodaan ja järjestetään valintalista 
      let tmp_options = [];
      let tmp2_options = [];
      if (this.state.options === null) {
        for (let index = 0; index < data.features.length; index++) {
          let id = data.features[index].id;
          let nimi = data.features[index].properties.names.fi;
          tmp2_options[index] = { id: id, nimi: nimi };
        }
        tmp2_options.sort(this.dynamicSort("nimi"));
        for (let index = 0; index < tmp2_options.length; index++) {
          let id = tmp2_options[index].id;
          let nimi = tmp2_options[index].nimi;
          tmp_options.push(<option key={id} value={id}>{nimi}</option>);
        }
      }
    return(tmp_options);
    }
  }
export default SääAsemaLataus;