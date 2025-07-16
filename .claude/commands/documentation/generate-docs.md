# Generate Documentation

## Context
Automatically generate comprehensive documentation including API docs, component documentation, user guides, and technical specifications.

## Requirements
- Codebase with JSDoc, TypeScript definitions, or similar documentation
- Documentation generation tools configured (JSDoc, Storybook, etc.)
- Template files for documentation structure
- Access to project requirements and specifications

## Execution
```xml
<documentation_generation>
  <code_analysis>
    <api_discovery>
      - Scan all API endpoints and methods
      - Extract parameter and response schemas
      - Identify authentication requirements
      - Map error codes and responses
    </api_discovery>
    
    <component_analysis>
      - Analyze React/Vue component props
      - Extract component usage examples
      - Document component variants and states
      - Identify accessibility features
    </component_analysis>
    
    <architecture_mapping>
      - Document system architecture
      - Map service dependencies
      - Identify data flow patterns
      - Document design decisions
    </architecture_mapping>
  </code_analysis>
  
  <api_documentation>
    <endpoint_documentation>
      - Generate OpenAPI/Swagger specifications
      - Create interactive API documentation
      - Document request/response examples
      - Add authentication and rate limiting info
    </endpoint_documentation>
    
    <sdk_documentation>
      - Generate client SDK documentation
      - Create usage examples and tutorials
      - Document error handling patterns
      - Add best practices and guidelines
    </sdk_documentation>
  </api_documentation>
  
  <component_documentation>
    <storybook_stories>
      - Generate component stories for all variants
      - Create interactive component playground
      - Document component props and events
      - Add accessibility testing scenarios
    </storybook_stories>
    
    <usage_examples>
      - Create component usage examples
      - Document integration patterns
      - Show common use cases
      - Provide troubleshooting guides
    </usage_examples>
  </component_documentation>
  
  <user_documentation>
    <user_guides>
      - Create step-by-step user tutorials
      - Generate feature documentation
      - Document workflow processes
      - Create troubleshooting guides
    </user_guides>
    
    <admin_documentation>
      - Document administrative features
      - Create configuration guides
      - Document deployment procedures
      - Add monitoring and maintenance guides
    </admin_documentation>
  </user_documentation>
  
  <technical_documentation>
    <architecture_docs>
      - Generate system architecture diagrams
      - Document database schemas
      - Create deployment architecture docs
      - Document security architecture
    </architecture_docs>
    
    <development_guides>
      - Create developer onboarding guides
      - Document coding standards
      - Create contribution guidelines
      - Document testing strategies
    </development_guides>
    
    <operational_docs>
      - Document deployment procedures
      - Create monitoring and alerting guides
      - Document backup and recovery procedures
      - Create incident response playbooks
    </operational_docs>
  </technical_documentation>
  
  <documentation_optimization>
    <content_organization>
      - Organize documentation hierarchy
      - Create navigation and search
      - Add cross-references and links
      - Implement version control for docs
    </content_organization>
    
    <quality_assurance>
      - Validate documentation accuracy
      - Test all code examples
      - Check for broken links
      - Ensure consistent formatting
    </quality_assurance>
    
    <publishing>
      - Generate static documentation sites
      - Setup documentation hosting
      - Configure automatic updates
      - Enable team collaboration features
    </publishing>
  </documentation_optimization>
</documentation_generation>
```

## Validation
- [ ] All APIs documented with examples
- [ ] Component documentation complete and accurate
- [ ] User guides tested by non-technical users
- [ ] Technical documentation reviewed by team
- [ ] All code examples tested and working
- [ ] Documentation site publishes successfully
- [ ] Search and navigation working properly
- [ ] Documentation version control setup

## Examples
```bash
/documentation:generate-docs
/documentation:generate-docs --api-only
/documentation:generate-docs --components --storybook
/documentation:generate-docs --user-guides --publish
/documentation:generate-docs --full --deploy
```

## Output
- Complete API documentation with interactive features
- Component library documentation with Storybook
- User guides and tutorials
- Technical architecture documentation
- Published documentation website