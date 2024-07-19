"use client"
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { fetchImages } from '../utils/unsplash';
import modalStyles from './styles/styles';

interface Image {
  id: string;
  urls: {
    small: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    profile_image: {
      small: string;
    };
  };
}

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const newImages = await fetchImages(page);
      setImages(prevImages => [...prevImages, ...newImages]);
      setLoading(false);
    };

    loadImages();
  }, [page]);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 5) { 
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3, 1250: 4 }}>
        <Masonry gutter="10px">
          {images.map(image => (
            <div key={image.id} onClick={() => handleImageClick(image)}>
              <img
                src={image.urls.small}
                alt={image.alt_description || 'Unsplash Image'}
                style={{ width: '100%', cursor: 'pointer', borderRadius: '8px', transition: 'transform 0.3s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {loading && <p>Loading...</p>}
      {selectedImage && (
        <div style={modalStyles.overlay}>
          <div className="relative bg-[#f5f5f5] rounded-lg p-4 max-w-[90%] max-h-[92%]  md:flex-row ">
            <span style={modalStyles.closeButton} onClick={handleCloseModal}>X</span>
            <div style={modalStyles.imageContainer}>
              <img src={selectedImage.urls.full} alt={selectedImage.alt_description || 'Unsplash Image'} style={modalStyles.image} />
            </div>
            <div className="flex-1 flex items-start gap-2 text-black">
              <img src={selectedImage.user.profile_image.small} alt={selectedImage.user.name} className="rounded-[10px] mt-2 w-[50px] items-start" />
              <div className='mt-2'>
                <p className='font-bold'>{selectedImage.user.name}</p>
                <h2>{selectedImage.alt_description}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
