import { CommandInteraction, ServerEvents } from '@slash.js/core';

export interface HandlerEvents extends ServerEvents {
    commandError(interaction: CommandInteraction, error: unknown): unknown;
}