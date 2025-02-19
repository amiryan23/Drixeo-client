import s from './Loader.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import React,{useContext} from 'react'
import { MyContext } from './../../context/Context'
import PropagateLoader from "react-spinners/PropagateLoader";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loader = () => {
	const {  loader } = useContext(MyContext);
	return (
		<AnimatePresence>
		{loader &&
		<motion.div className={s.megaContainer} key="loader" exit={{ opacity: 0 }} >			
			<PropagateLoader color="rgba(178,121,201,0.2)" />
			<motion.div 
			 initial={{ opacity:0.4 , scale: 0.9 }}
        	 animate={{ opacity:1, scale: 1}}
        	 transition={{repeat: Infinity , repeatType: "reverse" , duration: 0.7 }}
        	 className={s.title}>Drixeo [Beta]</motion.div>			
			<PropagateLoader color="rgba(78,141,246,0.2)" />
							<Skeleton
          className={s.skeleton}
          baseColor="rgba(256,256,256,0)"
          highlightColor="rgba(78,141,246,0.1)"
          duration={2}/>
		</motion.div>}
		</AnimatePresence>
		)
}

export default Loader;