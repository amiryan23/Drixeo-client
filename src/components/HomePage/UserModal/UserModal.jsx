import s from './UserModal.module.scss'
import React,{useState,useEffect,useContext } from 'react'
import { MyContext } from './../../../context/Context'
import { LiaWindowCloseSolid } from "react-icons/lia";
import { motion,AnimatePresence} from 'framer-motion';
import { RiVipCrownFill } from "react-icons/ri";
import Sparkle from 'react-sparkle'
import { IoMdEyeOff } from "react-icons/io";
import GiftSettings from './GiftSettings/GiftSettings'
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import {calculateLevel,calculateLevelChat} from './../../../helpers/calculateLevel'
import {decryptData} from './../../../helpers/decryptData'
import {getStyleLevel} from './../../../helpers/getMessageStyle' 

const UserModal = ({openUserModal,setOpenUserModal}) => {

	const {  thisUser,setThisUser } = useContext(MyContext);

	const [infoState,setInfoState] = useState("gifts")
  const [openGift,setOpenGift] = useState(null)

  const { t } = useTranslation();

useEffect(() => {

  if(openUserModal){
  const tg = window.Telegram.WebApp

    const userData =  {
      userId: tg?.initDataUnsafe?.user?.id,
      username: tg?.initDataUnsafe?.user?.username,
      first_name: tg?.initDataUnsafe?.user?.first_name,
      last_name: tg?.initDataUnsafe?.user?.last_name,
      photo_url:tg?.initDataUnsafe?.user?.photo_url,
      initData: tg?.initData 

    };

   axios.post(`${process.env.REACT_APP_API_URL}/auth/miniapp`, userData)
      .then(response => {
        const userData = response.data.userData

        const decryptUserData = decryptData(userData,process.env.REACT_APP_SECRET_KEY_CODE)

        const newResponeData = {...decryptUserData,gifts:JSON.parse(decryptUserData?.gifts),custom_settings:JSON.parse(decryptUserData?.custom_settings)}

        setThisUser(newResponeData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
}, [openUserModal]);

const currentLevel = calculateLevel(thisUser?.exp)

	return (
    <>
		<AnimatePresence>
	{openUserModal && <motion.div className={s.userModalContainer} key="box" exit={{ opacity: 0 }}>
        <motion.div className={s.userModalContent} 
        initial={{ opacity: 0 , y:50}}
      animate={{ opacity: 1 , y:0}}
      exit={{ opacity: 0 , y:50 }}
      transition={{ duration: 0.3 }}
      > 
          <div className={s.userInfoContent1} 
          style={{background:(thisUser?.is_premium === 1 && thisUser?.custom_settings?.profileBg) || "transparent"}}>
          <div className={s.exitBtn}>
          <span></span>
          <span onClick={()=>setOpenUserModal(null)}><LiaWindowCloseSolid/></span>
          </div>
          <img src={thisUser?.photo_url} alt=""/>
          <span className={s.userName}>
          {thisUser?.first_name}
          {thisUser?.is_premium === 1 && <RiVipCrownFill/>}
          {currentLevel > 0 
          && <span className={getStyleLevel(currentLevel,s)}>
          <span>
          {calculateLevelChat(thisUser?.exp)} LvL
          </span>
          </span>}
          </span>
       {thisUser?.custom_settings?.profileSparkle
        && thisUser?.is_premium === 1 
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
          <div className={s.userInfoContent2}>
            <div className={s.userInfoItem1}>
              <button className={infoState === "gifts" ? `${s.activeBtn} ${s.giftBtn}` : s.giftBtn} onClick={()=>{setInfoState("gifts")}}>{t("Gifts")}</button>
              <button className={infoState === "stats" ? `${s.activeBtn} ${s.statsBtn}` : s.statsBtn} onClick={()=>{setInfoState("stats")}}>{t("Stats")}</button>
            </div>
            <div className={s.userInfoItem2}>
           
              {infoState === "gifts" 
              ? <motion.div key="gifts" 
                className={s.userGiftContent}
                initial={{ opacity: 0,x:50}}
               animate={{ opacity: 1,x:0 }}
              transition={{ duration: 0.2 }}
              >
              <div className={s.userGiftMiniContent}>
              {thisUser?.gifts !== null && thisUser?.gifts?.filter(gift => gift.is_selled !== true).length !== 0
               ?  thisUser?.gifts.filter(gift => gift.is_selled !== true).map(gift => <motion.div 
                className={gift.hidden ? `${s.hiddenGift} ${s.item2}` : s.item2} 
                key={gift.id}
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                onClick={()=>{setOpenGift(gift)}}>
                 {gift.hidden && <span className={s.miniItem1}><IoMdEyeOff/></span>}
                 <img src={gift.imgUrl} alt="" className={s.miniItem2} />
               </motion.div>)?.reverse()

               : <span className={s.noGifts}>{t("Gifts are unavailable")}</span> }
               </div>
              </motion.div>
              : <motion.div key="stats" 
              
                initial={{ opacity: 0,x:-50}}
               animate={{ opacity: 1,x:0 }}
              transition={{ duration: 0.2 }}>
              Soon</motion.div>
              }
            
            </div>
          </div>

        </motion.div>
      </motion.div>}
      </AnimatePresence>
      
        <GiftSettings openGift={openGift} setOpenGift={setOpenGift}/>
     </>
      
		)
}

export default UserModal