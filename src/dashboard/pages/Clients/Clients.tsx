import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import FiltersSection from "./components/FiltersSection";
import MetricsSection from "./components/MetricsSection";
import ClientTable from "./components/ClientTable";

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const Clients = () => {
  const [clients, setClients] = useState([]); // Store clients (both full & filtered)
  const [filters, setFilters] = useState(null); // Store active filters
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/clients/getAccountClients");
      console.log("Clients data:", response.data);

      setClients(response.data.clients);
      setFilters(null); // Reset filters when fetching new data
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error(
        error.response
          ? `Error fetching clients: ${error.response.data.message || error.response.statusText}`
          : "Failed to fetch clients. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (newFilters) => {
    console.log("Applying filters:", newFilters);
    try {
      const response = await api.post("/api/clients/getFilteredAccountClients", { filters: newFilters });
      console.log("Filtered clients data:", response.data);

      setClients(response.data.clients); // Replace clients with filtered results
      setFilters(newFilters);
      toast.success("Filtros aplicados correctamente");
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error(
        error.response
          ? `Error applying filters: ${error.response.data.message || error.response.statusText}`
          : "Failed to apply filters. Please try again later."
      );
    }
  };

  return (
    <motion.main initial="hidden" animate="visible" exit="hidden" variants={pageTransition} className="w-full h-full flex flex-row relative">
      <section className="flex flex-col md:p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5">
        <MetricsSection totalClients={loading ? "Cargando..." : clients.length} />

        <FiltersSection onApplyFilters={handleApplyFilters} filteredClients={clients} />

        <ClientTable clients={clients} />
      </section>
    </motion.main>
  );
};
