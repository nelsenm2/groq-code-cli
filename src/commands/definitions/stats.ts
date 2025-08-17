import { CommandDefinition } from '../base.js';

export const statsCommand: CommandDefinition = {
  command: 'stats',
  description: 'Show current session statistics and loop prevention limits',
  handler: (context) => {
    // This will be handled in the Chat component since we need access to the agent
    context.addMessage({
      role: 'system',
      content: 'Displaying session statistics...',
    });
  },
};