<script lang="ts">
  export let to: string;

  let pathname = window.location.pathname;
</script>

<a href={to} class={`tab ${pathname.includes(to) ? "tab--active" : ""}`}>
  <span class="text__action--button--medium">
    <span class="-color--neutral_3"><slot /></span>
  </span>
</a>
