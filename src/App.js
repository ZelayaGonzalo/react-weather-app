import './App.css';
import {useEffect,useState} from "react"
const initalHeight=window.innerHeight
const initialWidth=window.innerWidth
document.body.style.height="100vh"
document.body.style.minHeight=`${initalHeight}px`
document.body.style.width=initialWidth
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function App() {
  const [data,setData]=useState(null)
  const [search,setSearch]=useState("")
  const [forecastData,setForecastData]=useState([])

  function handleSearch(event){
    const value=event.target.value
    setSearch(value)
  }


  async function getData(){
    try{
      const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=c0e154dd9b98a25155bb3d7883758ba1`)
      const data=await response.json()
      return data
      }
      catch{
        alert("No city found")
        return null
      }
  }


  async function searchCity(event){
   event.preventDefault()
   const newData=await getData()
    if(newData.sys){
      await loadForecast(newData.coord.lat,newData.coord.lon)
      setData(newData)
   }
   else{
     alert("No city found")
   }
  }

  async function loadForecast(lat,lon ){
    const response= await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=c0e154dd9b98a25155bb3d7883758ba1`)
    const data= await response.json()
    setForecastData(data.daily)
  }

  async function firstLoad(){
    const response=await fetch("https://api.openweathermap.org/data/2.5/weather?q=Salta&units=metric&appid=c0e154dd9b98a25155bb3d7883758ba1")
    const data=await response.json()
    await loadForecast(data.coord.lat,data.coord.lon)
    setData(data)
  }

  useEffect(()=>{
    firstLoad()
  },[])


  function returnCorrectIcon(id){
    if(id >= 200 && id <= 299){
      return "fas fa-bolt"
    }
    else if(id >=300 && id <=399){
      return "fas fa-cloud-sun-rain"
    }
    else if(id >=500 && id <=599){
      return "fas fa-cloud-showers-heavy"
    }
    else if(id >=600 && id <=699){
      return "fas fa-snowflake"
    }
    else if(id >=700 & id <=799){
      return "fas fa-smog"
    }
    else if (id === 800){
      return "fas fa-sun"
    }
    else if (id >=801 && id <=899){
      return "fas fa-cloud"
    }
    else return "fas-fa-sun"
  }

  function returnDay(string){
    const newDate=new Date(string *1000)
    return newDate.getDay()
  }
  function convertSunset(string){
    const newDate=new Date(string * 1000)
    return `${newDate.getHours()}:${newDate.getMinutes()}`
  }
  
  return (
<div className="containers">
  <div className="wheater-container">
    <div className="search-container">
      <form onSubmit={searchCity} className="search-box">
        <input  onChange={handleSearch} value={search} type="text" placeholder="Search..."></input>
        <button type="submit"><i className="fas fa-search-location"></i></button>
      </form>
    </div>
    <div className="container data">
      <p className="city">{data===null? "Search a city":`${data.name},${data.sys.country}`}</p>
      <div className="date">
        <span className="main-text">Today</span> 
      </div>
      <div className="main-temp">
        <span className="main-text">{data===null ?"...": data.main.temp}</span> <span style={{position:'absolute',top:"20%"}}>°C</span>
        <span className="sub-text">{data===null ?"...": `Feels like ${data.main.feels_like} °C`}</span>
      </div>
    </div>
  </div>
  <div className="forecast">
    <div className="forecast-container">
      <p>Next 7 days</p>
      <ul className="days-container">
        {forecastData.map(info => (<li>
          <div className="day-frame">
          <p className="current-day">{weekday[returnDay(info.dt)]}</p>
          <i className={returnCorrectIcon(info.weather[0].id)}></i>
          <p>{Math.round(info.temp.day)}<span>°C</span></p>
        </div>      
        </li>))}
      </ul>
    </div>
  </div>
  <div className="details">
    <div className="details-container">
      <div className="side left">
        <ul className="details-frame left">
          <li className="details-item">
            <span className="details-title">SUNRISE</span>
            <p className="details-text">{data===null ?"...": convertSunset(data.sys.sunrise)}</p>
          </li>
          <li className="details-item">
            <span className="details-title">WEATHER</span>
            <p className="details-text">{data===null ?"...": data.weather[0].main}</p>
          </li>
          <li className="details-item">
            <span className="details-title">WIND</span>
            <p className="details-text">{data===null ?"...": `${data.wind.speed}Km/h`}</p>
          </li>
        </ul>
      </div>
      <div className="side right">
      <ul className="details-frame right">
        <li className="details-item">
          <span className="details-title">SUNSET</span>
          <p className="details-text">{data===null ?"...": convertSunset(data.sys.sunset)}</p>
        </li>
        <li className="details-item">
          <span className="details-title">HUMIDITY</span>
          <p className="details-text">{data===null ?"...": data.main.humidity}</p>
        </li>
        <li className="details-item">
          <span className="details-title">PRESSURE</span>
          <p className="details-text">{data===null ?"...": `${data.main.pressure} hPa`}</p>
        </li>
        </ul>
      </div>
    </div>
  </div>
</div>
  )
}

export default App;
