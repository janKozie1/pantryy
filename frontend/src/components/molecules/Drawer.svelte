<script lang="ts">
  import type { OnSubmitFN } from "../../utils/form";
  import { withFormData } from "../../utils/form";

  import Icon from "../atoms/Icon.svelte";
  import Button from "./Button.svelte";

  export let title: string;
  export let open: boolean;

  export let onSubmit: OnSubmitFN;
  export let onCancel: () => void;
</script>

<aside class={`drawer ${open ? "drawer--expanded" : ""}`}>
  <div class="-align-center -justify-space-between">
    <h2 class="text__heading--6--heavy">
      {title}
    </h2>
    <button
      class="button button--sm--squared button--borderless--neutral"
      on:click={onCancel}
    >
      <Icon icon="clear" />
      <div class="-inline-flex -fill--neutral_3" />
    </button>
  </div>
  <form on:submit|preventDefault={withFormData(onSubmit)}>
    <slot />
    <div class="-mt--1000 -pt--500">
      <Button
        type="submit"
        size="sm"
        color="primary"
        fill="filled"
        cls="-full-width -justify-center"
      >
        <span slot="content" class="-color--inverted"> Submit </span>
      </Button>
    </div>
    <div class="-mt--600">
      <Button
        size="sm"
        color="neutral"
        fill="borderless"
        cls="-full-width -justify-center"
        on:click={onCancel}
      >
        <span slot="content" class="-color--neutral_5"> Cancel </span>
      </Button>
    </div>
  </form>
</aside>
