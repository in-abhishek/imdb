
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import './App.css';
import _ from 'lodash';
import 'react-loading-skeleton/dist/skeleton.css'

const App = () => {
  const [data, setData] = useState("");
  const [movieName, setMovieName] = useState();
  const [loading, setLoading] = useState(true);
  const [movieLength, setMovieLength] = useState(0);
  const [error, setError] = useState({ show: "false", msg: "" });
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const itemsPerPage = 18;
  const [seledDate, setselectDate] = useState({
    selectStartDate: '',
    selectEndDate: '',
  });
  const [dateFiltersApplied, setDateFiltersApplied] = useState(false);
  const ref = useRef(null);

  // Fetch All MOvie Data
  const fetchMovieData = async (page) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=0612b4bc9527233a97fdbbce12a373de&page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const getMovieData = await response.json();
      setLoading(false);
      setData(getMovieData);
      setTotalPage(getMovieData.total_pages);
    } catch (error) {
      setError({
        show: "true",
        msg: error,
      })
    }
  };

  // Debounce the search function

  const toInputLowercase = (e) => {
    const lowercasedValue = e.target.value.toLowerCase();
    setMovieName(lowercasedValue);
    debouncedSearch(lowercasedValue, movieLength, page);
  };
  // Search the query data from Api
  const debouncedSearch = _.debounce(async (movieName, movieLength, page) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=d4fbc0cd7f3b6b7ea3c3b8e5c74b8f46&language=en-US&query=${movieName}&page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const getMovieData = await response.json();
      setLoading(false);
      setData(getMovieData);
      setTotalPage(getMovieData.total_pages);
    } catch (error) {
      setError({
        show: "true",
        msg: error,
      });
    }
  }, 500);

  // useEffect(() => {
  //   if (movieLength >= 3 || (movieName?.trim() ?? '') === '') {
  //     debouncedSearch.cancel();
  //     if ((movieName?.trim() ?? '') === '') {
  //       fetchMovieData(page);
  //       return;
  //     }

  //     debouncedSearch(movieName, movieLength, page);
  //   }
  // }, [movieName, movieLength, page, totalPage]);

  const handleChange = (e) => {
    const inputText = e.target.value.toLowerCase();
    setMovieName(inputText);

    let lengthMovie = inputText.length;

    if (lengthMovie <= 3) {
      setMovieLength(lengthMovie);
    } else {
      setMovieLength(0);
    }
    if (lengthMovie > 3) {
      debouncedSearch(inputText, movieLength, page);
    }
  };

  const pageCount = Math.ceil(totalPage / itemsPerPage);
  // pagination click
  const handlePageClick = (event) => {
    if (data && data.total_pages) {
      const newPage = event.selected + 1;
      setPage(newPage);
      ref.current?.scrollIntoView({ behavior: 'smooth' });

      if (movieName) {
        debouncedSearch(movieName, movieLength, newPage);
      } else if (seledDate.selectStartDate !== '' && seledDate.selectEndDate !== '') {
        fetchMovieDataViaDate(seledDate, newPage);
      } else {
        fetchMovieData(newPage);

      }
    }
  };
  const handleSelectChange = (e) => {
    setMovieName(null)
    const selectedIndex = e.target.value;
    const getName = e.target.name;
    if (getName === 'selectStartDate') {
      setselectDate(prevState => ({ ...prevState, [getName]: selectedIndex, }));
    }
    else {
      setselectDate(prevState => ({ ...prevState, [getName]: selectedIndex, }));
    }
  }
  // Fetch All via Dates
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (seledDate.selectStartDate !== '' && seledDate.selectEndDate !== '') {
          await fetchMovieDataViaDate(seledDate, page);
          setDateFiltersApplied(true);
        } else if (!dateFiltersApplied) {
          await fetchMovieData(page);
        }
      } catch (error) {
        setError({
          show: true,
          msg: error.message,
        });
      }
    };

    fetchData();
  }, [seledDate.selectStartDate, seledDate.selectEndDate, page, dateFiltersApplied]);

  const fetchMovieDataViaDate = async (seledDate, page) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=0612b4bc9527233a97fdbbce12a373de&primary_release_date.gte=${seledDate.selectStartDate}&primary_release_date.lte=${seledDate.selectEndDate}&page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const getMovieData = await response.json();
      if (getMovieData.total_pages === 0 && getMovieData.total_results === 0) {
        setLoading(false);
        setselectDate(({ selectStartDate: '', selectEndDate: '' }));
      }
      setLoading(false);
      setData(getMovieData);
      setTotalPage(getMovieData.total_pages);
    } catch (error) {
      setError({
        show: "true",
        msg: error,
      });
    }
  }

  return (
    <div className="App" ref={ref}>
      <div className="searchMovieInput">
        <input type="text" placeholder='Enter movie name' className='searchMovie' value={movieName} onChange={handleChange} onInput={toInputLowercase} />
      </div>
      {loading ?
        <div className="spinner">
          <div className="loading-spinner"></div>
        </div> : ''
      }
      {
        data.results ? (
          <>
            <div className="dropdown-container">
              <label htmlFor="">Start Date</label>
              <select
                name="selectStartDate"
                id="selectStartDate"
                onChange={handleSelectChange}
                value={seledDate.selectStartDate}
              >
                <option value="" disabled>Select Start date</option>
                {data.results.map((singleDropdown) => (
                  <option key={singleDropdown.id} value={singleDropdown.release_date}>
                    {singleDropdown.release_date}
                  </option>
                ))}
              </select>

              <div className="dropdown-container">
                <label htmlFor="">End Date</label>
                <select
                  name="selectEndDate"
                  id="selectEndDate"
                  onChange={handleSelectChange}
                  value={seledDate.selectEndDate}
                >
                  <option value="" disabled>Select End date</option>
                  {data.results.map((singleDropdown) => (
                    <option key={singleDropdown.id} value={singleDropdown.release_date}>
                      {singleDropdown.release_date}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='movieData'>
              {
                data.results && data.results.length > 0 ? (
                  data.results.map((singleMovie, key) => {
                    return (
                      <div className='singleMovie' key={key}>
                        <div className="row">
                          <div className="col-4">
                            {
                              singleMovie.poster_path ?
                                <img src={`https://image.tmdb.org/t/p/original${singleMovie.poster_path}`} alt="" /> :
                                <img src={`https://placehold.co/80x80/000000/FFF`} alt="" />
                            }
                          </div>
                          <div className="col-8">
                            <div className="movieSerial">
                              {
                                singleMovie.title ?
                                  <h2>{singleMovie.title} </h2>
                                  : ''
                              }
                              {
                                singleMovie.name ?
                                  <h2>{singleMovie.name} </h2>
                                  : ''
                              }
                              {singleMovie.overview ?
                                <p>{singleMovie.overview}... </p>
                                : ''
                              }
                            </div>
                            <div className="movieSerialData">
                              {
                                singleMovie.release_date ?
                                  <div className="serialSingleData">
                                    <span>{singleMovie.release_date}</span>
                                    <h3>Release Data</h3>
                                  </div> : ''

                              }

                              {
                                singleMovie.popularity ?
                                  <div className="serialSingleData">
                                    <span>{singleMovie.popularity}</span>
                                    <h3>Popularity</h3>
                                  </div> : ''
                              }

                              {
                                singleMovie.vote_count ?
                                  <div className="serialSingleData">
                                    <span>{singleMovie.vote_count}</span>
                                    <h3>Vote Count</h3>
                                  </div> : ''
                              }

                            </div>
                          </div>
                        </div>
                        <div className="popularity">
                              {
                                singleMovie.popularity ?
                                <>
                                  <span>Popularity:</span> <p>{singleMovie.popularity}</p> </>: ''
                              }
                            </div>
                      </div>
                    )
                  })
                ) : <span>No Results Found</span>
              }
            </div>
            <div className='pagination'>
              <ReactPaginate breakLabel="..." nextLabel="next >" onPageChange={handlePageClick} pageRangeDisplayed={2} 
              pageCount={pageCount} previousLabel="< previous" renderOnZeroPageCount={null}
              />
            </div>
          </>
        ) : ''
      }

    </div>
  );
}

export default App;
