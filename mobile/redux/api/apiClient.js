const BASE_URL = "http://10.100.95.54:5000/api/v1";

export const apiClient = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw new Error(data?.message || "API request failed");
    }

    return data;
  } catch (err) {
    throw err;
  }
};
