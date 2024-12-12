"use client";

import { useState } from "react";
import { Facebook, Instagram, Twitter, Menu, Star, Gift, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

import { motion } from "framer-motion";
import { Alert } from "@mui/material";
import { useOutletContext } from "react-router-dom";

const promotions = [
  {
    id: 1,
    title: "¡Aprovecha nuestra promoción de Jueves! 🎉",
    description: "Hoy tienes un 20% de descuento en todos nuestros platos principales.",
    image: "https://juanluisboschgutierrez.com/wp-content/uploads/2020/01/Comida-de-latinoamerica.jpg",
    terms: "Tope $25.000CLP. Una promoción por mesa/grupo. Válido los días jueves.",
    rewardSystem: "Descuento",
    systemType: "discount",
    isHot: true,
  },
  {
    id: 2,
    title: "Fusion Latina te Premia: Acumula Puntos y canjea",
    description: "Acumula puntos y canjea.",
    image:
      "https://www.mycentraljersey.com/gcdn/authoring/authoring-images/2023/08/23/PCNJ/70660467007-mexi-bar-view-3.jpeg?crop=1207,682,x0,y42&width=1207&height=603&format=pjpg&auto=webp",
    terms:
      "Se otorga 1 punto a su FideliCard con una compra mínima de $15.000CLP. Los puntos no son transferibles. Solo se puede canjear una promoción al día.",
    systemType: "points",
    rewardSystem: [
      {
        points: 5,
        title: "Bebida gratis.",
      },
      {
        points: 10,
        title: "50% OFF en pizzas.",
      },
      {
        points: 15,
        title: "Media pizza y bebida gratis.",
      },
    ],
  },
  {
    id: 3,
    title: "Lunes de Locura: ¡2x1 en Cócteles! 🍹",
    description: "Comienza tu semana con el pie derecho. Todos los lunes, disfruta de nuestros cócteles en promoción 2x1.",
    image: "https://cdn7.kiwilimon.com/articuloimagen/30105/28194.jpg",
    terms: "Válido solo los lunes. Máximo 3 promociones por mesa. No acumulable con otras ofertas.",
    rewardSystem: "2x1 en cócteles",
    systemType: "discount",
    isHot: false,
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/nuestrorestaurante" },
  { icon: Instagram, href: "https://instagram.com/nuestrorestaurante" },
  { icon: Twitter, href: "https://twitter.com/nuestrorestaurante" },
];

const menuItems = [
  {
    category: "Entradas",
    items: [
      { name: "Tostones con mojo", price: "7.99" },
      { name: "Ceviche peruano", price: "9.99" },
      { name: "Empanadas de carne", price: "8.49" },
      { name: "Arepitas de queso", price: "6.99" },
      { name: "Guacamole con totopos", price: "5.99" },
    ],
  },
  {
    category: "Platos principales",
    items: [
      { name: "Ropa Vieja", price: "16.99" },
      { name: "Feijoada", price: "17.99" },
      { name: "Asado Argentino", price: "19.99" },
      { name: "Mole Poblano con Pollo", price: "18.99" },
      { name: "Sopa de Mariscos", price: "15.99" },
      { name: "Pabellón Criollo", price: "17.49" },
      { name: "Lomo Saltado", price: "18.49" },
    ],
  },
  {
    category: "Postres",
    items: [
      { name: "Churros con chocolate", price: "6.99" },
      { name: "Tres Leches", price: "7.49" },
      { name: "Dulce de Leche Flan", price: "5.99" },
      { name: "Coconut Flan", price: "6.49" },
      { name: "Helado de Maracuya", price: "5.49" },
    ],
  },
  {
    category: "Bebidas",
    items: [
      { name: "Mojito Cubano", price: "8.99" },
      { name: "Caipirinha", price: "9.49" },
      { name: "Pisco Sour", price: "9.99" },
      { name: "Agua de Jamaica", price: "4.99" },
      { name: "Tinto de Verano", price: "6.49" },
      { name: "Aguardiente", price: "7.99" },
      { name: "Chicha Morada", price: "5.99" },
      { name: "Tequila Sunrise", price: "8.49" },
    ],
  },
];

export function LandingPage() {
  const { onNavigate } = useOutletContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isRegistering, setIsRegistering] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handlePromotionRegister = (promotionId: number) => {
    console.log(`Registrado a la promoción ${promotionId}`);
    setSelectedPromotion(null);
  };

  const isThursday = new Date().getDay() === 4;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-400 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='text-center'>
          <h1 className='text-5xl font-bold text-main'>Fusion Latina</h1>
          <p className='mt-2 text-lg w-full md:w-2/3 justify-center m-auto text-gray-500'>
            ¡Regístrate y empieza a sumar puntos! 🌟 Entérate de nuestras promociones y obtén grandes beneficios 🎉
          </p>
        </motion.div>

        <div className='flex justify-center space-x-4'>
          <Dialog open={showMenu} onOpenChange={setShowMenu}>
            <DialogTrigger asChild>
              <Button className='bg-main hover:bg-blue-700 duration-700 text-white font-bold'>Ver nuestra carta</Button>
            </DialogTrigger>
            <DialogContent className='w-full h-[80vh] overflow-y-scroll p-2 px-4 max-w-[90%] bg-white'>
              <DialogHeader>
                <DialogTitle className='mt-12 text-main'>Nuestra Carta</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                {menuItems.map((category, index) => (
                  <div key={index}>
                    <h3 className='text-lg font-semibold mb-2 text-main'>{category.category}</h3>
                    <ul className='space-y-2'>
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className='flex justify-between text-gray-700'>
                          <span>{item.name}</span>
                          <span className='font-semibold'>${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button className='bg-main hover:bg-blue-700 text-white font-bold' onClick={() => onNavigate("/landingpage/fidelicard")}>
            Mi FideliCard
          </Button>
        </div>
        <Card className='bg-white'>
          <CardContent className='p-6'>
            {isRegistering ? (
              <form onSubmit={handleRegister} className='space-y-4'>
                <h2 className='text-xl font-semibold text-main'>Regístrate</h2>
                <Input
                  type='email'
                  placeholder='Tu correo electrónico'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='border-gray-300'
                />
                <Input
                  type='text'
                  placeholder='Tu número de teléfono'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className='border-gray-300'
                />
                <Button type='submit' className='w-full bg-main hover:bg-blue-700 text-white font-bold'>
                  Regístrate
                </Button>
                <p className='text-sm text-gray-600 text-center mt-2'>
                  ¿Ya estás registrado?{" "}
                  <span onClick={() => setIsRegistering(false)} className='text-main cursor-pointer hover:underline'>
                    Iniciar sesión
                  </span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className='space-y-4'>
                <h2 className='text-xl font-semibold text-main'>Inicia sesión</h2>
                <Input
                  type='email'
                  placeholder='Tu correo electrónico'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='border-gray-300'
                />
                <Button type='submit' className='w-full bg-main hover:bg-blue-700 text-white font-bold'>
                  Iniciar sesión
                </Button>
                <p className='text-sm text-gray-600 text-center mt-2'>
                  ¿No tienes cuenta?{" "}
                  <span onClick={() => setIsRegistering(true)} className='text-main cursor-pointer hover:underline'>
                    Regístrate
                  </span>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
        <div>
          <h2 className='text-2xl font-bold text-main mb-4 text-center'>Nuestras Promociones Activas</h2>
          {isThursday && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className='bg-yellow-100 p-4 rounded-lg mb-4 text-center'
            >
              <h3 className='text-xl font-bold text-yellow-800'>¡Aprovecha nuestra promoción de Jueves! 🎉</h3>
              <p className='text-yellow-700'>Hoy tienes un 20% de descuento en todos nuestros platos principales.</p>
            </motion.div>
          )}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {promotions.map((promo, index) => (
              <Dialog key={promo.id}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className='bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative overflow-hidden h-full'>
                      <CardContent
                        className={`${
                          index === 0 ? "border-4 border-transparent bg-clip-border shadow-fire" : ""
                        } p-6 bg-gradient-to-br from-main to-main/80 text-white rounded-lg h-full flex flex-col justify-between`}
                      >
                        {index === 0 && <span className='absolute top-0 right-0 py-1 px-3 text-sm bg-red-600 text-white rounded-full font-bold'>Hot</span>}
                        <h2 className='text-xl font-semibold'>{promo.title}</h2>
                        <p className='mt-2'>{promo.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className='bg-white w-[95%]'>
                  <DialogHeader className='mt-16'>
                    <DialogTitle className='text-main text-2xl'>{promo.title}</DialogTitle>
                    <DialogDescription className='text-gray-600'>{promo.description}</DialogDescription>
                  </DialogHeader>
                  <div className='mt-4 space-y-4'>
                    <img src={promo.image} alt={promo.title} className='w-full rounded-lg' />
                    <Alert severity='info' className='text-sm text-gray-600'>
                      {promo.terms}
                    </Alert>

                    {promo.systemType === "points" ? (
                      <div>
                        <p className='font-bold text-main'>Recompensas:</p>
                        <ul className='list-inside list-disc space-y-1'>
                          {promo.rewardSystem.map((reward, index) => (
                            <li key={index} className='text-sm text-gray-600'>
                              <span className='font-semibold'>{reward.points} puntos:</span> {reward.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className='font-bold text-main'>Recompensas: {promo.rewardSystem}</p>
                    )}
                  </div>
                  <DialogFooter>
                    {isLoggedIn ? (
                      <Button onClick={() => handlePromotionRegister(promo.id)} className='bg-main hover:bg-blue-700 text-white font-bold'>
                        Registrarme a esta promoción
                      </Button>
                    ) : (
                      <Alert color='success' className='bg-gray-200'>
                        ¡<span className='font-bold'>Registrate</span> para empezar a sumar puntos y canjear promociones!
                      </Alert>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        <div className='flex flex-col justify-center '>
          <div className='m-auto mb-6'>
            {" "}
            <img src='https://res.cloudinary.com/di92lsbym/image/upload/v1733535098/1-removebg-preview_qz4dzl.png' className='w-32 h-32' />
          </div>

          <div className='flex flex-row space-x-4 m-auto '>
            {" "}
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} target='_blank' rel='noopener noreferrer' className='text-main hover:text-blue-800'>
                <link.icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <footer className='mt-8 text-center text-gray-500'>
        <p>&copy; {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
