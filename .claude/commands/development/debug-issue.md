# Debug Issue

## Context
Systematic debugging process for identifying, reproducing, and resolving issues in web applications across frontend, backend, and integration layers.

## Requirements
- Access to application logs and error tracking
- Development environment with debugging tools
- Ability to reproduce the issue
- Access to relevant documentation and codebase

## Execution
```xml
<debug_issue>
  <issue_identification>
    <problem_analysis>
      - Gather detailed issue description and steps to reproduce
      - Identify affected components and systems
      - Determine issue severity and impact
      - Check for similar known issues
    </problem_analysis>
    
    <data_collection>
      - Collect error logs and stack traces
      - Gather browser console errors
      - Review network requests and responses
      - Capture system resource usage
    </data_collection>
  </issue_identification>
  
  <reproduction>
    <environment_setup>
      - Set up debugging environment
      - Configure logging and monitoring
      - Enable debug mode and verbose output
      - Prepare test data and scenarios
    </environment_setup>
    
    <issue_reproduction>
      - Follow exact steps to reproduce the issue
      - Try different browsers and environments
      - Test with various data inputs
      - Document reproduction conditions
    </issue_reproduction>
  </reproduction>
  
  <root_cause_analysis>
    <code_investigation>
      - Trace code execution paths
      - Use debugger breakpoints and stepping
      - Analyze variable states and data flow
      - Review recent code changes
    </code_investigation>
    
    <system_investigation>
      - Check database queries and performance
      - Review API response times and errors
      - Analyze memory and CPU usage
      - Check external service dependencies
    </system_investigation>
    
    <timeline_analysis>
      - Review deployment history
      - Check configuration changes
      - Analyze user behavior patterns
      - Identify correlation with external events
    </timeline_analysis>
  </root_cause_analysis>
  
  <solution_development>
    <fix_implementation>
      - Develop targeted fix for root cause
      - Implement proper error handling
      - Add validation and safety checks
      - Consider backward compatibility
    </fix_implementation>
    
    <prevention_measures>
      - Add monitoring and alerting
      - Implement defensive programming
      - Add automated tests for the scenario
      - Update documentation and runbooks
    </prevention_measures>
  </solution_development>
  
  <verification>
    <fix_testing>
      - Test fix in development environment
      - Verify original issue is resolved
      - Test for regression in related functionality
      - Validate performance impact
    </fix_testing>
    
    <edge_case_testing>
      - Test boundary conditions
      - Test error scenarios
      - Verify graceful degradation
      - Test across different environments
    </edge_case_testing>
  </verification>
</debug_issue>
```

## Validation
- [ ] Issue successfully reproduced
- [ ] Root cause identified and documented
- [ ] Fix implemented and tested
- [ ] No regressions introduced
- [ ] Monitoring and prevention measures added
- [ ] Documentation updated
- [ ] Team notified of resolution
- [ ] Post-mortem conducted if necessary

## Examples
```bash
/development:debug-issue "Login fails with 500 error"
/development:debug-issue --type=performance --component=chat-system
/development:debug-issue --critical --affects-production
/development:debug-issue "Memory leak in data processing"
```

## Output
- Detailed bug report with root cause analysis
- Implemented fix with code changes
- Test cases covering the issue scenario
- Updated monitoring and alerting
- Documentation and knowledge base updates