<script lang="ts">
  import Icon from "../components/atoms/Icon.svelte";

  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Button from "../components/molecules/Button.svelte";
  import Loading from "../components/molecules/Loading.svelte";
  import PantryItemDrawer from "../components/organisms/PantryItemDrawer.svelte";
  import Nav from "../components/organisms/Nav.svelte";
  import PantryItem from "../components/organisms/PantryItem.svelte";
  import Toolbar from "../components/organisms/Toolbar.svelte";
  import { getServices } from "../services";
  import { useDrawer } from "../hooks/useDrawer";

  const services = getServices();

  let items = services.externalData.getPantryItems();

  const { isOpen, ...methods } = useDrawer({
    onSuccess: () => (items = services.externalData.getPantryItems()),
  });
</script>

<Stylesheet src="pages/pantry.css" />

<div class="page">
  <PantryItemDrawer
    open={$isOpen}
    onCancel={methods.onCancel}
    onSuccess={methods.onSuccess}
  />
  <Nav />
  <main class="page__main">
    <Toolbar>
      <Button size="sm" color="primary" fill="filled" on:click={methods.onOpen}>
        <span slot="content" class="-color--inverted"> Add new </span>
        <div slot="icon" class="-inline-flex">
          <Icon cls="-fill--inverted" icon="add" />
        </div>
      </Button>
    </Toolbar>
    <ul class="pantry_list -px--700 -py--1000">
      {#await items}
        <Loading />
      {:then loadedItems}
        {#each loadedItems as item (item.id)}
          <PantryItem {item} />
        {/each}
      {/await}
    </ul>
  </main>
</div>
