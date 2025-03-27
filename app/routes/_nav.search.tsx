import { useEffect } from "react";
import { searchShopsRequest } from "~/repositories/shop.repository";
import type {SearchShopsResponse } from "~/types/search";
import { calculateDistance } from "~/utils/location";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useFetcher, useNavigation, useSearchParams } from "react-router";
import SearchShopCard from "~/components/search-shop-card";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const url = new URL(request.url);
  
  const key = formData.get("key") as string || url.searchParams.get("key") || "";
  const page = Number.parseInt(formData.get("page") as string || url.searchParams.get("page") || "1");
  
  // Parse filter params from URL or form data
  const sortByDistance = formData.get("sortByDistance") === "true" || url.searchParams.get("sortByDistance") === "true";
  const filterLowQueue = formData.get("filterLowQueue") === "true" || url.searchParams.get("filterLowQueue") === "true";
  const filterOpenOnly = formData.get("filterOpenOnly") === "true" || url.searchParams.get("filterOpenOnly") === "true";
  const userLatitude = 13.8479786;
  const userLongitude = 100.5697013;

  try {
    const response: SearchShopsResponse = await searchShopsRequest(request, key, page, {sortByDistance, filterLowQueue, filterOpenOnly, latitude:userLatitude, longitude:userLongitude});

    let shops = response.shops.map(shop => ({
      ...shop,
      total_queue: calculateTotalQueue(shop.queues || []).toString(),
    }));

    if (filterOpenOnly) {
        shops = shops.filter(shop => shop.is_open);
      }

    if (filterLowQueue) {
      shops.sort((a, b) => calculateTotalQueue(a.queues || []) - calculateTotalQueue(b.queues || []));
    }

    const shopsWithImages = await Promise.all(
      shops.map(async shop => ({
        ...shop,
        image_url: shop.image_url,
      }))
    );

    return {
      success: true,
      value: {
        shops: shopsWithImages,
        pagination: response.pagination,
        key,
        page,
        sortByDistance,
        filterLowQueue,
        filterOpenOnly,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch shop data",
      error: { general: ["An error occurred while fetching shop data"] },
      value: {
        shops: [],
        pagination: { totalPages: 1, totalCount: 0 },
        key: "",
        page: 1,
        sortByDistance: false,
        filterLowQueue: false,
        filterOpenOnly: false,
      },
    };
  }
}

function calculateTotalQueue(queues: any[]): number {
  if(!queues) return 0;
  return queues.reduce((total, queue) => total + (queue.is_available ? queue.queue_counter : 0), 0);
}

const SearchShopPage = () => {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoading = navigation.state === "submitting";

  const searchTerm = searchParams.get("key") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortByDistance = searchParams.get("sortByDistance") === "true";
  const filterLowQueue = searchParams.get("filterLowQueue") === "true";
  const filterOpenOnly = searchParams.get("filterOpenOnly") === "true";
  const userLatitude = 13.8479786;
  const userLongitude = 100.5697013;

  useEffect(() => {
    if (!searchParams.toString()) {
      fetcher.submit({ key: "", page: 1 }, { method: "POST" });
    }
  }, []);

  let shops =
    fetcher.data?.value?.shops.map((shop: { latitude: string; longitude: string; }) => ({
      ...shop,
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        parseFloat(shop.latitude),
        parseFloat(shop.longitude)
      ).toFixed(2),
    })) || [];

  if (sortByDistance) {
    shops.sort((a: { distance: string; }, b: { distance: string; }) => parseFloat(a.distance) - parseFloat(b.distance));
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (fetcher.data?.value?.pagination?.total_pages && newPage > fetcher.data.value.pagination.total_pages)) {
      return;
    }
    
    // Update search params and submit
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);

    fetcher.submit({ 
      key: searchTerm, 
      page: newPage,
      sortByDistance: sortByDistance.toString(),
      filterLowQueue: filterLowQueue.toString(),
      filterOpenOnly: filterOpenOnly.toString()
    }, { method: "POST" });
  };

  const handleFilterToggle = (filterType: 'sortByDistance' | 'filterLowQueue' | 'filterOpenOnly') => {
    const newParams = new URLSearchParams(searchParams);

    switch (filterType) {
      case 'sortByDistance':
        newParams.set("sortByDistance", (!sortByDistance).toString());
        break;
      case 'filterLowQueue':
        newParams.set("filterLowQueue", (!filterLowQueue).toString());
        break;
      case 'filterOpenOnly':
        newParams.set("filterOpenOnly", (!filterOpenOnly).toString());
        break;
    }

    newParams.set("page", "1");
    setSearchParams(newParams);

    fetcher.submit({ 
      key: searchTerm, 
      page: 1,
      sortByDistance: newParams.get("sortByDistance") || "false",
      filterLowQueue: newParams.get("filterLowQueue") || "false",
      filterOpenOnly: newParams.get("filterOpenOnly") || "false"
    }, { method: "POST" });
  };

  return (
    <div className="container mx-auto p-6">
      <fetcher.Form method="post" className="mb-6 flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            name="key"
            placeholder="Search for shops..."
            value={searchTerm}
            onChange={e => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("key", e.target.value);
              setSearchParams(newParams);
            }}
            className="w-full pl-12 pr-4 py-3 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button type="submit" className="px-6 py-3 bg-primary-dark text-white rounded-full shadow-md hover:bg-blue-700 transition">
          Search
        </button>
      </fetcher.Form>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleFilterToggle('sortByDistance')}
          className={`px-6 py-3 rounded-full shadow-md transition ${sortByDistance ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          Sort by Distance
        </button>

        <button
          onClick={() => handleFilterToggle('filterLowQueue')}
          className={`px-6 py-3 rounded-full shadow-md transition ${filterLowQueue ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          Lowest Queue
        </button>

        <button
          onClick={() => handleFilterToggle('filterOpenOnly')}
          className={`px-6 py-3 rounded-full shadow-md transition ${filterOpenOnly ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          Open Shops
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center text-gray-500">No shops found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop: { id: number; image_url: string; name: string; distance: string; queues: any[]; description: string | undefined; is_open:boolean }, index: any) => (
              <SearchShopCard
                key={shop.id || `shop-${index}`}
                shop_id={shop.id}
                img_url={shop.image_url}
                name={shop.name}
                distance={shop.distance}
                total_queue={calculateTotalQueue(shop.queues)}
                description={shop.description}
                is_open={shop.is_open}
              />
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-gray-300 text-gray-600 hover:bg-gray-400 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 text-lg font-semibold">Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= (fetcher.data?.value?.pagination?.total_pages || 1)}
              className="p-3 rounded-full bg-gray-300 text-gray-600 hover:bg-gray-400 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchShopPage;