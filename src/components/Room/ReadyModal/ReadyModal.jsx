import s from './ReadyModal.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import { Oval } from 'react-loader-spinner'

const ReadyModal = ({isReady,handleReadyClick,readyVideo,t}) => {
	return (
    <AnimatePresence>
    {!isReady && (
    <motion.div className={s.modalContainer} key="box" exit={{ opacity: 0 }}>
      <motion.div className={s.modalContent} 
              initial={{ opacity: 0 ,x: -50}}
              animate={{ opacity: 1 ,x: 0 }}
              transition={{ duration: 0.2 }}>
       <span>
       {t("Please wait until the loading is complete")}
        </span>
        <button onClick={handleReadyClick} disabled={(readyVideo < 100) && true}>
        {readyVideo < 100
        ? <Oval
        visible={true}
        height="20"
        width="20"
        color="whitesmoke"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
       /> 
        : t("I'm ready")}
        </button>
      </motion.div>
    </motion.div> )}
    </AnimatePresence>
		)
}

export default ReadyModal