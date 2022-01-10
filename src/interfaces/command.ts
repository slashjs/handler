import {
    AutocompleteInteraction, CommandInteraction,
    MessageContextInteraction, UserContextInteraction
} from '@slash.js/core';

export type ResolvableCommand = Command | ContextMenuMessage | ContextMenuUser;

export type Command = {
    type: 1;
    description: string;
    name: string;
    options?: Options[] | CommandOptions[] | CommandGroups[];
    onBeforeExecute?: (interaction: CommandInteraction) => Promise<boolean> | boolean;
    execute?: (interaction: CommandInteraction) => Promise<unknown> | unknown;
    onCancelExecute?: (interaction: CommandInteraction) => Promise<unknown> | unknown;
    onErrorExecute?: (interaction: CommandInteraction, error: unknown) => Promise<unknown> | unknown;
};

export type ContextMenuUser = {
    type: 2;
    name: string;
    onBeforeExecute?: (interaction: UserContextInteraction) => Promise<boolean> | boolean;
    execute: (interaction: UserContextInteraction) => Promise<unknown> | unknown;
    onCancelExecute?: (interaction: UserContextInteraction) => Promise<unknown> | unknown;
    onErrorExecute?: (interaction: UserContextInteraction, error: unknown) => Promise<unknown> | unknown;
};

export type ContextMenuMessage = {
    type: 3;
    name: string;
    onBeforeExecute?: (interaction: MessageContextInteraction) => Promise<boolean> | boolean;
    execute: (interaction: MessageContextInteraction) => Promise<unknown> | unknown;
    onCancelExecute?: (interaction: MessageContextInteraction) => Promise<unknown> | unknown;
    onErrorExecute?: (interaction: MessageContextInteraction, error: unknown) => Promise<unknown> | unknown;
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
    onAutocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;
}

export interface Choice {
    name: string;
    type: 4;
    value?: string | number;
    focused?: boolean;
}