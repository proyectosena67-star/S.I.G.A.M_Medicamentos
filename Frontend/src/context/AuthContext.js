import { createContext } from "react";

/** Guarda quién tiene la sesión iniciada. Se usa con el hook useAuth. */
export const AuthContext = createContext(null);
