export const extractVideoId = (url) => {
    const regex = /(?:\?v=|\/embed\/|\.be\/|\/v\/|\/e\/|watch\?.*&v=|^https?:\/\/(?:www\.)?youtube\.com\/)([^#&?]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null; 
  };