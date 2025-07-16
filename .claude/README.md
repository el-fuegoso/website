# Claude Code Modular Framework

## Overview

This directory contains the modular framework implementation for enhanced AI-assisted development workflows. The framework provides structured commands, configurations, and tools to maximize productivity and maintain code quality.

## Directory Structure

```
.claude/
├── config/                 # Environment configurations
│   ├── settings.json      # Base framework settings
│   ├── development.json   # Development environment config
│   ├── staging.json       # Staging environment config
│   └── production.json    # Production environment config
└── commands/              # Modular command definitions
    ├── project/           # Project management commands
    │   ├── create-feature.md
    │   ├── setup-environment.md
    │   └── scaffold-component.md
    ├── development/       # Development workflow commands
    │   ├── code-review.md
    │   ├── debug-issue.md
    │   └── refactor-code.md
    ├── testing/           # Testing and QA commands
    │   ├── run-tests.md
    │   └── generate-tests.md
    ├── deployment/        # Deployment and infrastructure
    │   └── deploy-staging.md
    └── documentation/     # Documentation generation
        └── generate-docs.md
```

## Configuration Management

### Environment Hierarchy
1. **settings.json** - Base configuration with default values
2. **environment.json** - Environment-specific overrides
3. **Local overrides** - Developer-specific settings (not committed)

### Key Configuration Areas
- **Token Optimization**: Context management and progressive disclosure
- **Security Settings**: Audit logging, permission validation, secret scanning
- **Quality Gates**: Testing, documentation, and security requirements
- **Workflow Automation**: Auto-formatting, testing, and deployment
- **Integration Settings**: MCP servers, external tools, monitoring

## Command Structure

Each command follows a standardized XML structure:
- **Context**: Purpose and scope of the command
- **Requirements**: Prerequisites and dependencies
- **Execution**: Step-by-step implementation process
- **Validation**: Success criteria and quality checks
- **Examples**: Usage patterns and options
- **Output**: Expected results and artifacts

## Usage Patterns

### Development Workflow
1. Use `/project:setup-environment` for initial setup
2. Create features with `/project:create-feature`
3. Review code using `/development:code-review`
4. Generate tests with `/testing:generate-tests`
5. Deploy to staging with `/deployment:deploy-staging`

### Quality Assurance
- All commands include validation steps
- Security scanning integrated into workflows
- Performance monitoring and optimization
- Comprehensive test coverage requirements

## Best Practices

1. **Progressive Disclosure**: Load commands only when needed
2. **Modular Design**: Keep commands focused and composable
3. **Environment Awareness**: Use appropriate configuration for context
4. **Security First**: Always include security validation
5. **Documentation**: Generate and maintain comprehensive docs

## Token Optimization

The framework reduces context overhead through:
- **Lazy Loading**: Commands loaded on-demand
- **Context Compression**: Efficient information structuring
- **Smart Switching**: Intelligent context management
- **Modular Instructions**: Focused, relevant guidance

## Integration Features

### MCP Server Support
- Memory management for context persistence
- Git integration for version control
- Filesystem monitoring for change detection

### External Tools
- Linear for issue tracking
- Notion for documentation sync
- Monitoring and alerting systems

## Customization

### Adding New Commands
1. Create command file in appropriate directory
2. Follow the standard XML structure
3. Include comprehensive validation
4. Add usage examples and documentation

### Environment Configuration
1. Override settings in environment-specific files
2. Use environment variables for sensitive data
3. Document configuration changes
4. Test across all environments

## Security Considerations

- **Secret Scanning**: Prevent accidental exposure
- **Permission Validation**: Role-based access control
- **Audit Logging**: Comprehensive activity tracking
- **Environment Isolation**: Separate dev/staging/production

## Monitoring and Metrics

- **Performance Tracking**: Response times and resource usage
- **Usage Analytics**: Command utilization patterns
- **Error Reporting**: Comprehensive error tracking
- **Quality Metrics**: Code coverage, test results, security scans

---

For detailed usage instructions and examples, see the main CLAUDE.md file in the project root.