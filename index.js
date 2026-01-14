const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const GENERAL_CHANNEL_ID = process.env.GENERAL_CHANNEL_ID;
const RESULTS_CHANNEL_ID = process.env.RESULTS_CHANNEL_ID;

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(GENERAL_CHANNEL_ID);

  const button = new ButtonBuilder()
    .setCustomId("verify_button")
    .setLabel("Verify Name")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  await channel.send({
    content: "Click the button below to verify your name:",
    components: [row]
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton() && interaction.customId === "verify_button") {
    const modal = new ModalBuilder()
      .setCustomId("verify_modal")
      .setTitle("Name Verification");

    const input = new TextInputBuilder()
      .setCustomId("name_input")
      .setLabel("Enter your name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === "verify_modal") {
    const name = interaction.fields.getTextInputValue("name_input");
    const results = await client.channels.fetch(RESULTS_CHANNEL_ID);

    await results.send(
      `📩 **New Verification**\nUser: ${interaction.user.tag}\nName: **${name}**`
    );

    await interaction.reply({
      content: "✅ Your name was submitted!",
      ephemeral: true
    });
  }
});

client.login(TOKEN);