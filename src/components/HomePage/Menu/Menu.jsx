import s from './Menu.module.scss'
import {Link} from 'react-router-dom'
import { MdGroup } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import {useContext} from 'react'
import { MyContext } from './../../../context/Context'
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import { useEffect, useRef } from 'react';
import homeIcon from './../../../assets/homeIcon.json'
import roomIcon from './../../../assets/roomIcon.json'


const Menu = () => {
	

	const {  activeLink,setActiveLink } = useContext(MyContext);

	const { t } = useTranslation();

	const playerRef = useRef(null);
	const playerRef2 = useRef(null);
  
    useEffect(() => {
        playerRef.current?.play();
        playerRef2.current?.play();
    }, [])



	return (
		<div className={s.megaContainer}>
		<div className={s.container}>
		 <Link 
		 to='/' 
		 className={activeLink === "home" ? `${s.active} ${s.content1}` : s.content1}
		 onClick={()=>{setActiveLink("home")}}
		 > 
        <Lottie ref={playerRef} animationData={homeIcon} loop={0} style={{ width: '25px', height: '25px' }} />
        {t("Home")}</Link>
		 <Link
		  to='/roomlist' 
		  className={activeLink === "roomlist" ? `${s.active} ${s.content2}` : s.content2}
		  onClick={()=>{setActiveLink("roomlist")}}
		  >
        <Lottie ref={playerRef2} animationData={roomIcon} loop={0}  style={{ width: '25px', height: '25px' }} />
        {t("Rooms")}</Link>
		 </div>
		</div>
		)
}

export default Menu