import TelegramBot from '@codebam/cf-workers-telegram-bot';

interface Environment {
  SECRET_TELEGRAM_API_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Environment, ctx: ExecutionContext): Promise<Response> {
    const bot = new TelegramBot(env.SECRET_TELEGRAM_API_TOKEN);
    
    // Handle /start command
    bot.command('start', async (context) => {
      await context.reply('Welcome to Voice to Text bot! Send me a voice message and I\'ll convert it to text.');
      return new Response('ok');
    });
    
    // Handle /help command
    bot.command('help', async (context) => {
      await context.reply('Send me a voice message and I\'ll convert it to text for you!');
      return new Response('ok');
    });
    
    // Handle messages (including voice messages)
    bot.on('message', async (context) => {
      if (context.update.message?.voice) {
        await context.reply('I received your voice message! Processing...');
        // Here you would add your voice-to-text processing logic
        await context.reply('Voice to text feature is coming soon!');
      } else if (context.update.message?.text) {
        await context.reply(`You said: ${context.update.message.text}`);
      } else {
        await context.reply('I received your message, but I can only process text and voice messages.');
      }
      return new Response('ok');
    });
    
    try {
      // Process the webhook request
      return await bot.handle(request);
    } catch (error) {
      console.error('Error handling webhook:', error);
      return new Response(`Error: ${error}`, { status: 500 });
    }
  }
}