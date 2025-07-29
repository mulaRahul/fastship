import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/account", "routes/account.tsx"),
    route("/submit-shipment", "routes/seller/submit-shipment.tsx"),
    route("/update-shipment", "routes/partner/update-shipment.tsx"),
    route("/seller/login", "routes/seller/login.tsx"),
    route("/seller/forgot-password", "routes/seller/forgot-password.tsx"),
    route("/partner/login", "routes/partner/login.tsx"),
] satisfies RouteConfig;
