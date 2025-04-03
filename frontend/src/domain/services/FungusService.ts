import axios from "axios";
import { Fungus } from "../models/Fungus";

const API_URL = "http://localhost:4000/api/fungus";

export const getFungi = async (): Promise<Fungus[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createFungus = async (fungus: Fungus): Promise<Fungus> => {
  const response = await axios.post(API_URL, fungus);
  return response.data;
};

export const updateFungus = async (fungus: Fungus): Promise<Fungus> => {
  const response = await axios.put(`${API_URL}/${fungus.id}`, fungus);
  return response.data;
};

export const deleteFungus = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};