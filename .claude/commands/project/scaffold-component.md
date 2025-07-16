# Scaffold Component

## Context
Generate new UI components with proper structure, styling, tests, and documentation following project conventions.

## Requirements
- Project structure established
- Component framework identified (React, Vue, etc.)
- Styling system configured (CSS modules, styled-components, etc.)
- Testing framework available

## Execution
```xml
<component_scaffolding>
  <analysis>
    <project_structure>
      - Identify component framework and version
      - Analyze existing component patterns
      - Determine styling approach
      - Check naming conventions
    </project_structure>
    
    <component_design>
      - Define component props and interfaces
      - Plan component state management
      - Identify child components needed
      - Design component API
    </component_design>
  </analysis>
  
  <generation>
    <source_files>
      - Create main component file
      - Generate TypeScript interfaces if applicable
      - Create styled-components or CSS modules
      - Add prop validation and default props
    </source_files>
    
    <supporting_files>
      - Generate test files with basic test cases
      - Create Storybook stories for component
      - Add component documentation
      - Create index file for exports
    </supporting_files>
    
    <integration>
      - Update parent component imports
      - Add to component library index
      - Register with routing if applicable
      - Update type definitions
    </integration>
  </generation>
  
  <styling>
    <responsive_design>
      - Implement mobile-first approach
      - Add breakpoint-specific styles
      - Ensure accessibility compliance
      - Test across different screen sizes
    </responsive_design>
    
    <theme_integration>
      - Use design system tokens
      - Implement dark/light mode support
      - Apply consistent spacing and typography
      - Add proper focus and hover states
    </theme_integration>
  </styling>
  
  <testing>
    <unit_tests>
      - Test component rendering
      - Test prop handling and validation
      - Test user interactions
      - Test error states and edge cases
    </unit_tests>
    
    <visual_tests>
      - Create Storybook stories for all variants
      - Add visual regression tests
      - Test accessibility with screen readers
      - Verify responsive behavior
    </visual_tests>
  </testing>
</component_scaffolding>
```

## Validation
- [ ] Component renders without errors
- [ ] All props work as expected
- [ ] Styling matches design system
- [ ] Tests pass and provide good coverage
- [ ] Storybook stories work correctly
- [ ] Accessibility standards met
- [ ] Responsive design implemented
- [ ] Documentation is complete

## Examples
```bash
/project:scaffold-component Button
/project:scaffold-component UserCard --type=container --with-state
/project:scaffold-component Modal --with-animation --accessibility
/project:scaffold-component DataTable --complex --with-pagination
```

## Output
- Complete component implementation
- Test files with comprehensive coverage
- Storybook stories for all variants
- Documentation and usage examples
- Integration with existing component library