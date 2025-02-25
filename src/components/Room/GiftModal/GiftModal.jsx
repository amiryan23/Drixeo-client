import s from './GiftModal.module.scss'
import React,{useState,useEffect,useContext } from 'react'
import { MyContext } from './../../../context/Context'
import { motion,AnimatePresence} from 'framer-motion';
import { LiaWindowCloseSolid } from "react-icons/lia";
import { TiStarFullOutline } from "react-icons/ti";
import axios from 'axios';
import { Oval } from 'react-loader-spinner'
import { useTranslation } from 'react-i18next';
import { FiGift } from "react-icons/fi";
import Sparkle from 'react-sparkle'
import { TbArrowBigUpLinesFilled } from "react-icons/tb";
import {encryptData} from './../../../helpers/decryptData'

const GiftModal = ({openGiftModal,setOpenGiftModal,userPhoto,name,userId,socket,toast,roomId,setScroll}) => {

	const [gifts, setGifts] = useState([]);
	const [thisGift,setThisGift] = useState(null)
	const [loading,setLoading] = useState(false)

const {  thisUser,setUserLevelInfo } = useContext(MyContext);

const { t } = useTranslation();

const token = sessionStorage.getItem('__authToken');
const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

	useEffect(() => {
    if(token){
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/gifts`,{
    
     headers: {
      'Authorization': `Bearer ${token}`
    }
           
      })
      .then((response) => {
        setGifts(response.data); 
        
      })
      .catch((err) => {
        console.error('Ошибка при получении подарков:', err);
      });
    }
  }, []);


const giftList = gifts
  ? gifts
      .sort((a, b) => a.price - b.price) 
      .map(gift => (
        <div className={s.giftContent} key={gift.id}>
          <div className={s.giftMiniContent} onClick={() => setThisGift(gift)}>
            {gift?.premiumGift === 1 && <div className={s.premiumGift}>{t("Premium")}</div>}
            <img src={gift.imgUrl} alt="" />
          </div>
          <div className={s.priceContent}>
          <span className={s.priceItem}>{gift.price} <TiStarFullOutline />
         </span></div>
        </div>
      ))
  : "Loading";
  

	async function sendGift() {
		setLoading(true)
  window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  if(thisUser?.isAdmin === 1){
 socket.emit("sendGiftAdmin", {senderId:thisUserId, receiverId:userId, gift:thisGift, roomId });
          toast(t("Gift successfully sent to the user"),{
            icon:<FiGift size="25" />
          });
          setUserLevelInfo(thisGift?.gift_exp)
          setLoading(false)
          setOpenGiftModal(false)
          setThisGift(null)
          setScroll(true)
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");   
  } else {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/create-gift-invoice`, {
      encryptReceiverId:encryptData(userId,process.env.REACT_APP_SECRET_KEY_CODE),
      giftName:thisGift.name,
      giftPrice:thisGift.price,
    },
    {
     headers: {
      'Authorization': `Bearer ${token}`
    }
    });

    const { invoiceLink } = response.data;

    window.Telegram.WebApp.openInvoice(invoiceLink, async (status) => {
      if (status === "paid") {
      	
        setLoading(false)
        try {
          
        socket.emit("sendGift", {senderId:thisUserId, receiverId:userId, gift:thisGift, roomId });
          toast(t("Gift successfully sent to the user"),{
              icon:<FiGift size="25" />
          });
          setUserLevelInfo(thisGift?.gift_exp)
          setLoading(false)
          setOpenGiftModal(false)
          setThisGift(null)
          setScroll(true)
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
        } catch (error) {
          console.error("Ошибка при добавлении подарка:", error);
          setLoading(false)
        }

      } else if (status === "cancelled") 
      {
        setLoading(false)
        console.log("cancelled");
      } else if (status === "pending") {
        console.log("wait");
      } else if (status === "failed") {
        console.error("failed");
        setLoading(false)
      }
    });
  } catch (error) {
  	setLoading(false)
    console.error("Ошибка при создании счета на оплату подарка:", error);
    alert("Ошибка при отправке подарка.");
  }
}
}

	return (
		<>
		<AnimatePresence>
		{openGiftModal
		&& <motion.div className={s.megaContainer} key="giftModal" exit={{ opacity: 0 }}>
			<motion.div className={s.Container}
			key="gifts"
			initial={{ opacity: 0,y:50}}
      		animate={{ opacity: 1,y:0 }}
          exit={{ opacity: 0,y:50 }}
      		transition={{ duration: 0.3 }}>
			<div className={s.content1}>
			{/* <span></span> */}
			<span className={s.item1}>
			{t("Gift for")}
			<span className={s.miniItem}><img src={userPhoto} alt="" />{name}</span>
			</span>
			<span className={s.item2} onClick={()=>{setOpenGiftModal(false)}}>
			<LiaWindowCloseSolid/>
			</span>
			</div>	
			<div className={s.content2}>
			{giftList}
			</div>
			</motion.div>
		</motion.div>}
		</AnimatePresence>
		<AnimatePresence>
		{thisGift
		&& <motion.div className={s.megaContainer} key="thisGiftModal" exit={{ opacity: 0 }}>
			<motion.div className={s.viewGiftContainer}
			key="giftView"
			initial={{ opacity: 0,y:50}}
      		animate={{ opacity: 1,y:0 }}
          exit={{ opacity: 0,y:50 }}
      		transition={{ duration: 0.3 }}>

      				<div className={s.giftItem1}>
      				<span></span>
      				<span className={s.title}>{t("Gift")} {thisGift?.name}</span>
      				<span onClick={()=>{setThisGift(null)}}><LiaWindowCloseSolid/></span>
      				</div>
              <div className={s.miniContent}>
      				{thisGift?.premiumGift === 1 && <div className={s.premiumGift}>{t("Premium")}</div>}
              <div className={s.giftExp}>{`+${thisGift?.gift_exp} exp`}<TbArrowBigUpLinesFilled size="15" color="yellowgreen"/></div>
              </div>
      				<img src={thisGift?.imgUrl} className={s.giftItem2} />
      				<div className={s.giftItem3}>
              {thisGift?.price} 
              <TiStarFullOutline/>             
              </div>
      				<button className={s.giftItem4} 
      				onClick={()=>{
      					if(thisGift?.premiumGift){
      					thisUser?.is_premium ? sendGift() : toast.info(t('You are not a premium user'))
      				} else {
      					sendGift()
      				}
      				}} 
      				disabled={loading && true}>
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
      				: t("Send gift")}</button>
			</motion.div>
		</motion.div>}
		</AnimatePresence>
		</>
		)
}


export default GiftModal