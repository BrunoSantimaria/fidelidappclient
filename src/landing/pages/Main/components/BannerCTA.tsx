import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigateTo } from "@/hooks/useNavigateTo";
import { FadeIn } from "@/landing/components/animations/FadeIn";
import api from "@/utils/api";

export const BannerCTA = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleNavigate } = useNavigateTo();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await api.post("/auth/contact", {
                name: data.name,
                email: data.email,
                phone: data.phone,
            });

            toast.success("¡Formulario enviado con éxito!");

            // GTAG event tracking
            window.gtag("event", "gtm.formSubmit", {
                event_category: "Contact",
                event_label: "Contact Form Submission",
                value: 1,
            });

            reset();
            handleNavigate("/thankyou");
        } catch (error) {
            toast.error("Hubo un error al enviar el formulario.");
        } finally {
            setTimeout(() => setIsSubmitting(false), 2000);
        }
    };

    return (
        <FadeIn delay={0.5}>

            <div className="relative overflow-hidden">
                <div className="relative bg-white px-6 py-6 ">
                    <div className="max-w-6xl mx-auto text-center m-10">
                        <h3 className="text-2xl font-bold text-[#5b7898] mb-3">¿Listo para impulsar tu negocio?</h3>
                        <p className="text-lg text-[#5b7898] mb-4">
                            Déjanos tus datos y un experto de Fidelidapp se pondrá en contacto contigo.
                        </p>

                        {/* Formulario compacto en una fila en desktop */}
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-center gap-4">
                            <input
                                type="text"
                                {...register("name", { required: "El nombre es obligatorio" })}
                                placeholder="Nombre"
                                className="px-4 py-2 w-full md:w-1/4 rounded-md border border-gray-300 focus:ring-2 focus:ring-main text-gray-900 bg-white"
                            />
                            <input
                                type="email"
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                                placeholder="Correo electrónico"
                                className="px-4 py-2 w-full md:w-1/4 rounded-md border border-gray-300 focus:ring-2 focus:ring-main text-gray-900 bg-white"
                            />
                            <input
                                type="tel"
                                {...register("phone", { required: "El teléfono es obligatorio" })}
                                placeholder="Teléfono"
                                className="px-4 py-2 w-full md:w-1/4 rounded-md border border-gray-300 focus:ring-2 focus:ring-main text-gray-900 bg-white"
                            />

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isSubmitting}
                                className={`px-6 py-2 w-full md:w-auto border border-transparent text-white font-medium rounded-md text-blue-600 bg-[#5b7898] hover:bg-blue-50 transition-colors duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isSubmitting ? "Enviando..." : "Enviar"}
                            </motion.button>
                        </form>

                    </div>
                </div>
            </div>

        </FadeIn>
    );
};

export default BannerCTA;
