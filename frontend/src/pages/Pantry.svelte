<script lang="ts">
  import Icon from "../components/atoms/Icon.svelte";

  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Button from "../components/molecules/Button.svelte";
  import Loading from "../components/molecules/Loading.svelte";
  import AddPantryItemDrawer from "../components/organisms/AddPantryItemDrawer.svelte";
  import Nav from "../components/organisms/Nav.svelte";
  import PantryItem from "../components/organisms/PantryItem.svelte";
  import Toolbar from "../components/organisms/Toolbar.svelte";
  import { getServices } from "../services";

  const services = getServices();

  let items = services.externalData.getPantryItems();

  let drawerOpen = false;
  let onAddItemButtonClick = () => (drawerOpen = true);
  let onDrawerCancel = () => (drawerOpen = false);
  let onDrawerSuccess = () => {
    drawerOpen = false;
    items = services.externalData.getPantryItems();
  };
</script>

<Stylesheet src="pages/pantry.css" />

<div class="page">
  <AddPantryItemDrawer
    open={drawerOpen}
    onCancel={onDrawerCancel}
    onSuccess={onDrawerSuccess}
  />
  <Nav />
  <main class="page__main">
    <Toolbar>
      <Button
        size="sm"
        color="primary"
        fill="filled"
        on:click={onAddItemButtonClick}
      >
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
