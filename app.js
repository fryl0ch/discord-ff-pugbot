import fs from 'node:fs';
import path, { parse } from 'node:path';
import Module from "node:module";
const require = Module.createRequire(import.meta.url);
const __dirname = import.meta.dirname;

const { token, lifecycle_channel_id, pug_channel_id } = require('./config.json');
import { Client, Collection, Events, GatewayIntentBits, MessageFlags} from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const command_aliases = require('./command-aliases.json');

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const eventsPath = path.join(__dirname, 'events');
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  //client.channels.cache.get(lifecycle_channel_id).send('pugbot started');
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});

client.on("messageCreate", message => {
  if(message.author.bot) // YO
    return;

  const slashCommandOptionTypes = {
    1: "SUB_COMMAND",
    2: "SUB_COMMAND_GROUP",
    3: "STRING",
    4: "INTEGER",
    5: "BOOLEAN",
    6: "USER",
    7: "CHANNEL",
    8: "ROLE",
    9: "MENTIONABLE",
    10: "NUMBER",
    11: "ATTACHMENT"
  }

  if(message.content.startsWith("!")){
    let message_cmd = message.content.split(' ')[0].replace('!','');

    let aliased_command = checkIfCommandIsAnAlias(message_cmd);

    if (aliased_command)
      message_cmd = aliased_command;

    const the_command = client.commands.find((command) => command.data.name === message_cmd);

    if (the_command)
    {
      let passed_opts = parseOptsFromString(message.content).split(' ');

      let parsed_opts = {};

      for (let option of the_command.data.options)
      {
        let index = the_command.data.options.indexOf(option)+1;
        if (slashCommandOptionTypes[option.type] === "STRING")
        {
          parsed_opts[option.name] = passed_opts[index];
        }
        else if (slashCommandOptionTypes[option.type] === "INTEGER")
        {
          parsed_opts[option.name] = Number.parseInt(passed_opts[index]);
        }
        else if (slashCommandOptionTypes[option.type] === "NUMBER")
        {
          parsed_opts[option.name] = Number.parseFloat(passed_opts[index]);
        }
        else if (slashCommandOptionTypes[option.type] === "BOOLEAN")
        {
          parsed_opts[option.name] = (passed_opts[index].toLowerCase() === 'true');
        }
        else if (slashCommandOptionTypes[option.type] === "USER")
        {
          parsed_opts[option.name] = message.channel.members.find((user) => {
            return user.displayName === passed_opts[index] || user.id === passed_opts[index].match(/[0-9]+/)[0] || user.id === passed_opts[index] || user.username === passed_opts[index];
          });
        }
      }

      the_command.execute(message, parsed_opts);
    }
    else
      message.reply({content: `command '${message.content}' not found`});
  }
});

function checkIfCommandIsAnAlias(command) {

  const aliased = Object.keys(command_aliases).filter((c) => {
    if (command_aliases[c])
      if (command_aliases[c].includes(command) || command_aliases[c].includes(command))
        return true;
      else
        return false;
    else
      return false;
  });

  if (aliased.length === 1)
  {
    let actual_command = aliased.pop();
    return actual_command;
  }
  else
    return false;
}

function parseOptsFromString(commandString)
{
  let quotedRegex = /["'](.+)["']/;

  let replacer = function (match, p1)
  {
    return p1.replaceAll(" ", "_");
  }
  // replace all spaces in a quoted value with _

  commandString = commandString.replace(quotedRegex, replacer);

  // split on " "
  // replace _ with " " within string arguments
  
  return commandString;
}

client.login(token);
