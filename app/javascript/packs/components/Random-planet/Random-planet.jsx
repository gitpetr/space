import React, { Component } from 'react';
import './Random-planet.scss';
import SwapiService from '../../../services/swapi-service'
import Spinner from '../Spinner/Spinner'
import ErrorIndicator from '../Error-indicator/Error-indicator'



export default class RandomPlanet extends Component {
  swapiService = new SwapiService();

  state = {
    planet: {},
    loading: true,
    error: false
  };

  componentDidMount() {
    this.updatePlanet()
    this.interval = setInterval(() => { 
      this.updatePlanet() 
    }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onPlanetLoaded = (planet) => {
    this.setState({ planet, loading: false });
  };

  onError = (err) => {
    console.log('ERR: ', err)
    
    this.setState({
      error:true,
      loading: false
    })
  };

  updatePlanet = () => {
    const id = Math.floor(Math.random()*25 +1);
    this.swapiService
      .getPlanet(id)
      .then(this.onPlanetLoaded)
      .catch(this.onError);
  }

  render() {
    const { planet, loading, error } = this.state;
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorIndicator /> : null
    const spinner = loading ? <Spinner /> :  null
    const content = hasData ? <PlanetView planets={planet} /> : null

    return (
      <div className="Random-planet jumbotron rounded">
          {spinner}
          {content}
          {errorMessage}
      </div>

    );
  }
}

const PlanetView = ({ planets }) => {
  const { id, name, population, rotationPeriod, diameter} = planets
  return (
    <React.Fragment>
      <img className="planet-image"
        src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`} />
      <div>
        <h4>{name}</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <span className="term">Population: </span>
            <span>{population}</span>
          </li>
          <li className="list-group-item">
            <span className="term">Rotation Period: </span>
            <span>{rotationPeriod}</span>
          </li>
          <li className="list-group-item">
            <span className="term">Diameter: </span>
            <span>{diameter}</span>
          </li>
        </ul>
      </div>
    </React.Fragment>
  )
}
