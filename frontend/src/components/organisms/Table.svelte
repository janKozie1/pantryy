<script lang="ts">
  export let cls: string = "";

  type TabularData = Readonly<{
    headers: string[];
    rows: string[][];
  }>;

  export let data: TabularData;
</script>

<table class={`${cls} table`}>
  <thead>
    <tr>
      {#each data.headers as header}
        <th class="text__paragraph--base--regular">{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data.rows as row}
      <tr>
        {#each row as cell}
          <td class="text__paragraph--base--light">{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
