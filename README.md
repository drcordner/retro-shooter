# Gorilla vs Godzilla: Retro 2D Platform Shooter

A retro-style 2D side-scrolling platform shooter game featuring a heroic gorilla protagonist fighting through 100 levels of increasingly challenging enemies in a multiverse jungle setting.

## Live Demo
Play the game at: [https://andrejsvsgodzilla.netlify.app/](https://andrejsvsgodzilla.netlify.app/)

## Repository
Source code available at: [https://github.com/drcordner/retro-shooter](https://github.com/drcordner/retro-shooter)

## Game Features
- 100 unique levels with different dimensional jungle themes
- Retro pixel art style with vibrant color palettes
- Multiple enemy types including Godzilla variants and dogs
- Power-ups and special abilities
- Progressive difficulty system
- Boss battles every 10 levels
- Mobile-friendly with touch controls

## Controls
### Desktop
- Movement: Arrow keys or WASD
- Jump: Spacebar (hold for higher jump)
- Shoot: Mouse click or Z key
- Special Attack: X key (chest beat power-up)
- Start Game: S key
- Restart: R key (when game over)

### Mobile
- Movement: Left/Right touch buttons
- Jump: Jump button
- Shoot: Shoot button
- Start/Restart: On-screen buttons

## Setup
1. Clone this repository
2. Open `index.html` in a modern web browser
3. No additional dependencies required!

## Development
This game is built using:
- HTML5 Canvas for rendering
- Vanilla JavaScript for game logic
- CSS for styling

## Project Structure
```
├── index.html          # Main game HTML file
├── css/
│   └── style.css      # Game styles
├── js/
│   ├── game.js        # Main game logic
│   ├── player.js      # Player (Kong) class
│   ├── enemies.js     # Enemy classes
│   ├── levels.js      # Level management
│   └── utils.js       # Utility functions
└── assets/            # Game assets (sprites, sounds)
```

## Deployment
The game is automatically deployed to Netlify when changes are pushed to the main branch. The deployment process is configured in `netlify.toml`.

## License
MIT License - Feel free to use and modify! 