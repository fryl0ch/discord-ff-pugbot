import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Consult the all-knowing oracle of wisdom')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question upon which you would like to seek the guidance of the oracle')
        .setMaxLength(420));

export const execute = async function (interaction) {
  let prefix = "";
  if (interaction.options.getString('question'))
    prefix += interaction.options.getString('question') + " ";
  await interaction.reply(prefix + eightBall());
}

export function eightBall()
{
  const options = {
    yes: [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      ],
    maybe: [
      "Reply hazy, try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again"
      ],
    no: [
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful"
    ]
  }

  const d20roll = (Number.parseInt(1+(Math.random()*19)));
  
  return [...options.yes, ...options.maybe, ...options.no][d20roll];
}