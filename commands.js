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

// start a pickup
const TEST_COMMAND = {
  name: 'pickup',
  description: 'start a pickup game (if there is not one already running)',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// choose a map
const NOMINATE_COMMAND = {
  name: 'nominate',
  description: 'nominate a map',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'nominate a map for the pool to vote on if/when the pug fills',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, NOMINATE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
