const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const mapService = {
  getMapData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/planets/map/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch map data: ${response.statusText}`);
      }

      const data = await response.json();
      return data.planets; // Return planets array
    } catch (error) {
      console.error("❌ Error fetching map data:", error);
      throw error;
    }
  },

  getRoutes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch routes: ${response.statusText}`);
      }

      const data = await response.json();
      return data.routes; // Return routes array
    } catch (error) {
      console.error("❌ Error fetching routes:", error);
      throw error;
    }
  },

  getRouteBetweenPlanets: async (sourceId, destId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/routes/${sourceId}/${destId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch route: ${response.statusText}`);
      }

      const data = await response.json();
      return data.route;
    } catch (error) {
      console.error("❌ Error fetching route:", error);
      throw error;
    }
  },
};

export default mapService;
