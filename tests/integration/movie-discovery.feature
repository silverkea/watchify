Feature: Movie Discovery
  As a user
  I want to search for movies and see them in a grid
  So that I can discover movies to watch

  Background:
    Given I am on the home page
    And the movie search service is available

  Scenario: Basic movie search
    When I search for "action movies"
    Then I should see a grid of movie results
    And each movie should display title, poster, release date, and rating
    And the results should be paginated

  Scenario: Search with no results
    When I search for "nonexistentmovie12345"
    Then I should see a "No movies found" message
    And the movie grid should be empty

  Scenario: Search with special characters
    When I search for "action & adventure"
    Then I should see movie results
    And the search query should be properly encoded

  Scenario: Genre filtering
    Given I have searched for "comedy"
    When I filter by "Comedy" genre
    Then all displayed movies should have the Comedy genre
    And the genre filter should be visually active

  Scenario: Clear genre filter
    Given I have applied a genre filter
    When I clear the genre filter
    Then all movies from the original search should be displayed
    And no genre filter should be active

  Scenario: Pagination navigation
    Given I have search results with multiple pages
    When I click on page 2
    Then I should see different movies
    And the page indicator should show page 2
    And I should be able to navigate back to page 1

  Scenario: Movie grid responsive layout
    Given I have movie search results
    When I resize the browser to mobile size
    Then the movie grid should adapt to a single column layout
    When I resize the browser to desktop size
    Then the movie grid should show multiple columns

  Scenario: Loading states during search
    When I perform a search
    Then I should see a loading indicator
    And the search button should be disabled
    When the results load
    Then the loading indicator should disappear
    And the search button should be enabled

  Scenario: Error handling for API failures
    Given the movie API is unavailable
    When I search for "test movie"
    Then I should see an error message
    And I should have an option to retry the search

  Scenario: Fast successive searches
    When I search for "action"
    And I immediately search for "comedy" before the first search completes
    Then only the "comedy" results should be displayed
    And there should be no conflicting results