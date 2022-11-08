import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import ResidentInfo from './components/ResidentInfo'
import RickAndMortyLogo from './assets/RickAndMortyLogo.webp'
import bodyBackground from './assets/bodyBackground.jpg'
import Autosuggest from 'react-autosuggest'

function App() {

  const [location, setLocation] = useState({})
  const [locationId, setLocationId] = useState('')
  const random = Math.floor((Math.random() * 126) + 1)

  const enterInName =(e) =>{
    if(e.key =="Enter"){
      setLocation(locationSelect[0])
    }
  }
  window.addEventListener('keydown', enterInName);

  useEffect(()=> {

    axios.get(`https://rickandmortyapi.com/api/location/${random}`)
      .then(res => setLocation(res.data))
  }, [])

  const searchLocation = () => {
    axios.get(`https://rickandmortyapi.com/api/location/${locationId}`)
      .then(res => setLocation(res.data));
  }

  document.body.style = `background:  url(${bodyBackground}) no-repeat center center fixed`

  ////////////// Autocomplete
  const [allLocations, setAllLocations] = useState([])
  const [locations, setLocations] = useState([])
  const [value, setValue] =useState('')
  const [locationSelect, setLocationSelect] = useState({})

  const onSuggestionsFetchRequested = ({value})=>{
    setLocations(locationsFilter(value))
  }

  const locationsFilter = (value)=>{
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    let filtered = allLocations.filter((locationFiltered)=>{
      let completeText = locationFiltered.name;

      if(completeText.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(inputValue)){
        return locationFiltered;
      }
    });

    return inputLength === 0 ? [] : filtered
  }

  const onSuggestionsClearRequested = () => {
    setLocations([]);
  }

  const getSuggestionValue = (suggestion) => {
    return `${suggestion.name}`
  }

  const renderSuggestion = (suggestion) => (
    <div className='sugerencia' onClick={()=>selectLocation(suggestion)}>
      <span className='suggest'>{`${suggestion.name}`}</span>
    </div>
  )

  const selectLocation =(location) => {
    setLocationSelect(location)
  }
  
  const onChange = (e, {newValue}) => {
    setValue(newValue);
  }

  const inputProps = {
    placeholder: "Location name...",
    value,
    onChange,
  }

  const enterEvent = (e) => {
    if(e.key == "Enter"){
      let currentLocation = allLocations.filter(location => location.name == e.target.value.trim())
      selectLocation(currentLocation)
    }
  }

  const enterInId =(e) =>{
    if(e.key =="Enter"){
      axios.get(`https://rickandmortyapi.com/api/location/${locationId}`)
      .then(res => setLocation(res.data));
    }
  }
  
  useEffect(()=>{

    const arrayLocationsId=[]
    for(let i = 1; i < 127; i++){
      arrayLocationsId.push(i)
    }
    axios.get(`https://rickandmortyapi.com/api/location/${arrayLocationsId}`)
      .then(res => {
        setAllLocations(res.data)
        setLocations(res.data)
      })
  }, [])

  return (
    <>
      <div className="App">
      <header>
        <img className='logo' src={RickAndMortyLogo} alt="" />
      </header>
      <h1 className='Title'>Rick and Morty Wiki</h1>
      <div className='typesOfSearch'>
        <div className='searchType'>
          <h2>Search by number</h2>
          <input type="text" onKeyDown={enterInId} value={locationId} maxLength='3' onChange={e => setLocationId(e.target.value)} placeholder="1 - 126" />
          <button onClick={searchLocation}><i className="fa-solid fa-magnifying-glass fa-2xl"></i></button>
        </div>

        <div className='searchType'>
          <h2>Search by name</h2>
          <Autosuggest 
          suggestions={locations}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={enterEvent}
          />
          <button 
            onClick={Array.isArray(locationSelect) ? ()=> setLocation(locationSelect[0]) : ()=> setLocation(locationSelect)}>
            <i className="fa-solid fa-magnifying-glass fa-2xl"></i>
          </button>

        </div>

      </div>

      <h2 id='LocationInformationTitle'>Location Information</h2>
      <div className='locationCard'>
          <div className='locationCardInfo'>
            <h3>Name:</h3>
            <span>{location?.name}</span>
            <i className="fa-solid fa-infinity fa-2xl"></i>
          </div>
          <div className='locationCardInfo'>
            <h3>Dimension:</h3>
            <span>{location?.dimension}</span>
            <i className="fa-solid fa-cubes fa-2xl"></i>
          </div>
          <div className='locationCardInfo'>
            <h3>Type:</h3>
            <span>{location?.type}</span>
            <i className="fa-solid fa-location-crosshairs fa-2xl"></i>
          </div>
            <div className='locationCardInfo'>
            <h3>Population:</h3>
            <span>{location?.residents?.length}</span>
            <i className="fa-solid fa-users fa-2xl"></i>
          </div>
      </div>
      <div>

        <ul className='locationResidents'>
          {
          location?.residents?.map(residentEndPoint => (
            <ResidentInfo 
              residentEndPoint={residentEndPoint}
              key={residentEndPoint}
            />
            ))
          }
          
        </ul>
      </div>
      </div>
    </>
  )
}

export default App
