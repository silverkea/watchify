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
    When I wait for 3 seconds
    Then the countdown should decrease by exactly 3 seconds
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

  Scenario: Multiple browser tabs synchronization
    Given I have the watch party page open
    When I open the same URL in another tab
    Then both tabs should show synchronized countdown timers
    When I refresh one tab
    Then both timers should remain synchronized