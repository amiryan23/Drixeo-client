import s from './SettingsModal.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import { MyContext } from './../../../context/Context'
import React,{useState,useEffect,useContext } from 'react'
import { RiVipCrownFill } from "react-icons/ri";
import Sparkle from 'react-sparkle'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { IoLockClosed } from "react-icons/io5";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import UserLevelInfo from './../../Room/UserLevelInfo/UserLevelInfo'
import { Oval } from 'react-loader-spinner'

const SettingsModal = ({openSettingsModal,setOpenSettingsModal,toast}) => {

	const {  thisUser } = useContext(MyContext);

	const [colorName,setColorName] = useState("#5F9EA0")
	const [bgColor,setBgColor] = useState( "#444")
	const [sparkle,setSparkle] = useState( false)
	const [profileBgColor,setProfileBgColor] = useState('transparent')
	const [profileSparkle,setProfileSparkle] = useState(false)
	const [active,setActive] = useState("chat")
	const [settingsPremium,setSettingsPremium] = useState(true)
	const [loading,setLoading] = useState(false)

	const token = sessionStorage.getItem('__authToken');

	const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id


	useEffect(()=>{
		if(thisUser && thisUser?.custom_settings){
			setColorName(thisUser?.custom_settings?.nameColor || "#5F9EA0")
			setBgColor(thisUser?.custom_settings?.bgColorMsg || "#444")
			setSparkle(thisUser?.custom_settings?.chatSparkle || false)
			setProfileBgColor(thisUser?.custom_settings?.profileBg || 'transparent')
			setProfileSparkle(thisUser?.custom_settings?.profileSparkle || false)
		}
	},[thisUser])

	const { t } = useTranslation();

const updateCustomSettings = async () => {
	setLoading(true)
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/${thisUserId}/custom-settings`, {
      chatSparkle:sparkle,
      bgColorMsg:bgColor,
      nameColor:colorName,
      profileBg:profileBgColor,
      profileSparkle:profileSparkle,
    },
    {
   	 headers: {
      'Authorization': `Bearer ${token}`
  		}
  	}
   );
    console.log('Настройки успешно обновлены:', response.data);
    setOpenSettingsModal(false);
    toast.success(t("New settings successfully saved"))
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    setLoading(false)
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    setLoading(false)
  }
};


const chatBgColor1 = "linear-gradient(180deg, rgba(84,57,113,0.5) 0%, rgba(231,173,82,0.5) 100%)"
const chatBgColor2 = "linear-gradient(180deg, rgba(84,57,113,0.5) 0%, rgba(187,74,148,0.5) 100%)"
const chatBgColor3 = "linear-gradient(180deg, rgba(84,57,113,0.5) 0%, rgba(82,230,231,0.5) 100%)"
const chatBgColor4 = "linear-gradient(180deg, rgba(84,57,113,0.5) 0%, rgba(28,69,246,0.5) 100%)"


const profileBg1 = "radial-gradient(circle, rgba(26,113,157,1) 13%, rgba(47,186,207,1) 100%)"
const profileBg2 = "radial-gradient(circle, rgba(26,113,157,1) 13%, rgba(129,47,207,1) 100%)"

	return (
		<AnimatePresence>
		{openSettingsModal && <motion.div className={s.megaContainer} key="modalCont" exit={{ opacity: 0 }} >
			<motion.div className={s.megaContent}
			key="chat"
			initial={{ opacity: 0 , y: 50}}
      		animate={{ opacity: 1 , y:0}}
      		exit={{ opacity: 0, y: 50 }}
      		transition={{ duration: 0.3 }}>
				<div className={s.levelInfoContent}><UserLevelInfo settingsPremium={settingsPremium} t={t} setSettingsPremium={setSettingsPremium}/></div>
				<div className={s.content2}>
					<span className={active === "chat" ? `${s.active} ${s.item1}` : s.item1} onClick={()=>{setActive("chat")}}>{t("Chat design")}</span>
					<span className={active === "profile" ? `${s.active} ${s.item2}` : s.item2} onClick={()=>{setActive("profile")}}>{t("Profile design")}</span>
				</div>
				<div className={s.megaContent3}>
				{active === "chat"
				? <motion.div className={s.miniContent1}                 
				initial={{ opacity: 0,x:50}}
               	animate={{ opacity: 1,x:0 }}
             	 transition={{ duration: 0.15 }}>
				<div className={s.content3}>
      <span className={s.yourMsgContainer}>
      <span className={s.msgContent2}
      style={{
      background:bgColor
      }}>
      <span className={s.msgItem1}>You{thisUser?.is_premium === 1 && <RiVipCrownFill/>}</span> 
      <span className={s.msgItem2}>Hi, how are you ?</span>
      {sparkle 
       && <Sparkle 
        color={'#999'}
        fadeOutSpeed={ 5 }
        flicker={false}
        count={10}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'slow'}
        /> 
       }
      </span>
      </span>      
      <span className={s.msgContainer}>
      <img src={thisUser?.photo_url} alt=""/>
      <span className={s.msgContent2} 
      style={{
      background:bgColor
      }}
      >
      <span className={s.msgItem1} style={{color:colorName}}>{thisUser?.first_name}{thisUser?.is_premium === 1 && <RiVipCrownFill/> }</span> 
      <span className={s.msgItem2}>Hi, I'm great!</span>
      {sparkle 
       && <Sparkle 
        color={'#999'}
        fadeOutSpeed={ 5 }
        flicker={false}
        count={10}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'slow'}
        /> 
       }
      </span>
      </span>					
				</div>
				<div className={s.content4}>
					<span className={s.item1}>{t("Name Color")}</span>
					<span className={s.item2}>
						<span className={colorName === '#5F9EA0' ? `${s.activeColorName} ${s.colorName}` : s.colorName} style={{backgroundColor:'#5F9EA0'}}
						onClick={()=>{setColorName("#5F9EA0")}}></span>
						<span className={colorName === '#ff6700' ? `${s.activeColorName} ${s.colorName}` : s.colorName} style={{backgroundColor:'#ff6700'}}
						onClick={()=>{setColorName("#ff6700")}}></span>
						<span className={colorName === '#f54984' ? `${s.activeColorName} ${s.colorName}` : s.colorName} style={{backgroundColor:'#f54984'}}
						onClick={()=>{setColorName("#f54984")}}></span>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 1`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 100}>
						<span className={colorName === '#ccff00' ? `${s.activeColorName} ${s.colorName}` : s.colorName} style={{backgroundColor:'#ccff00'}}
						onClick={()=>{
							if(thisUser?.exp >= 100){
							 setColorName("#ccff00")
							}
						}}>{thisUser?.exp < 100 && <IoLockClosed/>}</span>
						</Tippy>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 4`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 1000}>
						<span className={colorName === '#00FF9C' ? `${s.activeColorName} ${s.colorName}` : s.colorName} style={{backgroundColor:'#00FF9C'}}
						onClick={()=>{
							if(thisUser?.exp >= 1000){
							 setColorName("#00FF9C")
							}						
						}}>{thisUser?.exp < 1000 && <IoLockClosed/>}</span>
						</Tippy>
					</span>
				</div>
				<div className={s.content5}>
					<span className={s.item1}>{t("Background Color")}</span>
					<span className={s.item2}>
						<span className={bgColor === '#444' ? `${s.activeBgColor} ${s.colorName}` : s.colorName} style={{backgroundColor:'#444'}}
						onClick={()=>{setBgColor("#444")}}></span>
						<span className={bgColor === 'rgba(5, 18, 36,0.5)' ? `${s.activeBgColor} ${s.colorName}` : s.colorName} style={{backgroundColor:'rgba(5, 18, 36,0.5)'}}
						onClick={()=>{setBgColor("rgba(5, 18, 36,0.5)")}}></span>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 1`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 100}>
						<span className={bgColor === chatBgColor1 ? `${s.activeBgColor} ${s.colorName}` : s.colorName} style={{background:chatBgColor1}}
						onClick={()=>{
							if(thisUser?.exp >= 100){
							 setBgColor(chatBgColor1)
							} 
						}}>{thisUser?.exp < 100 && <IoLockClosed/>}</span>
						</Tippy>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 2`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 300}>
						<span className={bgColor === chatBgColor2 ? `${s.activeBgColor} ${s.colorName}` : s.colorName} style={{background:chatBgColor2}}
						onClick={()=>{
							if(thisUser?.exp >= 300){
							 setBgColor(chatBgColor2)
							}
						}}>{thisUser?.exp < 300 && <IoLockClosed/>}</span>
						</Tippy>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 3`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 600}>
						<span className={bgColor === chatBgColor3 ? `${s.activeBgColor} ${s.colorName}` : s.colorName} style={{background:chatBgColor3}}
						onClick={()=>{
						if(thisUser?.exp >= 600){
							 setBgColor(chatBgColor3)
							} 
						}}>{thisUser?.exp < 600 && <IoLockClosed/>}</span>
						</Tippy>
						<Tippy
						className={s.TippyBox} 
						content={`${t("Will be available from level")} 5`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 2500}>
						<span className={bgColor === chatBgColor4 ? `${s.activeBgColor} ${s.colorName}` : s.colorName} style={{background:chatBgColor4}}
						onClick={()=>{
						if(thisUser?.exp >= 2500){
							 setBgColor(chatBgColor4)
							} 
						}}>{thisUser?.exp < 2500 && <IoLockClosed/>}</span>
						</Tippy>
					</span>
				</div>
				<div className={s.content6}>
					<span className={s.item1}>{t("Sparkle Mode")}</span>
					<span className={s.item2}>
						<label className={s.switch}>
  						<input type="checkbox" checked={sparkle} 
  						onChange={(e)=>{
  							if(thisUser?.exp >= 2500){
  								setSparkle(e.target.checked)
  							}
  						}}/>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 5`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
						placement="bottom"
  					disabled={thisUser?.exp >= 2500}>
 						 <span className={s.slider}></span>
 						 </Tippy>
						</label>
						{thisUser?.exp < 2500 && <IoLockClosed/>}
					</span>
				</div>
				</motion.div>
				: <motion.div className={s.miniContent2}
				key="profile"
				initial={{ opacity: 0,x:-50}}
               	animate={{ opacity: 1,x:0 }}
                transition={{ duration: 0.15 }}>

          <div className={s.userInfoContent1} style={{background:profileBgColor}}>
          <img src={thisUser?.photo_url} alt=""/>
          <span className={s.userName}>
          {thisUser?.first_name}
          {thisUser?.is_premium === 1 && <RiVipCrownFill/>}
          </span>
		 {profileSparkle 
       		&& <Sparkle 
        color={'#999'}
        fadeOutSpeed={ 7 }
        flicker={true}
        count={200}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'normal'}
        	/> 
      	 }
          </div>
				<div className={s.content1}>
					<span className={s.item1}>{t("Background Color")}</span>
					<span className={s.item2}>
						<span className={profileBgColor === 'transparent' ? `${s.activeProfileBgColor} ${s.profileBgColor}` : s.profileBgColor} style={{backgroundColor:'transparent'}}
						onClick={()=>{setProfileBgColor("transparent")}}></span>
						<span className={profileBgColor === '#493b73' ? `${s.activeProfileBgColor} ${s.profileBgColor}` : s.profileBgColor} style={{backgroundColor:'#493b73'}}
						onClick={()=>{setProfileBgColor("#493b73")}}></span>
						<span className={profileBgColor === '#517d72' ? `${s.activeProfileBgColor} ${s.profileBgColor}` : s.profileBgColor} style={{backgroundColor:'#517d72'}}
						onClick={()=>{setProfileBgColor("#517d72")}}></span>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 2`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 300}>
						<span className={profileBgColor === profileBg1 ? `${s.activeProfileBgColor} ${s.profileBgColor}` : s.profileBgColor} style={{background:profileBg1}}
						onClick={()=>{
							if(thisUser?.exp >= 300){
							 setProfileBgColor(profileBg1)
							}
						}}>{thisUser?.exp < 300 && <IoLockClosed/>}</span>
						</Tippy>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 4`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)} 
  					disabled={thisUser?.exp >= 1000}>
						<span className={profileBgColor === profileBg2 ? `${s.activeProfileBgColor} ${s.profileBgColor}` : s.profileBgColor} style={{background:profileBg2}}
						onClick={()=>{
							if(thisUser?.exp >= 1000){
							setProfileBgColor(profileBg2)
							}					
						}}>{thisUser?.exp < 1000 && <IoLockClosed/>}</span>
						</Tippy>
					</span>
				</div>
				<div className={s.content3}>
					<span className={s.item1}>{t("Sparkle Mode")}</span>
					<span className={s.item2}>
						<label className={s.switch}>
  						<input type="checkbox" checked={profileSparkle} 
  						onChange={(e)=>{
  							if(thisUser?.exp >= 2500){
  								setProfileSparkle(e.target.checked)
  							}
  						}}/>
						<Tippy 
						className={s.TippyBox}
						content={`${t("Will be available from level")} 5`} 
						delay={500} trigger="click"
						onShow={(instance) => setTimeout(() => instance.hide(), 1500)}
						placement="bottom" 
  					disabled={thisUser?.exp >= 2500}>
 						 <span className={s.slider}></span>
 						</Tippy>
						</label>
						{thisUser?.exp < 2500 && <IoLockClosed/>}
					</span>
				</div>

				</motion.div> }
				</div>
				<div className={s.content7}>
				{thisUser?.is_premium !== 1 
					? <button className={s.disabledBtn} onClick={()=>{
						toast.info(t('You are not a premium user'),{ 
         		icon:<RiVipCrownFill size="25" color="#999"/> 
         	}) 
					}}>{t("Save")}</button>
					: <button className={s.saveBtn} disabled={loading && true} onClick={updateCustomSettings}>
					{loading 
					? 	
					<Oval
  			visible={true}
  			height="20"
  			width="20"
  			color="whitesmoke"
  			ariaLabel="oval-loading"
 			  wrapperStyle={{}}
  			wrapperClass=""
 			 		/>
					: t("Save")}</button>}
					<button className={s.closeBtn} onClick={()=>{setOpenSettingsModal(false)}}>{t("Close")}</button>
				</div>
			</motion.div>
		</motion.div>}
		</AnimatePresence>
		)
}

export default SettingsModal