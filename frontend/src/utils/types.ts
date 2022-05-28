import type { SvelteComponentTyped } from "svelte";

export type Nullable<T> = T | null | undefined;
export type Props<T> = T extends SvelteComponentTyped<infer P, any, any> ? P : never;

export type Literal = Record<string, unknown>;
