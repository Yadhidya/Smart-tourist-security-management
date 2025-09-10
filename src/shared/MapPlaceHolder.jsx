
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


// fix default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})


export default function MapPlaceholder({ center = {lat:13.1,lng:80.0}, markers=[] }){
return (
    <div className="h-64 rounded overflow-hidden">
        <MapContainer center={[center.lat, center.lng]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((m, i)=> (
            <Marker key={i} position={[m.lat, m.lng]}>
                <Popup>Mock marker</Popup>
            </Marker>
        ))}
        </MapContainer>
    </div>
    )
}