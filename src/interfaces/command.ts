import { AutocompleteInteraction, CommandInteraction } from '@slash.js/core';

export interface Command {
    description: string;
    name: string;
    options?: CommandOptions[] | CommandGroups[] | Options[];
    execute?: (interaction: CommandInteraction) => void;
}

export interface CommandOptions {
    type: 1;
    options?: Options[];
    name: string;
    description: string;
    execute: (interaction: CommandInteraction) => void;
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