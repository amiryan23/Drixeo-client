import s from './ExitModal.module.scss'
import { motion,AnimatePresence} from 'framer-motion';


const ExitModal = ({exitModal,setExitModal,t}) => {
	return (
      <AnimatePresence>
      {exitModal && <motion.div className={s.exitModalContainer} key="box" exit={{ opacity: 0 }}>
        <motion.div className={s.exitModalContent} 
        initial={{ opacity: 0}}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}>
          <span className={s.item1}>{t("Are you going to leave the room?")}</span>
          <span className={s.item2}>
          <button className={s.btn1} onClick={()=>{window.location.href = "/"}}>{t("Yes")}</button>
          <button className={s.btn2} onClick={()=>{setExitModal(false)}}>{t("No")}</button>
          </span>
        </motion.div>
      </motion.div>}
      </AnimatePresence>
		)
}

export default ExitModal