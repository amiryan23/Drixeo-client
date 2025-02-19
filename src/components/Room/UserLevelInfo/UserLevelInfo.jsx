import s from './UserLevelInfo.module.scss'
import React,{useState,useEffect,useContext } from 'react'
import { MyContext } from './../../../context/Context'
import {calculateLevel} from './../../../helpers/calculateLevel'
import { motion,AnimatePresence} from 'framer-motion';
import { TbInfoOctagon } from "react-icons/tb";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";


const UserLevelInfo = ({settingsPremium,setSettingsPremium,t}) => {

	const {  thisUser,setThisUser,userLevelInfo,setUserLevelInfo } = useContext(MyContext);

	const [thisLevel,setThisLevel] = useState(null)
	const [openNotific,setOpenNotific] = useState(false)
	const [nextLevelExp,setNextLevelExp] = useState(null) 

	useEffect(()=>{
		if(settingsPremium){
			setOpenNotific(true)
		}
	},[settingsPremium])



	const finaliyExp = () => {
		if(thisLevel === 0) return 100
		if(thisLevel === 1) return 300
		if(thisLevel === 2) return 600
		if(thisLevel === 3) return 1000
		if(thisLevel === 4) return 2500
		if(thisLevel === 5) return null	
	}

	const expForNextLevel = () => {

		if(thisLevel === 0) return 	thisUser?.exp 
		if(thisLevel === 1) return (thisUser?.exp - 100) * 100 / (300 - 100)
		if(thisLevel === 2) return (thisUser?.exp - 300) * 100 / (600 - 300)
		if(thisLevel === 3) return (thisUser?.exp - 600) * 100  / (1000 - 600)
		if(thisLevel === 4) return (thisUser?.exp - 1000) * 100  / (2500 - 1200)
		if(thisLevel === 5) return 100



	}



	let timer;
	let timer2;

   useEffect(()=>{
   		setThisLevel(calculateLevel(thisUser?.exp))
		setNextLevelExp(expForNextLevel())
   	
   		if(userLevelInfo !== null){
   			setOpenNotific(true)
   			timer = setTimeout(()=>{
   				setOpenNotific(false)
   				setUserLevelInfo(null)
   				setNextLevelExp(null)

   			},4500)

   			timer2 = setTimeout(()=>{
   				setThisUser({...thisUser,exp:thisUser?.exp + userLevelInfo})
   				setThisLevel(calculateLevel(thisUser?.exp))
   				window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
   				
   				
   			},1000)
   		}

   		return () => {
   			clearTimeout(timer)
   			clearTimeout(timer2)
   		}
   },[userLevelInfo])


  

   useEffect(()=>{
   	setNextLevelExp(expForNextLevel())
   	

   },[thisUser,thisLevel])


   let timer3;

   useEffect(()=>{

		timer3 = setTimeout(()=>{setThisLevel(calculateLevel(thisUser?.exp))},500)

		if(nextLevelExp >= 100){
			setNextLevelExp(0)
			setNextLevelExp(expForNextLevel())
		}

   },[nextLevelExp])


	

	return (
		<AnimatePresence>
		{openNotific && <div className={settingsPremium ? `${s.forSettings} ${s.megaContainer} ` : s.megaContainer} >
			<motion.div className={s.infoContainer} key="userLevel" exit={{ opacity: 0,y:-50 }}
			initial={{ opacity: 0,y:-50}}
      		animate={{ opacity: 1,y:0 }}
      		transition={{ duration: 0.5 }}>
      		{!settingsPremium && <div className={s.animatedBorder}>
				<img src={thisUser?.photo_url} alt="" className={s.content1} />
			</div>}
				<div className={s.content2}>
					<span className={s.block1}>
						<Tippy
						className={s.TippyBox}
						content={settingsPremium && t("Your level depends on the points (EXP) you have collected. Points (EXP) can be earned by sending gifts")}
						delay={500} 
						trigger="click"
						placement="bottom"
						onShow={(instance) => setTimeout(() => instance.hide(), 7500)} 
  						disabled={!settingsPremium}>
						<span className={s.item1}>LvL {thisLevel} 
						{settingsPremium && <TbInfoOctagon/> }
						</span>
						</Tippy>
						<span className={s.item2}>
						{thisUser?.exp}{thisLevel >= 5 ? " exp" : `/${finaliyExp()} exp`}
						</span>
					</span>	
					<span className={s.block2}>
						<span className={settingsPremium ? `${s.noAnimate} ${s.miniBlock}` : s.miniBlock} style={{width:`${nextLevelExp}%`}}></span>
					</span>
				</div>
			{!settingsPremium &&	<motion.div
				  initial={{ opacity: 0,scale:0}}
      			  animate={{ opacity: 1,scale:1 }}
      			  transition={{ duration: 0.7 }}
				 className={s.content3}>{`+${userLevelInfo}`}</motion.div>}
			</motion.div>
		</div>}
		</AnimatePresence>
		)
}

export default UserLevelInfo