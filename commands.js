import 'dotenv/config';
import { getMaps } from './pickup-game.js';
import { InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createNominateChoices() {
  const choices = getMaps().filter((map_name) => {
    if (map_name.includes['nyx'] || map_name.includes['openfire'] || map_name.includes['2fort'])
      return true;
    else
      return false;
  });

  console.log('choices:', choices);

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
const PICKUP_COMMAND = {
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
      name: 'map',
      description: 'nominate a map for the pool to vote on if/when the pug fills',
      required: true,
      choices: createNominateChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [PICKUP_COMMAND, NOMINATE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
