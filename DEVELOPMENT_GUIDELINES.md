# Development Guidelines for "Andrejs vs Godzilla"

## Project Overview
A retro 2D platform shooter game built with HTML5 Canvas, JavaScript, and modern web technologies.

## Architecture

### Core Components
1. **Game Loop**
   - Fixed time step (60 FPS)
   - Accumulator pattern for consistent physics
   - Maximum update steps per frame (5) to prevent spiral of death

2. **Player System**
   - Health and lives management
   - Power-up system
   - Movement and collision detection
   - Temporary invincibility after damage

3. **Enemy System**
   - Multiple enemy types (Godzilla, Dog, Boss)
   - AI behaviors
   - Projectile system

4. **Level System**
   - Platform-based level design
   - Progressive difficulty
   - Power-up placement

## Best Practices

### Code Organization
1. **Class Structure**
   - Each major game component should be in its own class
   - Clear separation of concerns
   - Consistent method naming conventions

2. **State Management**
   - Game state should be centralized
   - Clear state transitions
   - Proper cleanup of resources

### Performance Considerations
1. **Game Loop**
   - Use requestAnimationFrame
   - Implement fixed time step
   - Cap maximum update steps
   - Use accumulator pattern

2. **Collision Detection**
   - Implement broad-phase collision detection
   - Use efficient collision checks
   - Handle multiple collision types separately

### Game Design Patterns
1. **Power-up System**
   - Clear duration management
   - Visual feedback
   - Stackable effects
   - Proper cleanup

2. **Enemy AI**
   - Level-based difficulty scaling
   - Clear attack patterns
   - Proper cooldown management

## Common Issues and Solutions

### Health System
1. **Multiple Damage Sources**
   - Implement temporary invincibility
   - Use damage amount parameter
   - Check shield and invincibility states

2. **Visual Feedback**
   - Add glow effect during invincibility
   - Clear health display
   - Proper UI updates

### Collision Detection
1. **Multiple Collisions**
   - Separate collision checks for different types
   - Proper cleanup of collided objects
   - Handle edge cases

2. **Projectile Management**
   - Clear projectile lifecycle
   - Proper cleanup
   - Damage application

## Working with AI Agent

### Best Practices
1. **Clear Communication**
   - Provide specific requirements
   - Ask for clarification when needed
   - Review changes before accepting

2. **Code Review**
   - Check for edge cases
   - Verify performance implications
   - Ensure proper error handling

3. **Testing**
   - Test changes incrementally
   - Verify all affected systems
   - Check for regressions

### Common Tasks
1. **Adding New Features**
   - Describe the feature clearly
   - Specify any dependencies
   - Consider performance impact

2. **Bug Fixes**
   - Provide reproduction steps
   - Describe expected behavior
   - Check related systems

3. **Refactoring**
   - Maintain existing functionality
   - Update related components
   - Test thoroughly

## Development Rules

### Code Style
1. **Naming Conventions**
   - Use camelCase for variables and methods
   - Use PascalCase for classes
   - Use descriptive names

2. **Comments**
   - Document complex logic
   - Explain non-obvious decisions
   - Keep comments up to date

3. **Error Handling**
   - Use proper error checks
   - Provide meaningful error messages
   - Handle edge cases

### Game Design
1. **Difficulty Progression**
   - Scale difficulty with level
   - Provide clear feedback
   - Balance power-ups

2. **User Experience**
   - Clear visual feedback
   - Responsive controls
   - Proper game state management

## Future Improvements

### Planned Features
1. **Game Mechanics**
   - Additional enemy types
   - More power-ups
   - Boss battles

2. **Visual Improvements**
   - Sprite animations
   - Particle effects
   - Better visual feedback

3. **Audio**
   - Sound effects
   - Background music
   - Audio feedback

### Technical Improvements
1. **Performance**
   - Optimize collision detection
   - Improve rendering
   - Better resource management

2. **Code Quality**
   - Add unit tests
   - Improve error handling
   - Better documentation

## Lessons Learned

### Development Process
1. **Incremental Development**
   - Build features step by step
   - Test each change
   - Maintain working state

2. **Bug Prevention**
   - Consider edge cases
   - Implement proper checks
   - Test thoroughly

3. **Code Organization**
   - Keep related code together
   - Clear separation of concerns
   - Maintainable structure

### Game Design
1. **Player Experience**
   - Clear feedback
   - Fair difficulty
   - Proper progression

2. **Technical Implementation**
   - Efficient algorithms
   - Proper resource management
   - Scalable architecture

## Conclusion
This document serves as a living guide for the project. Update it as new lessons are learned and best practices are established. Use it to maintain consistency and quality throughout development. 