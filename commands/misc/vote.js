import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags} from 'discord.js';

const now = function() {
  return (new Date()).getMilliseconds();
}


let startTime = now();
let vote_results = [];

let options = [];
let options_kv = [];

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

  const vote_reason = interaction.options.getString('question');

  options = [ 
    interaction.options.getString('option1'),
    interaction.options.getString('option2'),
    interaction.options.getString('option3'),
    interaction.options.getString('option4'),
    interaction.options.getString('option5')
  ];

  options_kv = {
    vote_1:interaction.options.getString('option1'),
    vote_2:interaction.options.getString('option2'),
    vote_3:interaction.options.getString('option3'),
    vote_4:interaction.options.getString('option4'),
    vote_5:interaction.options.getString('option5'),
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
      let vote_value = `${emojiOpts[counter]} ${option}`;
      voteEmbed.addFields({name: " ", value: vote_value});

      const vote_button = new ButtonBuilder()
        .setCustomId(`vote_${counter}`)
        .setLabel(vote_value)
        .setStyle(ButtonStyle.Secondary);
      vote_row.addComponents(vote_button);
      counter++;
    }
  } else {
    const yes_vote_value = "✅ Yes!";
    const no_vote_value = "❌ No."

    options = [yes_vote_value, no_vote_value];
    options_kv = {vote_yes: yes_vote_value, vote_no: no_vote_value};
    const yes_vote_button = new ButtonBuilder()
      .setCustomId(`vote_yes`)
      .setLabel(yes_vote_value)
      .setStyle(ButtonStyle.Secondary);
    const no_vote_button = new ButtonBuilder()
      .setCustomId(`vote_no`)
      .setLabel(no_vote_value)
      .setStyle(ButtonStyle.Secondary);
    vote_row.addComponents(yes_vote_button, no_vote_button);
  }

  let voteMessage = await interaction.reply({
    embeds: [voteEmbed],
    components: [vote_row]
  });

  
  let results = await listenForVotes(voteMessage, 7_000);
  let vote_counts = {};
  let resultsEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    //.setTitle(vote_reason)
    .setTitle(vote_reason);
  if (results.length > 0)
  {
    for (let vote of results)
    {
      if (vote_counts[vote.vote])
        vote_counts[vote.vote] += 1;
      else
        vote_counts[vote.vote] = 1;
    }

    for (let result of Object.keys(vote_counts))
    {
      resultsEmbed.addFields({name: " ", value: `${options_kv[result]} recieved ${vote_counts[result]} vote${vote_counts[result] > 1 ? 's' : ''}`});
    }
  }
  else
    resultsEmbed.addFields({name: " ", value: `no votes were cast`});


  //await interaction.editReply("Results:\n" + vote_counts_str);
  //await interaction.channel.send("Voting has finished. \nResults: " + vote_counts_str);
  await voteMessage.edit({
    embeds: [resultsEmbed],
    components: []
  });
}

const listenForVotes = async function(voteMessage, duration_ms) {
  try {
    let voteWatcher = await voteMessage.awaitMessageComponent({time: (duration_ms - (startTime - now())) });
    let previousVote = vote_results.find((vote) => vote.voter === voteWatcher.member.displayName);
    if (previousVote)
      previousVote.vote = voteWatcher.customId;
    else
      vote_results.push({voter: voteWatcher.member.displayName, vote: voteWatcher.customId});
    await voteWatcher.deferUpdate();
    let elapsed_time = now() - startTime;

    if (elapsed_time < duration_ms)
    {
        await listenForVotes(voteMessage, (duration_ms - elapsed_time));
    }
  } catch (error) {
    if (error.code === 'InteractionCollectorError')
      return vote_results;
    else
      throw error;
  }

  return vote_results;
}