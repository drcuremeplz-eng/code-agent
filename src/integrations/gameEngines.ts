export type GameEngine = 'godot' | 'unity' | 'unreal' | 'pygame';

export interface GameEngineConfig {
  name: string;
  language: string;
  scriptExtension: string;
  projectFile: string;
  buildCommand: string;
  runCommand: string;
}

export const GAME_ENGINE_CONFIGS: Record<GameEngine, GameEngineConfig> = {
  godot: {
    name: 'Godot',
    language: 'gdscript',
    scriptExtension: '.gd',
    projectFile: 'project.godot',
    buildCommand: 'godot --headless -e --export-release',
    runCommand: 'godot',
  },
  unity: {
    name: 'Unity',
    language: 'csharp',
    scriptExtension: '.cs',
    projectFile: 'ProjectSettings/ProjectSettings.asset',
    buildCommand: 'Unity -projectPath . -executeMethod BuildScript.Build',
    runCommand: 'Unity -projectPath .',
  },
  unreal: {
    name: 'Unreal Engine',
    language: 'cpp',
    scriptExtension: '.cpp',
    projectFile: '.uproject',
    buildCommand: 'UE4Editor-Cmd.exe -run=Cook',
    runCommand: 'UE4Editor.exe',
  },
  pygame: {
    name: 'Pygame',
    language: 'python',
    scriptExtension: '.py',
    projectFile: 'game.py',
    buildCommand: 'python -m PyInstaller --onefile game.py',
    runCommand: 'python game.py',
  },
};

export class GameEngineIntegration {
  static getConfig(engine: GameEngine): GameEngineConfig {
    return GAME_ENGINE_CONFIGS[engine];
  }

  static async createGameProject(
    engine: GameEngine,
    projectName: string
  ): Promise<string> {
    const config = this.getConfig(engine);
    const projectPath = `./${projectName}`;

    const template = this.generateProjectTemplate(engine, projectName);
    return template;
  }

  private static generateProjectTemplate(
    engine: GameEngine,
    projectName: string
  ): string {
    switch (engine) {
      case 'godot':
        return `# Godot Project: ${projectName}
[gd_scene load_steps=2 format=2]

[ext_resource type="Script" path="res://main.gd"]
[node name="${projectName}" type="Node"]
script = SubResource( 1 )

func _ready():
    print("Welcome to ${projectName}!")

func _process(delta):
    pass
`;
      case 'unity':
        return `using UnityEngine;

public class ${projectName} : MonoBehaviour {
    void Start() {
        Debug.Log("Welcome to ${projectName}!");
    }

    void Update() {
    }
}
`;
      case 'unreal':
        return `#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "${projectName}.generated.h"

UCLASS()
class ${projectName.toUpperCase()}_API A${projectName}GameMode : public AGameModeBase {
    GENERATED_BODY()
};
`;
      case 'pygame':
        return `import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("${projectName}")

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((255, 255, 255))
    pygame.display.flip()

pygame.quit()
`;
      default:
        return '';
    }
  }
}
