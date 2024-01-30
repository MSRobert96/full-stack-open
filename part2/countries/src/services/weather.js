import axios from 'axios'

const api_key = import.meta.env.VITE_OPENWEATHER_KEY
const api_url = 'http://api.openweathermap.org/data/2.5/weather'
const icon_url = 'https://openweathermap.org/img/wn/{icon}@2x.png'

const getWeather = (country) => {
    return axios
        .get(api_url, {
            params: {
                lat: country.capitalInfo.latlng[0],
                lon: country.capitalInfo.latlng[1],
                appid: api_key,
                units: 'metric'
            }
        })
        .then(res => res.data)
}

const getIconUrl = (code) => icon_url.replace("{icon}", code)

export default { getWeather, getIconUrl }