<script lang="ts">
  import type { Nullable } from "../../utils/types";

  export let type: Nullable<string> = "button";
  export let cls: Nullable<string> = "";

  type Sizes = "lg" | "md" | "sm";
  type ColorVariants = "primary" | "secondary" | "neutral";
  type FillVariants = "filled" | "ghost" | "borderless";

  export let size: Sizes;
  export let squared: boolean = false;
  export let fill: FillVariants;
  export let color: ColorVariants;

  const buttonSizeToTextSize: Record<Sizes, string> = {
    sm: "small",
    md: "medium",
    lg: "large",
  };
</script>

<button
  {type}
  class={`${cls} button button--${size}${
    squared ? "--squared" : ""
  } button--${fill}--${color}`}
>
  {#if $$slots.content}
    <span class={`text__action--button--${buttonSizeToTextSize[size]}`}>
      <slot name="content" />
    </span>
  {/if}
  {#if $$slots.icon}
    <div class={`-inline-flex ${$$slots.content ? "-pl--500" : ""} -mt--200`}>
      <slot name="icon" />
    </div>
  {/if}
</button>
