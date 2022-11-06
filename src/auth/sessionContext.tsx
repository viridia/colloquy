import { createContext, useContext } from "solid-js";
import type { IClientSession } from "./session";

export const SessionContext = createContext<IClientSession>();
export const useClientSession = () => useContext(SessionContext);
