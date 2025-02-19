import s from './Menu.module.scss'
import {Link} from 'react-router-dom'
import { MdGroup } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import {useContext} from 'react'
import { MyContext } from './../../../context/Context'
import { useTranslation } from 'react-i18next';
import { Player } from '@lordicon/react';
import { useEffect, useRef } from 'react';
import homeIcon from './../../../assets/homeIcon.json'
import roomIcon from './../../../assets/roomIcon.json'


const Menu = () => {
	

	const {  activeLink,setActiveLink } = useContext(MyContext);

	const { t } = useTranslation();

	const playerRef = useRef(null);
	const playerRef2 = useRef(null);
  
    useEffect(() => {
        playerRef.current?.playFromBeginning();
        playerRef2.current?.playFromBeginning();
    }, [])



	return (
		<div className={s.megaContainer}>
		<div className={s.container}>
		 <Link 
		 to='/' 
		 className={activeLink === "home" ? `${s.active} ${s.content1}` : s.content1}
		 onClick={()=>{setActiveLink("home")}}
		 >   <Player 
            ref={playerRef} 
            icon={homeIcon}
        />{t("Home")}</Link>
		 <Link
		  to='/roomlist' 
		  className={activeLink === "roomlist" ? `${s.active} ${s.content2}` : s.content2}
		  onClick={()=>{setActiveLink("roomlist")}}
		  > <Player 
            ref={playerRef2} 
            icon={roomIcon}
        />{t("Rooms")}</Link>
		 </div>
		</div>
		)
}

export default Menu