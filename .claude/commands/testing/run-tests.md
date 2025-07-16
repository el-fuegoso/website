# Run Tests

## Context
Execute comprehensive test suite including unit tests, integration tests, and end-to-end tests with detailed reporting and coverage analysis.

## Requirements
- Test framework configured (Jest, Mocha, Cypress, etc.)
- Test databases and mock services available
- CI/CD environment or local testing setup
- Coverage reporting tools installed

## Execution
```xml
<test_execution>
  <preparation>
    <environment_setup>
      - Configure test environment variables
      - Start test databases and mock services
      - Clear previous test artifacts
      - Validate test dependencies
    </environment_setup>
    
    <test_discovery>
      - Scan for all test files and suites
      - Identify test categories and tags
      - Check test configuration validity
      - Verify test data and fixtures
    </test_discovery>
  </preparation>
  
  <unit_testing>
    <component_tests>
      - Run individual component unit tests
      - Test pure functions and utilities
      - Verify prop handling and state management
      - Test error handling and edge cases
    </component_tests>
    
    <service_tests>
      - Test business logic and services
      - Verify API client implementations
      - Test data transformation functions
      - Validate error handling and retries
    </service_tests>
  </unit_testing>
  
  <integration_testing>
    <api_tests>
      - Test API endpoints and routes
      - Verify request/response handling
      - Test authentication and authorization
      - Validate data persistence
    </api_tests>
    
    <database_tests>
      - Test database queries and transactions
      - Verify data model relationships
      - Test migration scripts
      - Validate data integrity constraints
    </database_tests>
    
    <external_service_tests>
      - Test third-party API integrations
      - Verify webhook handling
      - Test service communication patterns
      - Validate fallback mechanisms
    </external_service_tests>
  </integration_testing>
  
  <end_to_end_testing>
    <user_journey_tests>
      - Test complete user workflows
      - Verify cross-browser compatibility
      - Test responsive design functionality
      - Validate accessibility features
    </user_journey_tests>
    
    <performance_tests>
      - Measure page load times
      - Test under concurrent user load
      - Verify memory usage patterns
      - Check for performance regressions
    </performance_tests>
  </end_to_end_testing>
  
  <coverage_analysis>
    <code_coverage>
      - Generate line and branch coverage reports
      - Identify uncovered code paths
      - Analyze coverage trends over time
      - Highlight critical uncovered areas
    </code_coverage>
    
    <test_quality>
      - Identify flaky or unstable tests
      - Analyze test execution times
      - Check for test dependencies and isolation
      - Validate test assertion quality
    </test_quality>
  </coverage_analysis>
  
  <reporting>
    <detailed_results>
      - Generate comprehensive test reports
      - Create visual coverage reports
      - Export results in multiple formats
      - Archive test artifacts
    </detailed_results>
    
    <notifications>
      - Send results to team channels
      - Update CI/CD status indicators
      - Create GitHub check annotations
      - Alert on test failures or coverage drops
    </notifications>
  </reporting>
</test_execution>
```

## Validation
- [ ] All test suites executed successfully
- [ ] Coverage thresholds met or exceeded
- [ ] No flaky or intermittent test failures
- [ ] Performance benchmarks within acceptable range
- [ ] Test reports generated and accessible
- [ ] CI/CD integration working properly
- [ ] Test environment properly cleaned up
- [ ] Team notified of results

## Examples
```bash
/testing:run-tests
/testing:run-tests --coverage --watch
/testing:run-tests --type=integration --environment=staging
/testing:run-tests --e2e --browsers=chrome,firefox
/testing:run-tests --performance --load-test
```

## Output
- Comprehensive test execution report
- Code coverage analysis with visual reports
- Performance benchmarks and trends
- Failed test details with debugging information
- Test quality metrics and recommendations