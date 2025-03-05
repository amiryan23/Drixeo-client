import s from './EmojiContent.module.scss';
import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

import joy from './../../../assets/emoji/joy.json';
import loudlyCrying from './../../../assets/emoji/loudlyCrying.json';


const EmojiContent = ({ socket , roomId }) => {
  const [lastIcon, setLastIcon] = useState(null);
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  const thisUserFirstName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name


  const sendEmoji = (emoji) => {
    socket.emit('send_emoji', { emoji, roomId, sender: thisUserFirstName });
    
  };

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (lastIcon) {
      playerRef.current?.play();
      timerRef.current = setTimeout(() => {
        setLastIcon(null);
      }, 2500);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [lastIcon]);

  useEffect(() => {

  	if(socket){
    socket.on('receive_emoji', ({ emoji , sender }) => {
      setLastIcon({emoji:emoji,sender:sender});
    });
}

    return () => {
    	if(socket){
      socket.off('receive_emoji');
  }
    };

  }, [socket]);

  return (
    <>
      <div className={lastIcon ?`${s.activeContent} ${s.EmojiContent}` : s.EmojiContent}>
        <div className={s.emojiMiniContent}>
          <span onClick={() =>{
           sendEmoji(joy)
           window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
       }}>
            <Lottie animationData={joy} autoplay={false} style={{ width: '23px', height: '23px' }} />
          </span>
          <span onClick={() => { 
          	sendEmoji(loudlyCrying)
          	window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
      }}>
            <Lottie animationData={loudlyCrying} autoplay={false} style={{ width: '23px', height: '23px' }} />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {lastIcon && (
          <motion.div
            key="lastIcon"
            exit={{ opacity: 0, y: -250 }}
            initial={{ opacity: 0, y: -250 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={s.lastEmojiContainer}
          >
            <Lottie ref={playerRef} animationData={lastIcon !== null && lastIcon?.emoji} size={150} style={{ width: '80px', height: '80px' }} />
            <span className={s.senderName}>{lastIcon !== null && lastIcon?.sender}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmojiContent;