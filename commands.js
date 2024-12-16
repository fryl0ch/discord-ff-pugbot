import 'dotenv/config';
import { getMaps } from './pickup-game.js';
import { InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getMaps();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: choice,
      value: choice,
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const nominate = {
  name: 'nominate',
  description: 'nominate a map',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Time to choose...',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, nominate];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
