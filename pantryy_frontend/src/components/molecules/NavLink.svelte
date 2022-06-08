<script lang="ts">
  import { Link } from "svelte-navigator";
  import type { Props } from "../../utils/types";
  import Icon from "../atoms/Icon.svelte";

  export let to: string;
  export let icon: Props<Icon>["icon"];

  let active = window.location.pathname.includes(to);
</script>

<li class={`nav__item ${active ? "nav__item--active" : ""}`}>
  <Link {to} class="nav__link text__action--button--medium -full-width">
    <Icon {icon} cls={active ? "-fill--neutral_black" : "-fill--neutral_6"} />
    <span class={active ? "-color--neutral_2" : "-color--neutral_5"}
      ><slot />
    </span>
  </Link>
</li>
