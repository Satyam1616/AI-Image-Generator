import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../assests/default_image.svg';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (inputRef.current.value === "") {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: inputRef.current.value,
            n: 1,
            size: "512x512",
          }),
        }
      );
  
      const data = await response.json();
      if (response.ok && data.data && data.data.length > 0) {
        setImage_url(data.data[0].url);
      } else {
        console.error("No image data returned", data);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };
  

  return (
    <div className='ai-image-generator'>
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === "/" ? default_image : image_url} alt="" />
        </div>
        <div className="loading">
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>Loading....</div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className='search-input'
          placeholder='Describe What You Want To See'
        />
        <div className="generate-btn" onClick={generateImage}>Generate</div>
      </div>
    </div>
  );
}

export default ImageGenerator;
