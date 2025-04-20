import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { gql, useLazyQuery } from '@apollo/client';
import { TableLoadingProgress } from '../atoms';
import { formatDate } from '../utils';

import PATHNAMES from '../pathnames';

const SEARCH_EVENTS = gql`
  query SearchEvents($query: String!) {
    searchEvents(query: $query) {
      id
      name
      location
      organizer
      date
      published
    }
  }
`;

const useEventSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEvents, { loading, data }] = useLazyQuery(SEARCH_EVENTS);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchEvents({ variables: { query } });
    }
  };

  return { searchQuery, handleSearch, loading, data };
};

export const SearchBox = ({ t }) => {
  const { searchQuery, handleSearch, loading, data } = useEventSearch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="flex h-full">
      <div className="flex h-full items-center rounded-full bg-blue-50 text-zinc-700 dark:bg-zinc-800 dark:text-white xl:w-[225px] px-3">
        <p className="pl-3 pr-2 text-xl"></p>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            handleSearch(e.target.value);
            setIsOpen(true); // Open dropdown when typing
          }}
          className="h-full w-full bg-blue-50 text-sm font-medium text-zinc-700 focus:outline-none placeholder:!text-gray-400 dark:bg-zinc-800 dark:text-white dark:placeholder:!text-white rounded-full"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && data?.searchEvents?.length > 0 && (
        <div className="absolute top-16 md:top-20 md:-left-20 z-50 w-[360px] sm:w-[460px] flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-zinc-700 dark:text-white dark:shadow-none transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-zinc-700 dark:text-white">
              {t('Molecules.SearchBox.SearchResults')}
            </p>
            <p
              className="text-sm font-bold text-zinc-700 dark:text-white cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineClose />
            </p>
          </div>

          {data.searchEvents.map((event) => (
            <button
              key={event.id}
              className="flex w-full items-center p-2 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-md cursor-pointer"
              onClick={() => {
                navigate(PATHNAMES.getEventDetail(event.id));
                setIsOpen(false); // Close dropdown on click
              }}
            >
              <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                  {event.name}
                </p>
                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                  {event.location} |{' '}
                  {formatDate(new Date(parseInt(event.date, 10)))}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute top-16 md:top-20 md:-left-20 z-50 w-[360px] sm:w-[460px] flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-zinc-700 dark:text-white dark:shadow-none transition-all duration-300 ease-in-out text-center">
          <TableLoadingProgress />
        </div>
      )}
    </div>
  );
};
