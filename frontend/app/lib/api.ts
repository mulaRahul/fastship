import { Api } from "./client";

const api = new Api({
    baseURL: "http://localhost:8000",
    securityWorker: (token) => {
        if (token) {
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        }
        return {}
    }
})

export default api