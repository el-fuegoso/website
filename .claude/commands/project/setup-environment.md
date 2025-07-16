# Setup Environment

## Context
Complete development environment initialization including dependencies, configuration, tooling, and verification for web development projects.

## Requirements
- Operating system with package manager
- Internet connection for downloads
- Git installed and configured
- Node.js runtime (recommended: latest LTS)

## Execution
```xml
<environment_setup>
  <detection>
    <system_check>
      - Detect operating system and architecture
      - Verify Node.js and npm versions
      - Check Git configuration
      - Identify project type and framework
    </system_check>
  </detection>
  
  <dependencies>
    <package_installation>
      - Run `npm install` or `yarn install`
      - Install global development tools
      - Setup package manager configuration
      - Verify dependency integrity
    </package_installation>
    
    <tool_installation>
      - Install code formatters (Prettier, ESLint)
      - Setup pre-commit hooks
      - Install testing frameworks
      - Configure build tools
    </tool_installation>
  </dependencies>
  
  <configuration>
    <environment_files>
      - Create .env files for different environments
      - Setup environment variable templates
      - Configure API keys and secrets
      - Setup database connection strings
    </environment_files>
    
    <editor_setup>
      - Configure VS Code settings and extensions
      - Setup debugging configuration
      - Configure code formatting rules
      - Setup syntax highlighting
    </editor_setup>
  </configuration>
  
  <services>
    <database_setup>
      - Initialize database connections
      - Run database migrations
      - Seed initial data if available
      - Verify database connectivity
    </database_setup>
    
    <external_services>
      - Configure API endpoints
      - Setup authentication providers
      - Configure CDN and asset management
      - Setup monitoring and logging
    </external_services>
  </services>
  
  <verification>
    <development_server>
      - Start development server
      - Verify hot reloading works
      - Check asset compilation
      - Test API connectivity
    </development_server>
    
    <build_process>
      - Run production build
      - Verify build artifacts
      - Test deployment scripts
      - Validate environment configurations
    </build_process>
  </verification>
</environment_setup>
```

## Validation
- [ ] All dependencies installed successfully
- [ ] Configuration files created and valid
- [ ] Development server starts without errors
- [ ] Test suite runs and passes
- [ ] Build process completes successfully
- [ ] Database connections established
- [ ] External services accessible
- [ ] Code formatting and linting work

## Examples
```bash
/project:setup-environment
/project:setup-environment --database=postgresql
/project:setup-environment --team-config
/project:setup-environment --full-stack
```

## Output
- Complete development environment ready
- All tools and dependencies configured
- Documentation generated for team onboarding
- Verification report with system status