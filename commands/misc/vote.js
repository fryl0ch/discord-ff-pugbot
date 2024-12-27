import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js';

const now = function() {
  return (new Date()).valueOf();
}


let startTime;
let vote_results = {};

let options = [];
let options_kv = {};

let vote_reason;
let vote_duration = 30; // in seconds

export function getVoteCountFor(value)
{
  if (vote_results[value])
    return vote_results[value].length;
  else return 0;
}

export const data = new SlashCommandBuilder()
    .setName('vote')
    .setDescription('create a poll to be voted upon')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The reason for calling the vote')
        .setMaxLength(420).setRequired(true))
    .addStringOption(option =>
      option.setName('option1')
        .setDescription('The first option for the vote')
        .setMaxLength(420).setRequired(false))
    .addStringOption(option =>
      option.setName('option2')
        .setDescription('The second option for the vote')
        .setMaxLength(420).setRequired(false))
    .addStringOption(option =>
      option.setName('option3')
        .setDescription('The third option for the vote')
        .setMaxLength(420).setRequired(false))
    .addStringOption(option =>
      option.setName('option4')
        .setDescription('The fourth option for the vote')
        .setMaxLength(420).setRequired(false))
    .addStringOption(option =>
      option.setName('option5')
        .setDescription('The fifth option for the vote')
        .setMaxLength(420).setRequired(false))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The amount of time the poll is open for in seconds (default 30s)')
        .setMinValue(5) // min 5 seconds
        .setMaxValue(1800) // max 30 minutes
        .setRequired(false));

export const execute = async function (interaction) {
  startTime = now();
  vote_results = [];

  vote_reason = interaction.options.getString('question');

  options = [];
  options_kv = {};

  if (interaction.options.getString('option1')) 
  {
    options.push(interaction.options.getString('option1'));
    options_kv.vote_1 = interaction.options.getString('option1');
  }
  if (interaction.options.getString('option2'))
  {
    options.push(interaction.options.getString('option2'));
    options_kv.vote_2 = interaction.options.getString('option2');
  }
  if (interaction.options.getString('option3'))
  {
    options.push(interaction.options.getString('option3'));
    options_kv.vote_3 = interaction.options.getString('option3');
  }
  if (interaction.options.getString('option4'))
  {
    options.push(interaction.options.getString('option4'));
    options_kv.vote_4 = interaction.options.getString('option4');
  }
  if (interaction.options.getString('option5'))
  {
    options.push(interaction.options.getString('option5'));
    options_kv.vote_5 = interaction.options.getString('option5');
  }

  if (interaction.options.getInteger('duration'))
    vote_duration = Number.parseInt(interaction.options.getInteger('duration'));

  const voteEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    //.setTitle(vote_reason)
    .setTitle(vote_reason);

  let counter = 1;
  let vote_row = new ActionRowBuilder();

  if (options.filter(o => o).length > 0)
  {
    for (let option of options.filter(o => o))
    {
      voteEmbed.addFields({name: " ", value: option});

      const vote_button = new ButtonBuilder()
        .setCustomId(`vote_${counter}`)
        .setLabel(option + " (" + getVoteCountFor(option) + ")")
        .setStyle(ButtonStyle.Secondary);
      vote_row.addComponents(vote_button);
      counter++;
    }
  } 
  else 
  {
    const yes_vote_value = "Yes ✅";
    const no_vote_value = "No ❌";

    options = [yes_vote_value, no_vote_value];
    options_kv = {vote_1: yes_vote_value, vote_2: no_vote_value};
    const yes_vote_button = new ButtonBuilder()
      .setCustomId(`vote_1`)
      .setLabel(yes_vote_value)
      .setStyle(ButtonStyle.Secondary);
    const no_vote_button = new ButtonBuilder()
      .setCustomId(`vote_2`)
      .setLabel(no_vote_value)
      .setStyle(ButtonStyle.Secondary);
    vote_row.addComponents(yes_vote_button, no_vote_button);
  }

  await interaction.reply('starting vote...');
  let voteMessage = await interaction.channel.send({
    embeds: [voteEmbed],
    components: [vote_row]
  });

  for (let option of Object.keys(options_kv))
  {
    vote_results[option] = [];
  }

  await listenForVotes(voteMessage, vote_duration*1_000);
}

const updateVoteCounts = async function(voteMessage, done=false)
{
  let resultsEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(vote_reason);

  if (!done)
    resultsEmbed.addFields({name: " ", value: `⏳ time remaining: ${Math.round(( (vote_duration*1_000) - (now() - startTime) )/1000)} seconds`});
  else
    resultsEmbed.addFields({name: " ", value: `voting has ended.`});

  if (Object.keys(vote_results).length)
  {
    for (let result of Object.keys(vote_results))
    {
      resultsEmbed.addFields({name: " ", value: `${options_kv[result]} recieved ${getVoteCountFor(result)} vote${getVoteCountFor(result) > 1 ? 's' : ''}`});
    }
  }
  else
    resultsEmbed.addFields({name: " ", value: `no votes were cast`});

  let vote_row = new ActionRowBuilder();

  if (options.filter(o => o).length > 0)
  {
    let counter = 1;
    for (let option of options)
    {
      //console.log('id:', counter, 'opt:', option);
      const vote_button = new ButtonBuilder()
        .setCustomId(`vote_${counter}`)
        .setLabel(option)
        .setStyle(ButtonStyle.Secondary);
      vote_row.addComponents(vote_button);
      counter++;
    }
  }

  if (!done)
  {
    return await voteMessage.edit({
      embeds: [resultsEmbed],
      components: [vote_row] 
    });
  }
  else
  {
    return await voteMessage.edit({
      embeds: [resultsEmbed],
      components: [] // remove vote buttons
    });
  }
}

const listenForVotes = async function(voteMessage, duration_ms) {
  try {
    console.log('vote started ', 'duration_ms', duration_ms)
    let voteWatcher = await voteMessage.awaitMessageComponent({time: (vote_duration*1_000) - (now() - startTime) });
    voteWatcher.deferUpdate();
    // only one vote per voter
    for (let option of Object.keys(vote_results))
      if (vote_results[option].includes(voteWatcher.member.displayName))
        vote_results[option] = vote_results[option].filter(o => o !== voteWatcher.member.displayName);

    if (! vote_results[voteWatcher.customId] ) vote_results[voteWatcher.customId] = [];
    vote_results[voteWatcher.customId].push(voteWatcher.member.displayName);
    await updateVoteCounts(voteMessage,false);

    let elapsed_time = now() - startTime;
    if (elapsed_time < duration_ms)
    {
      let time_left = ((vote_duration * 1_000) - elapsed_time);
      console.log('vote recieved, listing for ' + time_left + " more ms");
      await listenForVotes(voteMessage, time_left);
    }
  } catch (error) {
    if (error.code === 'InteractionCollectorError') // out of time
    {
      console.log('voting finished', error);
      await updateVoteCounts(voteMessage, true);
      await voteMessage.reply('Voting has ended.');
    }
    else
      throw error;
  }
}