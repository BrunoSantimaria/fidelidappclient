import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import logo from "../../../assets/LOGO-SIN-FONDO.png";
import { NavigationLink } from "./NavigationLink";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LoyaltyRoundedIcon from "@mui/icons-material/LoyaltyRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import { AddAdmin } from "./AddAdmin";
import { useDashboard } from "../../../hooks";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import TextsmsIcon from "@mui/icons-material/Textsms";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { Divider } from "@mui/material";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

import { useNavigate } from "react-router-dom";
import { PersonStandingIcon } from "lucide-react";
import { DateRangeRounded, Person, StarRounded } from "@mui/icons-material";

const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};
const iconVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

export const Navigation = () => {
  const { startLoggingOut } = useAuthSlice();
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { handleNavigate } = useNavigateTo();
  const containerControls = useAnimationControls();
  const iconControl = useAnimationControls();
  const { plan, metrics } = useDashboard();
  const { user } = useAuthSlice();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      iconControl.start("open");
    } else {
      containerControls.start("close");
      iconControl.start("close");
    }
  }, [isOpen, containerControls]);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleModal = () => setOpenModal(!openModal);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    startLoggingOut();
    handleClose();
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
    handleClose();
  };

  return (
    <>
      {/* Ícono de menú para mobile */}
      <div className='inline-block md:hidden p-4 '>
        <MenuIcon className='text-main w-8 h-8 sticky' onClick={handleOpen} />
      </div>

      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial='close'
        className={`${
          isOpen ? "fixed" : "hidden"
        } md:flex bg-[#5b7898] min-h-screen lg:h-screen md:h-screen flex-col justify-between z-50 p-5 md:fixed lg:fixed top-0 left-0 shadow shadow-neutral`}
      >
        <div className='flex flex-row w-full justify-between place-items-center'>
          <div
            className={`${!isOpen ? "hidden" : ""} ${
              user?.accounts?.logo ? "w-16" : "bg-gradient-to-br from-orange-500 to-amber-700 w-10 h-10"
            } flex rounded-full cursor-pointer`}
            onClick={() => handleNavigate("/dashboard/settings")}
          >
            {user?.accounts?.logo ? (
              <img src={user.accounts.logo} alt='User Logo' className='' />
            ) : (
              <span className='text-center flex m-auto justify-center text-white cursor-pointer'>{user?.name ? user.name.slice(0, 2) : "NN"}</span>
            )}
          </div>
          <motion.button
            variants={iconVariants}
            animate={iconControl}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className='p-2 bg-transparent rounded-full flex duration-300 hover:text-white/60'
            onClick={handleOpen}
          >
            <ArrowForwardRoundedIcon className='text-white w-8 h-8 stroke-neutral-200' />
          </motion.button>
        </div>

        <div className='flex flex-col h-full mt-6 md:mt-3 lg:mt-4 gap-4'>
          <NavigationLink name='Dashboard' link='/dashboard'>
            <SpaceDashboardRoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>

          <NavigationLink name='Reporte' link='/dashboard/report'>
            <AssessmentIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>

          <NavigationLink name='Promociones' link='/dashboard/promotions'>
            <LoyaltyRoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>

          <NavigationLink name='Clientes' link='/dashboard/clients/list'>
            <GroupsRoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>

          <NavigationLink name='Email Marketing' link='/dashboard/email-campaign' isOpen={isOpen}>
            <MailRoundedIcon />
          </NavigationLink>

          <NavigationLink name='Campañas SMS' link='/dashboard/sms-sender' isOpen={isOpen}>
            <TextsmsIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>

          {/*  <div onClick={handleModal}>  <NavigationLink name='Agregar administradores'>
              <PersonAddAlt1RoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>
          </div>*/}

          <NavigationLink name='Evaluaciones' link='/dashboard/waiters'>
            <StarRounded className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>
          <NavigationLink name='Agendas' link='/dashboard/agenda'>
            <DateRangeRounded className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>
        </div>

        <div className='flex flex-col h-full mt-6 md:mt-5 lg:mt-7 gap-4'>
          <Divider className='bg-gray-300/80' />
          <AddAdmin open={openModal} handleClose={handleModal} />
          <NavigationLink name='Ajustes' link='/dashboard/settings'>
            <SettingsRoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>
          <NavigationLink name='Código qr' link='/dashboard/qr/'>
            <QrCode2RoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2' />
          </NavigationLink>
          <div onClick={startLoggingOut}>
            <NavigationLink name='Salir'>
              <LogoutRoundedIcon className='stroke-inherit stroke-[0.75] min-w-2 w-2 ' />
            </NavigationLink>
          </div>
          <div className='flex justify-center items-center'>
            <img src={logo} alt='Logo' className='w-16 mt-11 scale-90 md:scale-150 lg:scale-150 h-auto mb-4' />
          </div>
        </div>
      </motion.nav>
    </>
  );
};
