import { useEffect, useState } from "react"
import countriesService from "./services/countries"
import weatherService from "./services/weather"

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService.getWeather(country)
      .then(w => setWeather(w))
  }, [])

  if (!weather)
    return <></>

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <div>temperature {weather.main.temp} Celsius</div>
      <img src={weatherService.getIconUrl(weather.weather[0].icon)} alt={weather.weather[0].description} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )

}

const Countries = ({ countries, showCountry }) => {
  if (countries.length > 10)
    return <p>Too many matches, specify another filter</p>

  if (countries.length == 1) {
    let country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital[0]}</div>
        <div>area {country.area}</div>
        <h4>languages</h4>
        <ul>
          {Object.entries(country.languages).map(([key, value]) => <li key={key}>{value}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <Weather country={country} />
      </div>
    )
  }

  return (
    <>
      {countries.map(country =>
        <div key={country.name.common}>
          <span>{country.name.common}</span>
          <button onClick={showCountry(country)}>show</button>
        </div>
      )}
    </>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    if (search)
      countriesService.getAll()
        .then(data => data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())))
        .then(filteredData => setCountries(filteredData))

  }, [search])

  const handleShowCountry = (country) => () => {
    setSearch(country.name.common)
  }

  return (
    <>
      <div>find countries <input type="text" value={search} onChange={e => setSearch(e.target.value)} /></div>
      <Countries countries={countries} showCountry={handleShowCountry} />
    </>
  )
}

export default App
