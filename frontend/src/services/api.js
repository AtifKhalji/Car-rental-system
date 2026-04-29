import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

/* TOKEN */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

/* AUTH */
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

/* CARS */
export const getCars = () => API.get("/cars");

/* BOOKINGS */
export const bookCar = (data) => API.post("/bookings", data);
export const getBookings = () => API.get("/bookings");
export const deleteBooking = (id) =>
  API.delete(`/bookings/${id}`);

/* OWNER */
export const getOwnerCars = () => API.get("/owner/cars");
export const getOwnerBookings = () => API.get("/owner/bookings");
export const addCar = (data) => API.post("/owner/cars", data);
export const updateCarPrice = (id, pricePerDay) =>
  API.put(`/owner/cars/${id}/price`, { pricePerDay });
export const deleteOwnerCar = (id) =>
  API.delete(`/owner/cars/${id}`);

/* ADMIN */
export const getAllUsers = () => API.get("/admin/users");
export const deleteUser = (email) =>
  API.delete(`/admin/users/${email}`);
export const getAllBookings = () =>
  API.get("/admin/bookings");
export const getComplaints = () =>
  API.get("/admin/complaints");

/* COMPLAINT */
export const sendComplaint = (data) =>
  API.post("/complaint", data);
