import s from './YouTubeSearch.module.scss'
import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import { motion,AnimatePresence} from 'framer-motion';
import { LiaWindowCloseSolid } from "react-icons/lia";
import { Oval } from 'react-loader-spinner'
import { FaSearch } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


const YouTubeSearch = ({openSearchModal,setOpenSearchModal,setIsDisabled,isRoom,handleVideoIdChange,newVideoId,setNewVideoId}) => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
  if (newVideoId && openSearchModal) {

    handleVideoIdChange();
  }
}, [newVideoId,openSearchModal]); 

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search`, {
        params: { query }
      });
      setVideos(response.data); 
      console.log(response.data)
    } catch (error) {
      console.error('Ошибка при поиске на YouTube:', error);
    } finally {
      setLoading(false);
      setQuery('')
    }
  };



  const closeTimer = useRef(null)

  const handleVideoClick = (videoId) => {
    clearTimeout(closeTimer.current)
    if(!isRoom){
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    sessionStorage.setItem('__YoutubeLinkVideo', videoUrl); 
    setOpenSearchModal(false)
    setIsDisabled(false)
  } else {
    setNewVideoId((prevNewVideoId)=>`https://www.youtube.com/watch?v=${videoId}`)
    closeTimer.current = setTimeout(()=>{setOpenSearchModal(false)},700)

  }
  };

  return (
    <AnimatePresence>
    {openSearchModal && 
    <motion.div className={s.megaContainer}
    key="modalSearch" exit={{ opacity: 0 }}>
    <motion.div className={s.Container}
    initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}>
      <div className={s.content1}>
      <span className={s.item1}></span>
      <span className={s.item2}>{t("Search on YouTube")}</span>
      <span className={s.item1} onClick={()=>{setOpenSearchModal(false)}}><LiaWindowCloseSolid/></span>
      </div>
      <div className={s.content2}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`${t("Search")}...`}
        className={s.searchInput}
      />
      <button onClick={handleSearch} disabled={loading} className={s.searchBtn}>
        {loading ?      
        <Oval
        visible={true}
        height="10"
        width="10"
        color="whitesmoke"
        ariaLabel="oval-loading"
      wrapperStyle={{}}
        wrapperClass=""
       /> : t('Search')}
      </button>
      </div>
      {!videos && 
      <span className={s.searchItems}>
      <FaSearch/>
      <span className={s.infoSearch}>
 <>{t(`Enter the video title in the search field and click 'Search'`)}<br/><br/>{t(`After that, click on the video you want to watch`)}</>
      </span>
    </span>}
      {videos?.length > 0 && (
        <div className={s.content3}>
            {videos?.map((video) => (
              <motion.div 
              key={video.id.videoId}
               onClick={() => handleVideoClick(video.id.videoId)} 
               className={s.videoContent}
               exit={{ opacity: 0 }}
               initial={{ opacity: 0}}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.7}}>
              <div className={s.miniContent1}>
                  <img
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                  />
              </div>
                <div className={s.miniContent2}>
                    {video.snippet.title}
                </div>
              </motion.div>
            ))}
        </div>
      )}
      </motion.div>
    </motion.div>}
    </AnimatePresence>
  );
};

export default YouTubeSearch;