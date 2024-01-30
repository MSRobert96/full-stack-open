import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => axios.get(`${baseUrl}/all`).then(res => res.data)
const get = (name) => axios.get(`${baseUrl}/name/${name}`).then(res => res.data)

export default { getAll, get }