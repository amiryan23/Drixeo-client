import s from './ViewEmojiModal.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import {useEffect,useRef,useState} from 'react'
import DrixeoStar from './../../../../helpers/drixeoStar'
import Lottie from 'lottie-react';
import PointContent from './../../../HomePage/PointContent/PointContent'
import { LiaWindowCloseSolid } from "react-icons/lia";
import { Oval } from 'react-loader-spinner'
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios'

const ViewEmojiModal = ({openViewModal,setOpenViewModal,thisSticker,setThisSticker,thisUser,setThisUser,stickers,setStickers}) => {

	const [loading,setLoading] = useState(false)
	const [isBuyed,setIsBuyed] = useState(false)

	const playerRef = useRef()

const token = sessionStorage.getItem('__authToken');

const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

	useEffect(()=>{
		if(thisSticker && playerRef.current){
			playerRef.current.play()
		}

		return () => {
			setIsBuyed(false)
		}
	},[thisSticker])


const buySticker = async (stickerId) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/stickers/buy/${thisUserId}/${stickerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );

    setLoading(false);
    setThisUser({
      ...thisUser,
      points: thisUser?.points - stickers?.find(sticker => sticker.id === stickerId)?.price
    });

    setStickers(prevStickers =>
      prevStickers.map(sticker =>
        sticker.id === stickerId ? { ...sticker, is_buyed: 1 } : sticker
      )
    );

    setIsBuyed(true);
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success"); 
  } catch (error) {
    setLoading(false);

    console.error(error.response?.data?.message || 'Ошибка при покупке стикера');

  }
};

	return (
<>
		<AnimatePresence>
		{openViewModal
		&& <motion.div className={s.megaContainer} key="giftModal" exit={{ opacity: 0 }}>
			<motion.div className={s.Container}
			key="gifts"
			initial={{ opacity: 0,y:50}}
      		animate={{ opacity: 1,y:0 }}
          exit={{ opacity: 0,y:50 }}
      		transition={{ duration: 0.3 }}>
      		<div className={s.content1}>
      			<PointContent/>
      			<span onClick={()=>{setOpenViewModal(false)}}><LiaWindowCloseSolid/></span>
      		</div>
      		<div className={s.content2}>
      			<Lottie ref={playerRef} animationData={thisSticker.file} autoplay={true} style={{ width: '100px', height: '100px' }} />
      		</div>
      		<div className={s.content3}>
      		{!isBuyed ? 
      			<button  onClick={()=>{buySticker(thisSticker.id)}} disabled={(thisUser?.points < thisSticker.price) || loading && true} className={s.buyBtn}>
      			{loading
      			? <Oval visible={true} height="11" width="11" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""  />
      			: <> Buy 
      			<span className={(thisUser?.points < thisSticker.price) && s.disabled }><DrixeoStar/>{thisSticker.price}</span></>}
      			</button>
      		: <span className={s.buyed}><FaCheckCircle/></span> }
      		</div>
  s
      		</motion.div>
      		</motion.div>}
      		</AnimatePresence>
</>
		)
}


export default ViewEmojiModal