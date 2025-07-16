# Create Feature

## Context
Full-stack feature development workflow for web applications, including frontend components, backend APIs, and integration tests.

## Requirements
- Git repository initialized
- Development environment configured
- Package manager available (npm/yarn)
- Project structure established

## Execution
```xml
<feature_creation>
  <planning>
    <analyze_requirements>
      - Define feature scope and acceptance criteria
      - Identify affected components and services
      - Plan data model changes if needed
      - Review existing patterns and conventions
    </analyze_requirements>
    
    <branch_management>
      - Create feature branch: `feat/[feature-name]`
      - Ensure clean working directory
      - Pull latest from main/master
    </branch_management>
  </planning>
  
  <implementation>
    <frontend>
      - Create/update React components
      - Add CSS styling following project conventions
      - Implement client-side state management
      - Add form validation and error handling
    </frontend>
    
    <backend>
      - Create/update API endpoints
      - Implement business logic
      - Add database migrations if needed
      - Update service layer
    </backend>
    
    <integration>
      - Connect frontend to backend APIs
      - Handle loading states and errors
      - Implement proper data flow
      - Add authentication/authorization if needed
    </integration>
  </implementation>
  
  <testing>
    <unit_tests>
      - Test individual components and functions
      - Mock external dependencies
      - Achieve minimum 80% code coverage
    </unit_tests>
    
    <integration_tests>
      - Test API endpoints
      - Test component integration
      - Test data flow
    </integration_tests>
  </testing>
  
  <documentation>
    - Update API documentation
    - Add component documentation
    - Update user guides if needed
    - Document any breaking changes
  </documentation>
</feature_creation>
```

## Validation
- [ ] All tests pass
- [ ] Code coverage meets project standards (80%+)
- [ ] Documentation updated
- [ ] Security scan passes
- [ ] Performance benchmarks met
- [ ] Feature works in all target browsers
- [ ] Mobile responsiveness verified

## Examples
```bash
/project:create-feature user-profile
/project:create-feature chat-system --type=realtime --framework=socketio
/project:create-feature payment-integration --provider=stripe
```

## Output
- Feature branch created and pushed
- All source files implemented
- Tests written and passing
- Documentation updated
- Ready for code review