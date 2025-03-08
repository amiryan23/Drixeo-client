import s from './EmojiContent.module.scss';
import { useEffect, useRef, useState , useContext  } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MyContext } from './../../../context/Context'
import DrixeoStar from './../../../helpers/drixeoStar'
import axios from "axios";
import ViewEmojiModal from './ViewEmoji/ViewEmojiModal'

import joy from './../../../assets/emoji/joy.json';
import loudlyCrying from './../../../assets/emoji/loudlyCrying.json';
import melting from './../../../assets/emoji/melting.json';
import rage from './../../../assets/emoji/rage.json';
import sad from './../../../assets/emoji/sad.json';
import sleep from './../../../assets/emoji/sleep.json';
import cowboy from './../../../assets/emoji/cowboy.json';
import skull from './../../../assets/emoji/skull.json';
import clown from './../../../assets/emoji/clown.json';
import alien from './../../../assets/emoji/alien.json';
import flyings from './../../../assets/emoji/flyings.json';
import dinosaur from './../../../assets/emoji/dinosaur.json';
import shark from './../../../assets/emoji/shark.json';


const EmojiContent = ({ socket , roomId }) => {

  const [stickers, setStickers] = useState([]);
  const [lastIcon, setLastIcon] = useState(null);
  const [openViewModal,setOpenViewModal] = useState(false)
  const [thisSticker,setThisSticker] = useState(null)

  const playerRef = useRef(null);
  const timerRef = useRef(null);



  const stickersArray = [
  	{name:"joy" , file: joy},
  	{name:"loudlyCrying", file:loudlyCrying},
  	{name:"melting", file:melting},
  	{name:"rage",file:rage},
  	{name:"sad",file:sad},
  	{name:"sleep",file:sleep},
  	{name:"cowboy",file:cowboy},
  	{name:"skull",file:skull},
  	{name:"clown",file:clown},
  	{name:"alien",file:alien},
  	{name:"flyings",file:flyings},
  	{name:"dinosaur",file:dinosaur},
  	{name:"shark",file:shark}

]

   const {  thisUser,setThisUser  } = useContext(MyContext);

   const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id
   const token = sessionStorage.getItem('__authToken');


  const thisUserFirstName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name
  const thisUserPhotoUrl = window.Telegram.WebApp.initDataUnsafe?.user?.photo_url

useEffect(() => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/stickers/user/${thisUserId}`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
    .then((response) => setStickers(response.data))
    .catch((error) => console.error("Ошибка загрузки стикеров:", error));
}, [thisUserId]);


  const sendEmoji = (emoji) => {
    socket.emit('send_emoji', { emoji, roomId, sender: { name:thisUserFirstName,photo_url:thisUserPhotoUrl } , id: thisUser?.id});
    setLastIcon({emoji:emoji,sender:{ name:"You",photo_url:thisUserPhotoUrl }})
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
    socket.on('receive_emoji', ({ emoji , sender , id }) => {
    	if(id !== thisUser?.id) {
      setLastIcon({emoji:emoji,sender:{name:sender.name , photo_url:sender.photo_url}});
 	 }
    });
}

    return () => {
    	if(socket){
      socket.off('receive_emoji');
  }
    };

  }, [socket]);

  const stickerPack = stickers 
  ? stickers.map(sticker => sticker.price === 0 || sticker.is_buyed === 1
  	? <div key={sticker.id} onClick={() =>{
           sendEmoji(stickersArray.find(s=> sticker?.name === s.name).file)
           window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
       }}>
            <Lottie animationData={stickersArray.find(s=> sticker?.name === s.name).file} autoplay={false} style={{ width: '23px', height: '23px' }} />
          </div>
    : <div className={s.closedSticker} key={sticker.id} onClick={()=>{
    	setOpenViewModal(true)
    	setThisSticker({id:sticker.id,file:stickersArray.find(s=> sticker?.name === s.name).file,price:sticker.price})}
    }>
    	<Lottie animationData={stickersArray.find(s=> sticker?.name === s.name).file} autoplay={false} style={{ width: '23px', height: '23px' , opacity:"0.4" }} />
    	<span className={s.priceCont}><DrixeoStar/>{sticker?.price}</span>
    </div>
          )
  : "Loading..."

  return (
    <>
      <div className={lastIcon ?`${s.activeContent} ${s.EmojiContent}` : s.EmojiContent}>
        <div className={s.emojiMiniContent}>
        {stickers && stickerPack}
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
            <Lottie ref={playerRef} animationData={lastIcon !== null && lastIcon?.emoji}  style={{ width: '80px', height: '80px' }} />
            <span className={s.sender}>
            <img src={lastIcon !== null && lastIcon?.sender?.photo_url} alt="" />
            {lastIcon !== null && lastIcon?.sender?.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <ViewEmojiModal openViewModal={openViewModal} setOpenViewModal={setOpenViewModal} thisSticker={thisSticker} setThisSticker={setThisSticker} thisUser={thisUser} setThisUser={setThisUser} stickers={stickers} setStickers={setStickers} />
    </>
  );
};

export default EmojiContent;