import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Modal/Modal';
import css from './ImageGallery.module.css';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';

export const ImageGallery = ({ error, searchResult }) => {
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  const closeModal = () => {
    setShowModal(false);
  };

  const clickHandler = e => {
    if (e.target === e.currentTarget) {
      return;
    }

    const imageURL = e.target.getAttribute('data-url');
    setLargeImageURL(imageURL);
    setShowModal(!showModal);
  };

  return (
    <>
      {error && <h1>{error.message}</h1>}
      <ul className={css.imageGallery} onClick={clickHandler}>
        {searchResult.map(({ id, webformatURL, tags, largeImageURL }) => (
          <ImageGalleryItem
            key={id}
            url={webformatURL}
            title={tags}
            largeImage={largeImageURL}
          />
        ))}
      </ul>
      {showModal && <Modal imageURL={largeImageURL} onClick={closeModal} />}
    </>
  );
};

ImageGallery.propTypes = {
  searchResult: PropTypes.arrayOf(PropTypes.object).isRequired,
};
