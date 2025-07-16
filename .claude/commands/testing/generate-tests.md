# Generate Tests

## Context
Automatically generate comprehensive test suites for components, services, and APIs based on existing code structure and requirements.

## Requirements
- Existing codebase with clear component/service structure
- Test framework configured (Jest, Mocha, Cypress, etc.)
- Type definitions available (for TypeScript projects)
- Access to API documentation and component interfaces

## Execution
```xml
<test_generation>
  <code_analysis>
    <structure_mapping>
      - Analyze component props and state structure
      - Identify service methods and their signatures
      - Map API endpoints and their parameters
      - Discover utility functions and their usage
    </structure_mapping>
    
    <dependency_analysis>
      - Identify external dependencies to mock
      - Map internal service dependencies
      - Analyze data flow and state management
      - Identify side effects and async operations
    </dependency_analysis>
    
    <behavior_identification>
      - Extract expected behaviors from JSDoc comments
      - Analyze error handling patterns
      - Identify edge cases from validation logic
      - Map user interaction patterns
    </behavior_identification>
  </code_analysis>
  
  <unit_test_generation>
    <component_tests>
      - Generate tests for all component props combinations
      - Create tests for user interactions (clicks, inputs)
      - Test component lifecycle methods
      - Generate accessibility tests
    </component_tests>
    
    <service_tests>
      - Create tests for all public methods
      - Generate tests for error scenarios
      - Test async operations and promises
      - Create mock tests for external dependencies
    </service_tests>
    
    <utility_tests>
      - Generate tests for pure functions
      - Test boundary conditions and edge cases
      - Create performance tests for complex algorithms
      - Test error handling and validation
    </utility_tests>
  </unit_test_generation>
  
  <integration_test_generation>
    <api_tests>
      - Generate tests for all API endpoints
      - Create tests for different HTTP methods
      - Test authentication and authorization flows
      - Generate tests for error responses
    </api_tests>
    
    <workflow_tests>
      - Create tests for multi-step user workflows
      - Generate tests for data persistence flows
      - Test component interaction chains
      - Create tests for state management flows
    </workflow_tests>
  </integration_test_generation>
  
  <e2e_test_generation>
    <user_journey_tests>
      - Generate tests for complete user scenarios
      - Create tests for critical business workflows
      - Generate mobile and desktop specific tests
      - Test cross-browser compatibility scenarios
    </user_journey_tests>
    
    <regression_tests>
      - Generate tests for previously fixed bugs
      - Create tests for performance-critical paths
      - Generate tests for security-sensitive operations
      - Test deployment and configuration scenarios
    </regression_tests>
  </e2e_test_generation>
  
  <test_data_generation>
    <mock_data>
      - Generate realistic test data fixtures
      - Create edge case data scenarios
      - Generate large dataset tests
      - Create invalid data test cases
    </mock_data>
    
    <mock_services>
      - Generate mock implementations for external APIs
      - Create database mock services
      - Generate websocket and real-time service mocks
      - Create authentication service mocks
    </mock_services>
  </test_data_generation>
  
  <test_optimization>
    <performance_optimization>
      - Optimize test execution speed
      - Implement proper test isolation
      - Create shared test utilities
      - Optimize test data setup and teardown
    </performance_optimization>
    
    <maintainability>
      - Generate descriptive test names and documentation
      - Create reusable test helpers and utilities
      - Implement proper test organization
      - Generate test maintenance guidelines
    </maintainability>
  </test_optimization>
</test_generation>
```

## Validation
- [ ] Generated tests compile and run successfully
- [ ] Tests achieve target coverage percentage
- [ ] All edge cases and error scenarios covered
- [ ] Generated mocks work correctly
- [ ] Tests are maintainable and well-organized
- [ ] Performance tests run within acceptable time
- [ ] Generated test data is realistic and valid
- [ ] Documentation generated for test usage

## Examples
```bash
/testing:generate-tests --target=components
/testing:generate-tests --type=unit --coverage=90
/testing:generate-tests --api-endpoints --with-mocks
/testing:generate-tests --e2e --user-journeys
/testing:generate-tests --performance --load-testing
```

## Output
- Complete test suite with comprehensive coverage
- Mock services and test data fixtures
- Test utilities and helper functions
- Performance and load testing scenarios
- Documentation for running and maintaining tests