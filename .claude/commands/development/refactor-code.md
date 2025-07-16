# Refactor Code

## Context
Systematic code refactoring to improve code quality, maintainability, and performance while preserving functionality.

## Requirements
- Comprehensive test suite to ensure no regressions
- Version control with ability to rollback changes
- Understanding of existing code architecture
- Clear refactoring objectives and success criteria

## Execution
```xml
<code_refactoring>
  <analysis>
    <code_assessment>
      - Identify code smells and technical debt
      - Analyze code complexity and maintainability metrics
      - Review performance bottlenecks
      - Assess test coverage and quality
    </code_assessment>
    
    <refactoring_planning>
      - Define specific refactoring goals
      - Prioritize refactoring tasks by impact and risk
      - Plan incremental refactoring steps
      - Identify potential breaking changes
    </refactoring_planning>
  </analysis>
  
  <preparation>
    <safety_measures>
      - Ensure comprehensive test coverage exists
      - Create feature branch for refactoring work
      - Document current behavior and APIs
      - Set up monitoring for performance metrics
    </safety_measures>
    
    <dependency_analysis>
      - Map all dependencies and usage patterns
      - Identify external integrations affected
      - Review API contracts and interfaces
      - Check for circular dependencies
    </dependency_analysis>
  </preparation>
  
  <implementation>
    <structural_refactoring>
      - Extract methods and classes for better organization
      - Eliminate code duplication (DRY principle)
      - Improve naming for clarity and consistency
      - Simplify complex conditional logic
    </structural_refactoring>
    
    <performance_optimization>
      - Optimize database queries and data access
      - Improve algorithm efficiency
      - Reduce memory allocations and garbage collection
      - Implement caching where appropriate
    </performance_optimization>
    
    <design_pattern_application>
      - Apply appropriate design patterns
      - Improve separation of concerns
      - Implement proper error handling patterns
      - Enhance modularity and reusability
    </design_pattern_application>
    
    <modernization>
      - Update to modern language features
      - Replace deprecated APIs and libraries
      - Improve type safety and null handling
      - Enhance async/await patterns
    </modernization>
  </implementation>
  
  <validation>
    <regression_testing>
      - Run full test suite after each refactoring step
      - Verify all existing functionality works
      - Test edge cases and error scenarios
      - Validate API contracts remain unchanged
    </regression_testing>
    
    <performance_validation>
      - Measure performance before and after
      - Verify memory usage improvements
      - Check response times and throughput
      - Monitor resource utilization
    </performance_validation>
    
    <code_quality_check>
      - Run static analysis tools
      - Verify code style and formatting
      - Check for security vulnerabilities
      - Validate documentation updates
    </code_quality_check>
  </validation>
</code_refactoring>
```

## Validation
- [ ] All tests pass without modification
- [ ] Performance metrics improved or maintained
- [ ] Code complexity reduced
- [ ] No breaking changes to public APIs
- [ ] Documentation updated appropriately
- [ ] Static analysis passes
- [ ] Team review and approval obtained
- [ ] Deployment and rollback plan ready

## Examples
```bash
/development:refactor-code --target=user-service
/development:refactor-code --type=performance --focus=database
/development:refactor-code --modernize --typescript
/development:refactor-code --extract-components --target=auth-module
```

## Output
- Refactored codebase with improved structure
- Performance benchmarks and comparison
- Updated documentation and API specifications
- Comprehensive test validation report
- Code quality metrics improvement summary