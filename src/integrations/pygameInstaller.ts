import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface InstallationResult {
  success: boolean;
  message: string;
  version?: string;
  stdout: string;
  stderr: string;
}

export class PygameInstaller {
  /**
   * Install Pygame via pip
   */
  async installPygame(): Promise<InstallationResult> {
    try {
      const { stdout, stderr } = await execAsync('pip install pygame');

      // Verify installation
      await execAsync('python -c "import pygame; print(pygame.__version__)"');

      return {
        success: true,
        message: 'Pygame installed successfully',
        stdout,
        stderr,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to install Pygame',
        stdout: '',
        stderr: (error as Error).message,
      };
    }
  }

  /**
   * Check if Pygame is installed
   */
  async isPygameInstalled(): Promise<boolean> {
    try {
      await execAsync('python -c "import pygame"');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get Pygame version
   */
  async getPygameVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync(
        'python -c "import pygame; print(pygame.__version__)"'
      );
      return stdout.trim();
    } catch {
      return null;
    }
  }

  /**
   * Create a basic Pygame project
   */
  createBasicProject(projectName: string): string {
    return `import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("${projectName}")

# Clock for FPS
clock = pygame.time.Clock()
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Player
player_rect = pygame.Rect(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2, 50, 50)
player_speed = 5

def handle_events():
    """Handle user input and window events."""
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            return False
    return True

def update():
    """Update game logic."""
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]:
        player_rect.y -= player_speed
    if keys[pygame.K_DOWN]:
        player_rect.y += player_speed
    if keys[pygame.K_LEFT]:
        player_rect.x -= player_speed
    if keys[pygame.K_RIGHT]:
        player_rect.x += player_speed

    # Keep player on screen
    player_rect.clamp_ip(screen.get_rect())

def draw():
    """Draw game elements."""
    screen.fill(WHITE)
    pygame.draw.rect(screen, RED, player_rect)
    pygame.display.flip()

def main():
    """Main game loop."""
    running = True
    while running:
        running = handle_events()
        update()
        draw()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
`;
  }

  /**
   * Create a Pygame project with Godot integration support
   */
  createGodotIntegratedProject(projectName: string): string {
    return `"""
Pygame + Godot Integration Project

This project demonstrates how to use Pygame with external data from Godot
or prepare game assets that can be imported into Godot.
"""

import pygame
import json
import sys
from pathlib import Path

pygame.init()

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("${projectName} - Pygame + Godot")
clock = pygame.time.Clock()

# Game config
CONFIG_FILE = "game_config.json"

class GameConfig:
    def __init__(self, config_path: str):
        self.config = self.load_config(config_path)
    
    def load_config(self, path: str) -> dict:
        """Load configuration from JSON file."""
        if Path(path).exists():
            with open(path, 'r') as f:
                return json.load(f)
        return self.default_config()
    
    def default_config(self) -> dict:
        return {
            "game_name": "${projectName}",
            "width": SCREEN_WIDTH,
            "height": SCREEN_HEIGHT,
            "fps": 60,
            "assets_path": "assets/"
        }
    
    def export_for_godot(self, export_path: str = "godot_export.json"):
        """Export game config in Godot-compatible format."""
        godot_config = {
            "game_name": self.config.get("game_name"),
            "screen": {
                "width": self.config.get("width"),
                "height": self.config.get("height")
            },
            "fps": self.config.get("fps")
        }
        with open(export_path, 'w') as f:
            json.dump(godot_config, f, indent=2)

class Player:
    def __init__(self, x: float, y: float, width: int, height: int):
        self.rect = pygame.Rect(x, y, width, height)
        self.vel_x = 0
        self.vel_y = 0
        self.speed = 5
    
    def handle_input(self):
        keys = pygame.key.get_pressed()
        self.vel_x = 0
        self.vel_y = 0
        if keys[pygame.K_UP]:
            self.vel_y = -self.speed
        if keys[pygame.K_DOWN]:
            self.vel_y = self.speed
        if keys[pygame.K_LEFT]:
            self.vel_x = -self.speed
        if keys[pygame.K_RIGHT]:
            self.vel_x = self.speed
    
    def update(self, screen_rect):
        self.rect.x += self.vel_x
        self.rect.y += self.vel_y
        self.rect.clamp_ip(screen_rect)
    
    def draw(self, surface: pygame.Surface):
        pygame.draw.rect(surface, (255, 0, 0), self.rect)

def main():
    config = GameConfig(CONFIG_FILE)
    player = Player(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2, 50, 50)
    
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        player.handle_input()
        player.update(screen.get_rect())
        
        screen.fill((255, 255, 255))
        player.draw(screen)
        pygame.display.flip()
        clock.tick(config.config.get("fps", 60))
        
        # Export config for Godot on each frame (for testing)
        config.export_for_godot()
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
`;
  }
}

export const pygameInstaller = new PygameInstaller();
