import { Link} from "react-router";

interface NearbyShopCardProps{
    id: number
    img_url: string,
    name: string,
    distance: string
}

function NearbyShopCard({id, img_url, name, distance}:NearbyShopCardProps){

    return (
        <Link to={`/shop/${id}`}>
            <div className="flex flex-col">
                <img src={img_url} className="h-[126px] w-[180px] object-cover mb-4"/>
                <p className="mb-1">{name}</p>
                <p className="text-[#878787]">{distance} m</p>
            </div>
        </Link>
    );
}

export default NearbyShopCard