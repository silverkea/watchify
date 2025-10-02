Feature: Enhanced Genre Filtering Behavior
  As a user discovering movies for watch parties
  I want genre filters to trigger new searches with server-side filtering
  So that I get accurate, paginated results instead of limited client-side filtering

  Background:
    Given the user is on the home page
    And the movie discovery interface is loaded

  @genre-filtering @server-side
  Scenario: Genre filter triggers new search for popular movies
    Given the user sees popular movies displayed by default
    When the user selects the "Action" genre filter
    Then the system should perform a new API request to "/api/movies/popular?genre=28"
    And the movie grid should return to page 1
    And all displayed movies should have the "Action" genre
    And the page counter should reset to "Page 1"

  @genre-filtering @search-results
  Scenario: Genre filter triggers new search for search results
    Given the user has searched for "superhero"
    And search results are displayed
    When the user selects the "Adventure" genre filter
    Then the system should perform a new API request to "/api/movies/search?q=superhero&genre=12"
    And the movie grid should return to page 1
    And all displayed movies should have the "Adventure" genre
    And the search term "superhero" should be maintained

  @genre-filtering @multiple-genres
  Scenario: Multiple genre filters use AND logic
    Given the user sees popular movies displayed
    When the user selects the "Action" genre filter
    And the user selects the "Adventure" genre filter
    Then the system should perform a new API request to "/api/movies/popular?genre=28,12"
    And all displayed movies should have both "Action" AND "Adventure" genres

  @genre-filtering @pagination
  Scenario: Genre filters are maintained during pagination
    Given the user has selected "Comedy" genre filter
    And filtered popular movies are displayed
    When the user clicks "Load More"
    Then the system should request the next page with genre filters maintained
    And the API request should be "/api/movies/popular?page=2&genre=35"
    And all new movies should also have the "Comedy" genre

  @genre-filtering @pagination @search
  Scenario: Genre filters maintained during search result pagination
    Given the user has searched for "funny"
    And selected "Comedy" genre filter
    And filtered search results are displayed
    When the user clicks "Load More"
    Then the system should request "/api/movies/search?q=funny&page=2&genre=35"
    And all new movies should have the "Comedy" genre
    And the search term should be maintained

  @genre-filtering @clear-filters
  Scenario: Clearing genre filters triggers new search
    Given the user has "Action" and "Adventure" filters active
    And filtered movies are displayed
    When the user clears all genre filters
    Then the system should perform a new API request without genre parameters
    And the movie grid should return to page 1
    And movies from all genres should be displayed

  @genre-filtering @filter-modification
  Scenario: Modifying genre filters resets pagination
    Given the user has "Action" genre filter active
    And is viewing page 3 of filtered results
    When the user adds "Comedy" to the active filters
    Then the system should return to page 1
    And perform a new search with both "Action" and "Comedy" filters
    And the page counter should show "Page 1"

  @genre-filtering @search-mode-switching
  Scenario: Genre filtering works when switching between search and popular
    Given the user has searched for "adventure" with "Action" genre filter
    When the user clears the search but keeps the genre filter
    Then the system should show popular movies filtered by "Action" genre
    And the API request should be "/api/movies/popular?genre=28"
    And the genre filter should remain active

  @genre-filtering @error-handling
  Scenario: Invalid genre handling
    Given the user has valid filters active
    When the system encounters an invalid genre ID
    Then the system should display an appropriate error message
    And not crash the application
    And allow the user to continue browsing

  @genre-filtering @performance
  Scenario: Genre filter changes are responsive
    Given the user is viewing movies
    When the user selects a genre filter
    Then the new search should begin within 100ms
    And the loading state should be displayed
    And results should load within 2 seconds

  @genre-filtering @dynamic-title
  Scenario: Page title updates with single genre selection
    Given the user sees "Popular Movies" as the page title
    When the user selects the "Action" genre filter
    Then the page title should change to "Action Movies"
    And the title should remain "Action Movies" while browsing filtered results

  @genre-filtering @dynamic-title @multiple-genres
  Scenario: Page title updates with multiple genre selection
    Given the user sees "Popular Movies" as the page title
    When the user selects the "Action" genre filter
    And the user selects the "Comedy" genre filter
    Then the page title should change to "Action, Comedy Movies"

  @genre-filtering @dynamic-title @clear-filters
  Scenario: Page title resets when clearing genre filters
    Given the user has "Action" genre filter active
    And the page title shows "Action Movies"
    When the user clears all genre filters
    Then the page title should return to "Popular Movies"

  @genre-filtering @dynamic-title @search-mode
  Scenario: Page title remains search-focused when genre filters applied to search
    Given the user has searched for "superhero"
    And the search results are displayed
    When the user selects the "Action" genre filter
    Then the page title should remain search-focused (not change to "Action Movies")
    And the genre filter should be applied to search results