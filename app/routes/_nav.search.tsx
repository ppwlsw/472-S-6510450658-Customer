import { useEffect, useState } from "react";
import { useFetcher, useNavigation } from "react-router";
import SearchShopCard from "~/components/search-shop-card";
import { searchShopsRequest } from "~/repositories/shop.repository";
import type { Pagination, SearchShop, SearchShopsResponse } from "~/types/search";
import { calculateDistance } from "~/utils/location";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { prefetchImage } from "~/utils/image-proxy";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const key = formData.get("key") as string;
  const page = Number.parseInt(formData.get("page") as string) || 1;

  try {
    const response: SearchShopsResponse = await searchShopsRequest(request, key, page);

    const shopsWithTotalQueue = response.shops.map(shop => ({
      ...shop,
      total_queue: calculateTotalQueue(shop.queues || []).toString(),
    }));

    const finalShops = await Promise.all(
      shopsWithTotalQueue.map(async shop => {
        shop.image_url = await prefetchImage(shop.image_url);
        return shop;
      })
    );

    return {
      success: true,
      value: {
        shops: finalShops,
        pagination: response.pagination,
        key,
        page,
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
      },
    };
  }
}

function calculateTotalQueue(queues: any[]): number {
  return queues.reduce((total, queue) => total + (queue.is_available ? queue.queue_counter : 0), 0);
}

const SearchShopPage = () => {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const isLoading = navigation.state === "submitting";

  const userLatitude = 13.8479786;
  const userLongitude = 100.5697013;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [sortByDistance, setSortByDistance] = useState(false);  // Track sorting preference
  const [filterLowQueue, setFilterLowQueue] = useState(false);
  const [filterOpenOnly, setFilterOpenOnly] = useState(false);  // Open only filter state

  useEffect(() => {
    if (isFirstLoad) {
      fetcher.submit({ key: "", page: 1 }, { method: "POST" });
      setIsFirstLoad(false);
    }
  }, [fetcher, isFirstLoad]);

  useEffect(() => {
    if (fetcher.data) {
      setSearchTerm(fetcher.data.value?.key || "");
      setCurrentPage(fetcher.data.value?.page || 1);
    }
  }, [fetcher.data]);

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

  // Sort shops by distance when the option is enabled
  if (sortByDistance) {
    shops.sort((a: { distance: string; }, b: { distance: string; }) => parseFloat(a.distance) - parseFloat(b.distance));
  }

  if (filterLowQueue) {
    shops = [...shops].sort((a, b) => (calculateTotalQueue(a.queues) || 0) - (calculateTotalQueue(b.queues) || 0));
  }

  // Filter shops by open status if the filter is enabled
  if (filterOpenOnly) {
    shops = shops.filter((shop: { queues: any[]; }) => shop.queues.some(queue => queue.is_available));
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (fetcher.data?.value?.pagination?.total_pages && newPage > fetcher.data.value.pagination.total_pages)) {
      return;
    }
    fetcher.submit({ key: searchTerm, page: newPage }, { method: "POST" });
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
            onChange={e => setSearchTerm(e.target.value)}
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
            onClick={() => setSortByDistance(!sortByDistance)}
            className={`px-6 py-3 rounded-full shadow-md transition ${sortByDistance ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
            Sort by Distance
        </button>

        <button
            onClick={() => setFilterLowQueue(!filterLowQueue)}
            className={`px-6 py-3 rounded-full shadow-md transition ${filterLowQueue ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
            Lowest Queue
        </button>

        <button
            onClick={() => setFilterOpenOnly(!filterOpenOnly)}
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
            {shops.map((shop: { id: number; image_url: string; name: string; distance: string; queues: any[]; description: string | undefined; }, index: any) => (
              <SearchShopCard
                key={shop.id || `shop-${index}`}
                shop_id={shop.id}
                img_url={shop.image_url}
                name={shop.name}
                distance={shop.distance}
                total_queue={calculateTotalQueue(shop.queues)}
                description={shop.description}
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
