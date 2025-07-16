# Code Review

## Context
Comprehensive code review process covering code quality, security, performance, and maintainability for web development projects.

## Requirements
- Git repository with changes to review
- Access to project documentation and coding standards
- Testing framework configured
- Static analysis tools available

## Execution
```xml
<code_review>
  <preparation>
    <change_analysis>
      - Review git diff and changed files
      - Understand the purpose and scope of changes
      - Identify affected components and systems
      - Check for breaking changes
    </change_analysis>
    
    <context_gathering>
      - Review related tickets or issues
      - Understand business requirements
      - Check design documentation
      - Review previous discussions
    </context_gathering>
  </preparation>
  
  <code_quality>
    <structure_review>
      - Check code organization and modularity
      - Verify proper separation of concerns
      - Review naming conventions consistency
      - Assess readability and maintainability
    </structure_review>
    
    <logic_review>
      - Verify algorithm correctness
      - Check error handling implementation
      - Review edge case coverage
      - Validate business logic accuracy
    </logic_review>
    
    <performance_review>
      - Identify potential performance bottlenecks
      - Review database query efficiency
      - Check for memory leaks or excessive allocations
      - Verify proper caching implementation
    </performance_review>
  </code_quality>
  
  <security_review>
    <vulnerability_check>
      - Scan for common security vulnerabilities
      - Review input validation and sanitization
      - Check authentication and authorization
      - Verify secure data handling
    </vulnerability_check>
    
    <dependency_review>
      - Check for vulnerable dependencies
      - Review new package additions
      - Verify license compatibility
      - Check for unnecessary dependencies
    </dependency_review>
  </security_review>
  
  <testing_review>
    <test_coverage>
      - Verify adequate test coverage
      - Review test quality and effectiveness
      - Check for testing anti-patterns
      - Ensure tests are maintainable
    </test_coverage>
    
    <test_execution>
      - Run full test suite
      - Execute integration tests
      - Verify CI/CD pipeline passes
      - Check for flaky tests
    </test_execution>
  </testing_review>
  
  <documentation_review>
    <code_documentation>
      - Review inline comments quality
      - Check API documentation completeness
      - Verify README updates if needed
      - Review changelog entries
    </code_documentation>
  </documentation_review>
</code_review>
```

## Validation
- [ ] Code follows project conventions and standards
- [ ] No security vulnerabilities identified
- [ ] Performance impact assessed and acceptable
- [ ] All tests pass with adequate coverage
- [ ] Documentation updated appropriately
- [ ] No breaking changes or properly documented
- [ ] Dependencies are secure and necessary
- [ ] Code is maintainable and readable

## Examples
```bash
/development:code-review
/development:code-review --branch=feature/user-auth
/development:code-review --security-focus
/development:code-review --performance-analysis
```

## Output
- Detailed review report with findings
- Security scan results
- Performance analysis summary
- Test coverage report
- Actionable recommendations for improvements