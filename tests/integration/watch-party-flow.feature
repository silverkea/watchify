Feature: Watch Party Creation and Management
  As a user
  I want to create and manage watch parties for movies
  So that I can coordinate movie viewing with friends

  Background:
    Given I am on the movie details page for "Fight Club"
    And the movie details are loaded

  Scenario: Create a basic watch party
    When I click on "Schedule Watch Party"
    Then I should see a date and time picker
    When I select a date 3 days from now
    And I select a time of 8:00 PM
    And I click "Create Watch Party"
    Then I should be redirected to the watch party page
    And I should see the movie title "Fight Club"
    And I should see the scheduled date and time

  Scenario: Invalid date selection
    When I click on "Schedule Watch Party"
    And I select a date in the past
    Then I should see an error message "Cannot schedule for past dates"
    And the "Create Watch Party" button should be disabled

  Scenario: Date and time picker usability
    When I click on "Schedule Watch Party"
    Then the date picker should default to tomorrow
    And the time picker should default to 8:00 PM
    When I select a date
    Then the time picker should remain accessible
    When I select a time
    Then both date and time should be clearly displayed

  Scenario: Watch party URL generation
    Given I have created a watch party for tomorrow at 8:00 PM
    When I view the watch party page
    Then I should see a shareable URL
    And the URL should contain encoded watch party data
    And the URL should be under 2048 characters

  Scenario: Watch party URL sharing
    Given I have a watch party URL
    When I copy the URL
    And I open it in a new browser tab
    Then I should see the same watch party information
    And the movie details should be displayed correctly
    And the countdown timer should show the same time

  Scenario: Watch party data persistence through URL
    Given I have created a watch party
    When I refresh the page
    Then all watch party information should be preserved
    And the countdown timer should continue accurately

  Scenario: Multiple watch parties for same movie
    Given I have created one watch party for "Fight Club"
    When I create another watch party for "Fight Club" at a different time
    Then both watch parties should have unique URLs
    And both should be accessible independently

  Scenario: Watch party creation with edge case times
    When I schedule a watch party for 11:59 PM
    Then the time should be correctly displayed
    When I schedule a watch party for 12:00 AM (midnight)
    Then the time should be correctly displayed as midnight

  Scenario: Watch party creation cancellation
    When I click on "Schedule Watch Party"
    And I select a date and time
    When I click "Cancel" or close the dialog
    Then I should return to the movie details page
    And no watch party should be created

  Scenario: Watch party with very long movie title
    Given I am on a movie with a very long title
    When I create a watch party
    Then the movie title should be displayed without breaking the layout
    And the URL should still be under the character limit