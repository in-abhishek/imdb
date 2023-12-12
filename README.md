
 - What i explored
     1. Project Setup 
	 		Movies Listing
			Search Movies
			Filter Movies
			Pagination
	 2. How to fire API
	 		https://developers.themoviedb.org/3/search/search-movies.  (documentation)
	 3. Filter based on 
	 		1. Search Movies 
				Keyword must be in the input field
				Keyword without case sensitive
				Keyword minimum 3 characters 
				Show data as per search result with pagination
			2. Filter Movies 
				Year must be in dropdown select
				Year dropdown should be dynamic
				Show data as per filter result with pagination
			3. Pagination
				Display pagination as per search result.
				The pagination displayed must contain previous and next clickable links.
				When the previous button is clicked it must redirect to the previous page
	 4. Hooks Used to perform this task
		 1. useEffect()
		 2. useState()
	  5. Key Points for learning
	  	  1. for input field i used dedouncing method
		  2. state management
          3. array dependencies in useEffect 
 - 
