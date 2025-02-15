import { useEffect, useState } from "react";
import MarkerPopup, { MarkerData } from "~/components/marker_popup";
import { Loader2 } from "lucide-react";

function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<MarkerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState();
  const zoomLevel = 15;

  useEffect(() => {
    if (typeof document !== "undefined") {
      (async () => {
        try {
          const L = await import("leaflet");
          setIsLoading(true);

          let map = L.map("map").setView([13.84791, 100.57132], zoomLevel);

          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '<a href="https://www.openstreetmap.org/#map=16/13.84791/100.57132"></a>',
          }).addTo(map);

          const places = [
            {
              title: "My Restaurant",
              address:
                "1687 1 ถ. พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900",
              currentQueue: 159,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.84791, 100.57132] as any,
            },
            {
              title: "Cafe 123",
              address: "123 Main St, Bangkok, Thailand",
              currentQueue: 89,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.84991, 100.57332] as any,
            },
            {
              title: "Bistro XYZ",
              address: "456 Side St, Bangkok, Thailand",
              currentQueue: 45,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.84591, 100.56932] as any,
            },
            {
              title: "Sunset Grill",
              address: "789 Sukhumvit Rd, Bangkok, Thailand",
              currentQueue: 72,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.82937, 100.56798] as any,
            },
            {
              title: "Green Garden Cafe",
              address: "1010 Rama IV Rd, Bangkok, Thailand",
              currentQueue: 32,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.82745, 100.56612] as any,
            },
            {
              title: "Spice Haven",
              address: "888 Ladprao Rd, Bangkok, Thailand",
              currentQueue: 120,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.82688, 100.5699] as any,
            },
            {
              title: "River Breeze Diner",
              address: "999 Charoenkrung Rd, Bangkok, Thailand",
              currentQueue: 50,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.83012, 100.57045] as any,
            },
            {
              title: "Urban Bean Cafe",
              address: "1122 Rama IX Rd, Bangkok, Thailand",
              currentQueue: 25,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8295, 100.5668] as any,
            },
            {
              title: "The Cozy Cup",
              address: "55 Phetchaburi Rd, Bangkok, Thailand",
              currentQueue: 40,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8312, 100.5675] as any,
            },
            {
              title: "Thai Street Bites",
              address: "222 Phra Ram 9 Rd, Bangkok, Thailand",
              currentQueue: 60,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8333, 100.569] as any,
            },
            {
              title: "Bamboo Leaf Eatery",
              address: "789 Silom Rd, Bangkok, Thailand",
              currentQueue: 95,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8279, 100.5701] as any,
            },
            {
              title: "Velvet Brews",
              address: "333 Sukhumvit Soi 11, Bangkok, Thailand",
              currentQueue: 20,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8257, 100.5682] as any,
            },
            {
              title: "Nom Nom Cafe",
              address: "444 Wireless Rd, Bangkok, Thailand",
              currentQueue: 35,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8265, 100.5709] as any,
            },
            {
              title: "The Secret Garden",
              address: "555 Sathorn Rd, Bangkok, Thailand",
              currentQueue: 15,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.828, 100.5665] as any,
            },
            {
              title: "Golden Lotus Restaurant",
              address: "666 Ratchada Rd, Bangkok, Thailand",
              currentQueue: 85,
              imgUrl:
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg",
              coords: [13.8328, 100.568] as any,
            },
          ];

          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position.coords);
              let { latitude, longitude } = position.coords;
              let userLocation = L.latLng(latitude, longitude);
              var greenIcon = new L.Icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                shadowUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });

              const userMarker = L.marker(userLocation, {
                icon: greenIcon,
              }).addTo(map);

              userMarker.on("click", (e) => {
                console.log("Here");
              });

              places.forEach((place) => {
                if (map.distance(userLocation, place.coords) < 2000) {
                  const marker = L.marker(place.coords).addTo(map);
                  marker.on("click", (e) => {
                    setSelectedPlace(place);
                  });
                }
              });
            },
            (error) => {
              places.forEach((place) => {
                console.log(place);

                const marker = L.marker(place.coords).addTo(map);
                marker.on("click", (e) => {
                  setSelectedPlace(place);
                });
              });
            },
            { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
          );
        } catch (error) {
          console.error("Error loading map:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, []);

  return (
    <div className="relative flex flex-col bg-sky-400 h-screen">
      

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-900" />
            <p className="text-cyan-900 font-medium">Loading map...</p>
          </div>
        </div>
      ) : null}

      <div id="map" className="w-screen h-screen z-0" />
      {selectedPlace && <MarkerPopup markerData={selectedPlace} />}
    </div>
  );
}

export default MapPage;
