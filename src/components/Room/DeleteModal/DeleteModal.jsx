import s from './DeleteModal.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios'
import {useState} from 'react'
import { Oval } from 'react-loader-spinner'

const DeleteModal = ({roomData,deleteModal,setDeleteModal,roomId,userId}) => {

	const [loading,setLoading] = useState(false)

	 const { t } = useTranslation();

	 const token = sessionStorage.getItem('__authToken');

	 const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id


const handleDeleteVideo = async () => {
  if (!roomData.videoLink) return;
  setLoading(true)
  const filename = roomData.videoLink;

  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
   	window.location.href = "/"
   	setLoading(false)
  } catch (error) {
  	setLoading(false)
    console.error("Ошибка при удалении видео:", error);
  }
};

  const closeRoom = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/rooms/close`, {
     roomId, 
     userId:thisUserId 
   },
   {
   	 headers: {
      'Authorization': `Bearer ${token}`
   }
  	});
    if (response.data.success) {
      if(roomData?.videoLink?.startsWith("http") && roomData?.videoLink?.includes(process.env.REACT_APP_API_URL)){
      	handleDeleteVideo()
      } else {
      window.location.href = "/"
    }
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Произошла ошибка.");
  }
};

	return (
		<AnimatePresence>
		{deleteModal && <motion.div 
		className={s.megaContainer} 
		key="modalDelete" exit={{ opacity: 0 }}>
			<motion.div className={s.Container}
			initial={{ opacity: 0}}
      		animate={{ opacity: 1 }}
     	    transition={{ duration: 0.7 }}>
				<div className={s.content1}>{t("Are you going to delete this room?")}<br/><span> {t("After deletion, this room will no longer be accessible")}</span></div>
				<div className={s.content2}>
					<button className={s.delBtn} diasbled={loading && true} onClick={closeRoom}>
					{!loading ? t("Delete") : <Oval visible={true} height="15"  width="15"  color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />}
					</button>
					<button className={s.noBtn} onClick={()=>{setDeleteModal(false)}}>{t("No")}</button>
				</div>
			</motion.div>
		</motion.div>}
		</AnimatePresence>
		)
}

export default DeleteModal