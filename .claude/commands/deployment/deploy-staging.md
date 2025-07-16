# Deploy Staging

## Context
Deploy application to staging environment with comprehensive testing, validation, and rollback capabilities.

## Requirements
- Staging environment configured and accessible
- CI/CD pipeline setup with staging deployment
- Environment-specific configuration files
- Database migration scripts prepared

## Execution
```xml
<staging_deployment>
  <pre_deployment>
    <validation>
      - Verify all tests pass in CI/CD
      - Check code coverage meets requirements
      - Validate security scan results
      - Ensure no critical vulnerabilities
    </validation>
    
    <preparation>
      - Create deployment branch/tag
      - Backup current staging database
      - Prepare rollback scripts
      - Notify team of deployment window
    </preparation>
  </pre_deployment>
  
  <deployment_process>
    <infrastructure>
      - Provision/update staging infrastructure
      - Configure load balancers and networking
      - Setup monitoring and logging
      - Validate SSL certificates
    </infrastructure>
    
    <application_deployment>
      - Build application artifacts
      - Deploy to staging servers
      - Run database migrations
      - Update configuration files
    </application_deployment>
    
    <service_configuration>
      - Configure environment variables
      - Setup external service connections
      - Configure caching and CDN
      - Enable monitoring and alerting
    </service_configuration>
  </deployment_process>
  
  <post_deployment>
    <health_checks>
      - Verify application startup
      - Test database connectivity
      - Check external service integration
      - Validate API endpoints
    </health_checks>
    
    <smoke_testing>
      - Run critical path smoke tests
      - Test user authentication flows
      - Verify data persistence
      - Check performance metrics
    </smoke_testing>
    
    <integration_testing>
      - Run full integration test suite
      - Test third-party integrations
      - Validate workflow automation
      - Check cross-service communication
    </integration_testing>
  </post_deployment>
  
  <validation>
    <functionality_testing>
      - Test all major features
      - Verify user workflows work
      - Check admin functionality
      - Test error handling
    </functionality_testing>
    
    <performance_validation>
      - Monitor response times
      - Check memory and CPU usage
      - Validate database performance
      - Test concurrent user scenarios
    </performance_validation>
    
    <security_validation>
      - Verify authentication works
      - Test authorization rules
      - Check HTTPS configuration
      - Validate security headers
    </security_validation>
  </validation>
  
  <monitoring_setup>
    <alerts_configuration>
      - Setup error rate monitoring
      - Configure performance alerts
      - Enable security monitoring
      - Setup business metric tracking
    </alerts_configuration>
    
    <dashboard_updates>
      - Update deployment status
      - Configure staging metrics dashboard
      - Setup log aggregation
      - Enable real-time monitoring
    </dashboard_updates>
  </monitoring_setup>
</staging_deployment>
```

## Validation
- [ ] Deployment completed without errors
- [ ] All health checks pass
- [ ] Smoke tests successful
- [ ] Integration tests pass
- [ ] Performance within acceptable range
- [ ] Security validation complete
- [ ] Monitoring and alerts active
- [ ] Team notified of successful deployment

## Examples
```bash
/deployment:deploy-staging
/deployment:deploy-staging --branch=release/v2.1.0
/deployment:deploy-staging --skip-migration
/deployment:deploy-staging --force --emergency
```

## Output
- Deployment status report
- Health check results
- Performance metrics comparison
- Integration test results
- Monitoring dashboard links
- Rollback instructions if needed