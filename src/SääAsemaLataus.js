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
      //console.log("SääAsemaLataus.handleSelectClick: ", event.target.value);
      if (event.target.value.length > 0) {
        console.log("value: ", event.target.value, "text: ", event.target.text);
        this.setState({asema_id: event.target.value, asema_nimi: event.target.text});
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
              <div>
                <h3>Odota, ladataan tietoja...</h3>
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
      
        this.setState({options: tmp_options}); // talteen
        
      }
      
        return (
          <div className="container">         
            
            <select id="lista" className="form-control inputstl" size="8" onClick={this.handleSelectClick}>
              {this.state.options}
            </select>
            
            <SääLataus  
              asema_id_parentilta = {this.state.asema_id}
              asema_nimi_parentilta = {this.state.asema_nimi}/>              
          </div>
        );
      }
    }
  }
export default SääAsemaLataus;