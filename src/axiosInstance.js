import axios from "axios";
import store from "./Redux/store";
import { setAccessToken, logoutSuccess } from "./Redux/userSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

/* =======================
   REQUEST INTERCEPTOR
   ======================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =======================
   RESPONSE INTERCEPTOR
   ======================= */

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // bỏ qua login & refresh
    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // chỉ refresh 1 lần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post("/v1/user/auth/refresh");
        const newAccessToken = res.data.accessToken;

        // lưu token mới
        store.dispatch(setAccessToken(newAccessToken));

        // gắn token mới & retry request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logoutSuccess());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/signin") &&
//       !originalRequest.url.includes("/auth/refresh")
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(axiosInstance(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await axiosInstance.post("/v1/user/auth/refresh");
//         const newAccessToken = res.data.accessToken;

//         store.dispatch(setAccessToken(newAccessToken));
//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         store.dispatch(logoutSuccess());
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
