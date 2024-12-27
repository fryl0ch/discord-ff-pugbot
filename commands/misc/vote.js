import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js';

const now = function() {
  return (new Date()).valueOf();
}

class Poll {
  startTime = now();
  vote_results = {};

  options = [];
  options_kv = {};

  updateInterval;

  vote_duration = 30; // in seconds

  getVoteCountFor(value)
  {
    if (this.vote_results[value])
      return this.vote_results[value].length;
    else return 0;
  }

  clearUpdateInterval() {
      clearInterval(this.updateInterval);
  }

  async listenForVotes(voteMessage, duration_ms) {
    try {
      console.log('vote started ', 'duration_ms', duration_ms)
      let voteWatcher = await voteMessage.awaitMessageComponent({time: (this.vote_duration*1_000) - (now() - this.startTime) });
      voteWatcher.deferUpdate();
      // only one vote per voter
      for (let option of Object.keys(this.vote_results))
        if (this.vote_results[option].includes(voteWatcher.member.displayName))
          this.vote_results[option] = this.vote_results[option].filter(o => o !== voteWatcher.member.displayName);

      if (! this.vote_results[voteWatcher.customId] ) this.vote_results[voteWatcher.customId] = [];
      this.vote_results[voteWatcher.customId].push(voteWatcher.member.displayName);
      await updateVoteCounts(this, voteMessage,false);

      let elapsed_time = now() - this.startTime;
      if (elapsed_time < duration_ms)
      {
        let time_left = ((this.vote_duration * 1_000) - elapsed_time);
        console.log('vote recieved, listing for ' + time_left + " more ms");
        await this.listenForVotes(voteMessage, time_left);
      }
    } catch (error) {
      if (error.code === 'InteractionCollectorError') // out of time
      {
        console.log('voting finished');
        await updateVoteCounts(this, voteMessage, true);
        voteMessage.reply('Voting has ended.');
      }
      else
        throw error;
    }  
  }
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
  let the_poll = new Poll();

  the_poll.vote_reason = interaction.options.getString('question');

  if (interaction.options.getString('option1')) 
  {
    the_poll.push(interaction.options.getString('option1'));
    the_poll.vote_1 = interaction.options.getString('option1');
  }
  if (interaction.options.getString('option2'))
  {
    the_poll.options.push(interaction.options.getString('option2'));
    the_poll.options_kv.vote_2 = interaction.options.getString('option2');
  }
  if (interaction.options.getString('option3'))
  {
    the_poll.options.push(interaction.options.getString('option3'));
    the_poll.options_kv.vote_3 = interaction.options.getString('option3');
  }
  if (interaction.options.getString('option4'))
  {
    the_poll.options.push(interaction.options.getString('option4'));
    the_poll.options_kv.vote_4 = interaction.options.getString('option4');
  }
  if (interaction.options.getString('option5'))
  {
    the_poll.options.push(interaction.options.getString('option5'));
    the_poll.options_kv.vote_5 = interaction.options.getString('option5');
  }

  if (interaction.options.getInteger('duration'))
    the_poll.vote_duration = Number.parseInt(interaction.options.getInteger('duration'));


  const voteEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(the_poll.vote_reason);

  let counter = 1;
  let vote_row = new ActionRowBuilder();

  if (the_poll.options.filter(o => o).length > 0)
  {
    for (let option of the_poll.options.filter(o => o))
    {
      voteEmbed.addFields({name: " ", value: option});

      const vote_button = new ButtonBuilder()
        .setCustomId(`vote_${counter}`)
        .setLabel(option + " (" + this.getVoteCountFor(option) + ")")
        .setStyle(ButtonStyle.Secondary);
      vote_row.addComponents(vote_button);
      counter++;
    }
  } 
  else 
  {
    const yes_vote_value = "Yes ✅";
    const no_vote_value = "No ❌";

    the_poll.options = [yes_vote_value, no_vote_value];
    the_poll.options_kv = {vote_1: yes_vote_value, vote_2: no_vote_value};
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

  for (let option of Object.keys(the_poll.options_kv))
  {
    the_poll.vote_results[option] = [];
  }

  the_poll.updateInterval = setInterval(updateVoteCounts, 5_000, the_poll, voteMessage);
  setTimeout(clearInterval, (the_poll.vote_duration*1000) - 4_000, the_poll.updateInterval);

  await the_poll.listenForVotes(voteMessage, the_poll.vote_duration*1_000);
}

async function updateVoteCounts(poll, voteMessage, done=false)
  {
    let resultsEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(poll.vote_reason);

    if (!done)
      resultsEmbed.addFields({name: " ", value: `⏳ time remaining: ${Math.round(( (poll.vote_duration*1_000) - (now() - poll.startTime) )/1000)} seconds`});
    else
      resultsEmbed.addFields({name: " ", value: `voting has ended.`});

    if (Object.keys(poll.vote_results).length)
    {
      for (let result of Object.keys(poll.vote_results))
      {
        resultsEmbed.addFields({name: " ", value: `${poll.options_kv[result]} recieved ${poll.getVoteCountFor(result)} vote${poll.getVoteCountFor(result) > 1 ? 's' : ''}`});
      }
    }
    else
      resultsEmbed.addFields({name: " ", value: `no votes were cast`});

    let vote_row = new ActionRowBuilder();

    if (poll.options.filter(o => o).length > 0)
    {
      let counter = 1;
      for (let option of poll.options)
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