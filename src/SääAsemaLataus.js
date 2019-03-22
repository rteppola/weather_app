import React, { Component } from 'react';
import {sääasemalista} from './sääasema';
import SääLataus from './SääLataus';

  class SääAsemaLataus extends Component {

    constructor(props){
      super(props);
      console.log("SääAsemaLataus.constructor");
      this.state = {ladattu: false, asema_id: 12001, asema_nimi: "Tie 4 Oulu, Ouluntulli", data: null, options: null };

      this.handleSelectClick = this.handleSelectClick.bind(this);
    }

    handleSelectClick(event) {
      if (event.target.value.length > 0) {
        let index = event.nativeEvent.target.selectedIndex;
        let nimi = event.nativeEvent.target[index].text;
        console.log("value: ", event.target.value, "text: ", nimi);
        this.setState( { asema_nimi: nimi, asema_id: event.target.value } );
      }
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

    if (true){   // true ladataan verkosta, false käytetään tiedoston dataa
        console.log("SääAsemaLataus.componentDidMount");
        
        fetch('https://tie.digitraffic.fi/api/v1/metadata/weather-stations')
        .then(response => response.json())
        .then(json => {
            
            console.log("Fetch-kutsu valmis!");
            console.log(json);

            lista_komponentti.setState({ladattu: true, asema_id: 12001, data: json});
            console.log("SetState-rutiinia kutsuttu");
            }
        );
        
        console.log("SääAsemaLataus.componentDidMount: fetch-kutsu tehty.");
        }
    else
        {
        //lista_komponentti.setState({ladattu: true, asema_id: 0, data: sääasemalista});
        this.setState({ladattu: true, asema_id: 12001, data: sääasemalista});
        console.log("SääAsemaLataus.componentDidMount: käytetään tallennettu dataa.");  
        };
    }

    render() {
      console.log("SääAsemaLataus.render");
      
      if (this.state.ladattu === false){
          return(
              <div className="container">
                <h5>Odota, ladataan tietoja...</h5>
              </div>
          );
      }
      else {
       
      // luodaan ja järjestetään valintalista 
      if (this.state.options === null) {
        let tmp_options=[];
        let tmp2_options=[];
        for (let index = 0; index < this.state.data.features.length; index++) {

          let id = this.state.data.features[index].id;
          let nimi = this.state.data.features[index].properties.names.fi;

          tmp2_options[index] = { id: id, nimi: nimi };
        }

        tmp2_options.sort(this.dynamicSort("nimi"));

        for (let index = 0; index < tmp2_options.length; index++) {

          let id = tmp2_options[index].id;
          let nimi = tmp2_options[index].nimi;
    
          if (tmp2_options[index].id === 12001){   // default valinta 12001
            tmp_options.push(
              <option key={id} value={id} selected>{nimi}</option>
            );
          }
          else{ 
            tmp_options.push(
              <option key={id} value={id} >{nimi}</option>
            );
          }
        }
      
        this.setState({options: tmp_options}); // talteen, tämähän aiheuttaa uuder render kutsun
        
      }
     //  <select id="lista" className="form-control bg-secondary text-white" size="8" onClick={this.handleSelectClick} onTouchStart={this.handleSelectClick}>
        return (
          <div>
            <form>
              <div className="form-group container bg-dark text-white">         
                <select id="lista" className="form-control bg-secondary text-white" size="8" onChange={this.handleSelectClick}>
                  {this.state.options}
                </select>
              </div>
            </form>
            <div className="container bg-dark text-white">
              <SääLataus  
                asema_id_parentilta = {this.state.asema_id}
                asema_nimi_parentilta = {this.state.asema_nimi}/>              
            </div>
          </div>
        );
      }
    }
  }
export default SääAsemaLataus;