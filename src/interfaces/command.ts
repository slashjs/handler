import { AutocompleteInteraction, CommandInteraction } from '@slash.js/core';

export type Command = {
    description: string;
    name: string;
    options?: Options[] | CommandOptions[] | CommandGroups[];
    onBeforeExecute?: (interaction: CommandInteraction) => Promise<boolean> | boolean;
    execute?: (interaction: CommandInteraction) => Promise<unknown> | unknown;
    onCancelExecute?: (interaction: CommandInteraction) => Promise<unknown> | unknown;
    onErrorExecute?: (interaction: CommandInteraction, error: unknown) => Promise<unknown> | unknown;
};

export interface CommandOptions {
    type: 1;
    options?: Options[];
    name: string;
    description: string;
    onBeforeExecute?: (interaction: CommandInteraction) => Promise<boolean> | boolean;
    execute?: (interaction: CommandInteraction) => Promise<unknown> | unknown;
    onCancelExecute?: (interaction: CommandInteraction) => Promise<unknown> | unknown;
    onErrorExecute?: (interaction: CommandInteraction, error: unknown) => Promise<unknown> | unknown;
}

export interface CommandGroups {
    type: 2;
    options: CommandOptions[] | CommandGroups[];
    name: string;
    description: string;
}

export interface Options {
    type: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    name: string;
    description: string;
    required?: boolean;
    choices?: Choice[];
    channel_types?: number[];
    min_value?: number;
    max_value?: number;
    autocomplete?: boolean;
    onAutocomplete?: (interaction: AutocompleteInteraction) => void;
}

export interface Choice {
    name: string;
    type: 4;
    value?: string | number;
    focused?: boolean;
}