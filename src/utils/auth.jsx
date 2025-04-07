import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      username: payload.username,
      user_rights: payload.user_rights,
      office: payload.office,
    };
  };