import './styles/app.css';
import L, { icon, map } from 'leaflet';
import leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as Arrow } from "./images/icon-arrow.svg"
function App() {
  const [ipAdress, setIpAdress] = useState("")
  const [info, setInfo] = useState(null);
  const [geoLocation, setGeoLocation] = useState([51.505, -0.09]);
  const [inputData, setInputData] = useState("");
  const [firstRender, setFirtsRender] = useState(true);
  const [reRender, setReRender] = useState(true);
  const map = useRef();
  useEffect(() => {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_yGg4l9dF5rPqqowarKKWUn3YTG8zC&ipAddress=${ipAdress}`)
      .then(res => { return res.json(); }).then(data => { setInfo(data); console.log(data); }).catch(err => { console.log(err) });
  }, [ipAdress]);
  useEffect(() => {
    map.current = L.map('map').setView(geoLocation, 13);
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoicm9kcmlzYXBpZW5zIiwiYSI6ImNremg0MzZzeTN0Zmkyb28wYnZqdjJmZWQifQ.erL9dYBUvl1be73F4JUuRw'
    }).addTo(map.current);
    L.marker(geoLocation).addTo(map.current);
  }, [])
  useEffect(() => {
    if (!firstRender) {
      map.current.setView([info.location.lat, info.location.lng], 13);
      leaflet.marker([info.location.lat, info.location.lng]).addTo(map.current);
    }
    setFirtsRender(false);

  }, [info])
  

  function handleInput(e) {
    setInputData(e.currentTarget.value);
  }
  function handleClick() {
    setIpAdress(inputData)
    setGeoLocation([info.location.lat, info.location.lng])
  }
  return (
    <div className="App">
      <div className="header">
        <h1 className="myTitle">IP Address Tracker</h1>
        <div className="serchLine">
          <input type="text" className="myInput" required placeholder='Serch for any IP adress or domain' value={inputData} onChange={handleInput} />
          <button className="blackBtn" onClick={handleClick}><Arrow className='arrow' /></button>
        </div>
      </div>
      <div className="infoGrid">
        <div className="border-gradient infoConteiner">
          <p className="infoDescription">IP ADDRESS</p>
          <h1 className='info'>{info !== null ? info.ip : "wait"}</h1>
        </div>
        <div className="border-gradient infoConteiner">
          <p className="infoDescription">LOCATION</p>
          <h1 className='info'>{info !== null ? info.location.region+","+info.location.country : "wait"}</h1>
        </div>
        <div className="border-gradient infoConteiner">
          <p className="infoDescription">TOME ZONE</p>
          <h1 className='info'>{info !== null ? "UTC" + info.location.timezone : "wait"}</h1>
        </div>
        <div className="border-gradient infoConteiner">
          <p className="infoDescription">ISP</p>
          <h1 className='info'>{info !== null ? info.isp : "wait"}</h1>
        </div>
      </div>
      <div id="map" className='map'></div>
    </div>
  );
}

export default App;
