<script lang="ts">
  import Icon from "../components/atoms/Icon.svelte";

  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Button from "../components/molecules/Button.svelte";
  import TextInput from "../components/molecules/TextInput.svelte";
  import Nav from "../components/organisms/Nav.svelte";
  import PantryItem from "../components/organisms/PantryItem.svelte";
</script>

<Stylesheet src="pages/pantry.css" />

<div class="page">
  <Nav />
  <main class="page__main">
    <div class="toolbar -py--700 -my--400 -px--1000">
      <form>
        <TextInput name="search" placeholder="Search" ghost />
      </form>
      <Button type="submit" size="sm" color="primary" fill="filled">
        <span slot="content" class="-color--inverted"> Add new </span>
        <div slot="icon" class="-inline-flex">
          <Icon cls="-fill--inverted" icon="add" />
        </div>
      </Button>
    </div>
    <div class="divider--horizontal -full-width" />
    <ul class="pantry_list -px--700 -py--1000">
      <PantryItem />
      <PantryItem />
      <PantryItem />
      <PantryItem />
      <PantryItem />
      <PantryItem />
    </ul>
  </main>
</div>
