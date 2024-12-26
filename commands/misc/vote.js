import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js';

const now = function() {
  return (new Date()).getMilliseconds();
}


let startTime = now();
let vote_results = {};

let options = [];
let options_kv = {};

let vote_reason;

export var vote_counts = {};

export function getVoteCountFor(value)
{
  if (vote_results[value])
    return vote_results[value].length;
  else return 0;
}

const emojiOpts = {
  1: "1️⃣",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣"
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
        .setMaxLength(420).setRequired(false));

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

  let voteMessage = await interaction.reply({
    embeds: [voteEmbed],
    components: [vote_row]
  });

  vote_counts = {};
  listenForVotes(voteMessage, 5_000);
}

const updateVoteCounts = async function(voteMessage, done=false)
{
  let resultsEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(vote_reason);
  if (Object.keys(vote_results).length > 0)
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

  //await interaction.editReply("Results:\n" + vote_counts_str);
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
    let voteWatcher = await voteMessage.awaitMessageComponent({time: (duration_ms - (startTime - now())) });
    // let you vote multiple times to test this...
    if (! vote_results[voteWatcher.customId] ) vote_results[voteWatcher.customId] = [];
    vote_results[voteWatcher.customId].push(voteWatcher.member.displayName);
    await voteWatcher.deferUpdate();
    await updateVoteCounts(voteMessage);
    let elapsed_time = now() - startTime;

    if (elapsed_time < duration_ms)
    {
      listenForVotes(voteMessage, (duration_ms - elapsed_time));
    }
  } catch (error) {
    if (error.code === 'InteractionCollectorError') // out of time
    {
      console.log('voting finished');
      let update = await updateVoteCounts(voteMessage, true);
      await update.channel.send('Voting has ended.');
    }
    else
      throw error;
  }
}