import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchImages } from '../services/fetch';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchHandler = () => {
      setIsLoading(true);
      fetchImages(searchQuery, page)
        .then(result => {
          if (result.hits.length === 0) {
            setSearchResult([]);
            setPage(1);
            return toast(
              `There are no images by search request "${searchQuery}"`,
              { theme: 'dark' }
            );
          }

          const images = result.hits(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              tags,
              webformatURL,
              largeImageURL,
            })
          );
          setSearchResult(prevSearchResult => [...prevSearchResult, ...images]);
        })
        .catch(error => {
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchHandler();
  }, [searchQuery, page]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  const onLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleFormSubmit = searchQuery => {
    if (searchQuery === '') {
      return toast('Please type a search query');
    }
    setSearchQuery(searchQuery);
    setPage(1);
    setSearchResult([]);
  };

  return (
    <div className="app">
      <Searchbar onSubmit={handleFormSubmit} />
      {searchResult.length > 0 && <ImageGallery searchResult={searchResult} />}
      {isLoading && <Loader />}
      {searchResult.length && !isLoading && (
        <Button onClick={onLoadMoreClick} />
      )}
      <ToastContainer theme="dark" />
    </div>
  );
};
