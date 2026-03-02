const API_BASE_URL = "https://tourify-backend-99ef.onrender.com/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

export const api = {
    auth: {
        register: (userData: any) =>
            fetchWithAuth("/auth/register", {
                method: "POST",
                body: JSON.stringify(userData),
            }),
        login: (credentials: any) =>
            fetchWithAuth("/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            }),
    },
    world: {
        getDestinations: () => fetchWithAuth("/world/destinations"),
        getTrips: () => fetchWithAuth("/world/trips"),
    },
};
