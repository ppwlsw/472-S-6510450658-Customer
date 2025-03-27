import { useEffect, useState } from "react";
import MarkerPopup, { type MarkerData } from "~/components/marker_popup";
import { Loader2 } from "lucide-react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useAuth } from "~/utils/auth";
import { prefetchImage } from "~/utils/image-proxy";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });
  const token = data?.token;

  const url = new URL(request.url);

  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");

  if (latitude && longitude) {
    console.log("Latitude:", latitude, "Longitude:", longitude);
    console.log(
      `PATH : ${process.env.API_BASE_URL}/shops/location/nearby?latitude=${latitude}&longitude=${longitude}`
    );
    const response = await fetch(
      `${process.env.API_BASE_URL}/shops/location/nearby?latitude=${latitude}&longitude=${longitude}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const nearby_shops = await response.json();

    const converted = await Promise.all(
      nearby_shops.data.map(async (shop: any) => {
        const image_url = await prefetchImage(shop.image_url);
        shop.image_url = image_url;

        return shop;
      })
    );

    console.log("[CONVERTED] shops : ", converted);

    return {
      nearby_shops,
      latitude,
      longitude,
    };
  } else {
    return {};
  }
}

function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<MarkerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState<MarkerData[]>([]); // Store fetched places
  const zoomLevel = 15;

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const params = new URLSearchParams(window.location.search);

          if (!params.has("latitude") || !params.has("longitude")) {
            params.set("latitude", latitude.toString());
            params.set("longitude", longitude.toString());
            window.location.search = params.toString(); // Reload with params
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
        },
        { maximumAge: 60, timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, []);

  const { nearby_shops, latitude, longitude } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (typeof document !== "undefined") {
      (async () => {
        try {
          const L = await import("leaflet");
          setIsLoading(true);
          let map = L.map("map").setView(
            [
              latitude ? parseFloat(latitude) : 13.84791, // Default latitude
              longitude ? parseFloat(longitude) : 100.57132, // Default longitude
            ],
            zoomLevel
          );
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '<a href="https://www.openstreetmap.org/#map=16/13.84791/100.57132"></a>',
          }).addTo(map);

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              let { latitude, longitude } = position.coords;
              let userLocation = L.latLng(latitude, longitude);

              var customUsermarker = new L.Icon({
                iconUrl: "/here-icon.png",

                iconSize: [46, 46],
                iconAnchor: [12, 41],
              });

              const userMarker = L.marker(userLocation, {
                icon: customUsermarker,
              }).addTo(map);

              try {
                const shops = nearby_shops.data.map((shop: any) => ({
                  id: shop.id,
                  title: shop.name,
                  address: shop.address,
                  imgUrl: shop.image_url,
                  coords: [
                    parseFloat(shop.latitude),
                    parseFloat(shop.longitude),
                  ],
                  distance: shop.distance,
                  is_open: shop.is_open,
                }));

                setPlaces(shops);

                shops.forEach((place: any) => {
                  const shopMarker = new L.Icon({
                    iconUrl: "/def-res-icon.png",
                    shadowSize: [36, 36],
                    iconSize: [48, 48],
                  });
                  const marker = L.marker(place.coords, {
                    icon: shopMarker,
                  }).addTo(map);
                  marker.on("click", () => setSelectedPlace(place));
                });
              } catch (error) {
                console.error("Error fetching nearby shops:", error);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              setIsLoading(false);
            },
            { maximumAge: 60, timeout: 5000, enableHighAccuracy: true }
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
    <div className="relative flex flex-col">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-900" />
            <p className="text-cyan-900 font-medium">Loading map...</p>
          </div>
        </div>
      ) : null}
      <div id="map" className="w-screen h-[90vh] z-0" />
      {selectedPlace && <MarkerPopup markerData={selectedPlace} />}
    </div>
  );
}

export default MapPage;
