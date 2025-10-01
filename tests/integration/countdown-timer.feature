Feature: Watch Party Countdown and Sharing
  As a user
  I want to see an accurate countdown to the watch party
  So that I know exactly when the movie starts

  Background:
    Given I have a watch party scheduled for 2 hours from now
    And I am on the watch party page

  Scenario: Countdown timer display
    Then I should see a prominent countdown timer at the top
    And the timer should show hours, minutes, and seconds
    And the timer should update every second
    And the timer should have a neon glow effect

  Scenario: Countdown timer accuracy
    When I wait for 5 seconds
    Then the countdown should decrease by exactly 5 seconds
    When I refresh the page
    Then the countdown should continue from the correct time

  Scenario: Countdown timer with different time ranges
    Given I have a watch party in 25 hours
    When I view the countdown
    Then it should display "1 day, 1 hour, 0 minutes"
    
    Given I have a watch party in 90 minutes
    When I view the countdown
    Then it should display "1 hour, 30 minutes"
    
    Given I have a watch party in 45 seconds
    When I view the countdown
    Then it should display "45 seconds"

  Scenario: Countdown reaches zero
    Given I have a watch party scheduled for 3 seconds from now
    When I wait for the countdown to reach zero
    Then the timer should display "MOVIE TIME!"
    And the timer should have a special animation
    And the page should show "The movie is starting now"

  Scenario: Watch party sharing via URL
    When I copy the shareable URL
    And I send it to a friend (simulated by opening in incognito)
    Then they should see the same watch party page
    And they should see the same countdown timer
    And the movie information should be identical

  Scenario: URL decoding and validation
    Given I have a valid watch party URL
    When I access the URL
    Then the watch party data should be correctly decoded
    And all movie information should be displayed
    
    Given I have a corrupted watch party URL
    When I access the URL
    Then I should see an error page
    And I should be offered to return to the home page

  Scenario: Multiple browser tabs synchronization
    Given I have the watch party page open
    When I open the same URL in another tab
    Then both tabs should show synchronized countdown timers
    When I refresh one tab
    Then both timers should remain synchronized

  Scenario: Countdown timer performance
    Given I have the countdown timer running
    When I leave the tab for 30 seconds
    And I return to the tab
    Then the countdown should have the correct time
    And there should be no performance lag

  Scenario: Social sharing integration
    When I click on "Share Watch Party"
    Then I should see sharing options
    And the shared content should include movie title and start time
    And the shared URL should be correctly formatted

  Scenario: Watch party status transitions
    Given I have a watch party starting in 1 minute
    When the countdown reaches zero
    Then the status should change from "SCHEDULED" to "LIVE"
    And the display should update to reflect the current status

  Scenario: Countdown timer with different time zones
    Given I create a watch party for 8:00 PM local time
    When someone in a different timezone accesses the URL
    Then they should see the countdown in their local time
    And the countdown should be accurate to the scheduled UTC time

  Scenario: Watch party expiration
    Given I have a watch party that ended 2 hours ago
    When I access the watch party URL
    Then I should see "This watch party has ended"
    And I should see the movie information for reference
    And I should have an option to create a new watch party