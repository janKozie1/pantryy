<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import Icon from "../components/atoms/Icon.svelte";
  import Image from "../components/atoms/Image.svelte";
  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Button from "../components/molecules/Button.svelte";
  import Loading from "../components/molecules/Loading.svelte";
  import Nav from "../components/organisms/Nav.svelte";
  import PantryItemDrawer from "../components/organisms/PantryItemDrawer.svelte";
  import Table from "../components/organisms/Table.svelte";
  import Toolbar from "../components/organisms/Toolbar.svelte";
  import NotFound from "../components/organisms/NotFound.svelte";
  import { Routes } from "../config";
  import { useDrawer } from "../hooks/useDrawer";
  import { getServices } from "../services";

  export let productId: string;

  const services = getServices();
  const navigate = useNavigate();
  const { isOpen, ...methods } = useDrawer({
    onSuccess: () => (product = services.externalData.getPantryItem(productId)),
  });

  let product = services.externalData.getPantryItem(productId);

  const onDelete = () => {
    services.externalData.deletePantryItem(productId).then((response) => {
      if (response.ok) {
        navigate(Routes.pantry);
      }
    });
  };
</script>

<Stylesheet src="pages/product.css" />

<div class="page">
  {#await product then loadedProduct}
    <PantryItemDrawer
      open={$isOpen}
      onCancel={methods.onCancel}
      onSuccess={methods.onSuccess}
      initialValues={{
        name: loadedProduct.name,
        description: loadedProduct.description,
        unit: loadedProduct.unitId,
        id: loadedProduct.id,
      }}
    />
  {/await}
  <Nav />
  <main class="page__main">
    <Toolbar>
      <div class="-align-center -gap--500">
        <Button
          size="sm"
          squared
          color="neutral"
          fill="borderless"
          on:click={onDelete}
        >
          <div slot="icon" class="-inline-flex">
            <Icon cls="-fill--neutral_6" icon="trash_bin" />
          </div>
        </Button>
        <Button
          size="sm"
          squared
          color="neutral"
          fill="borderless"
          on:click={methods.onOpen}
        >
          <div slot="icon" class="-inline-flex">
            <Icon cls="-fill--neutral_3" icon="settings" />
          </div>
        </Button>
      </div>
    </Toolbar>
    <div class="divider--horizontal -full-width" />
    {#await product}
      <Loading />
    {:then loadedProduct}
      <NotFound data={loadedProduct}>
        <div class="-pt--900 -px--1000 product">
          <div class="-full-width product__left_column">
            <Image
              external
              alt="product image"
              src={loadedProduct.imageURL}
              cls="product__image"
            />
            <Button size="sm" color="neutral" fill="ghost">
              <span slot="content" class="-color--neutral_3">
                Add to a shopping list
              </span>
              <div slot="icon" class="-inline-flex">
                <Icon cls="-fill--neutral_3" icon="add" />
              </div>
            </Button>
          </div>
          <div class="-full-width product__right_column">
            <div class="-full-width product__info">
              <div>
                <h1 class="text__heading--2--regular">{loadedProduct.name}</h1>
                <div class="-mt--700">
                  <p class="text__paragraph--small--light">Available:</p>
                  <p
                    class="text__paragraph--base--regular item_description__amount"
                  >
                    4 kg / 12pcs.
                  </p>
                </div>
              </div>
              <Button size="sm" color="primary" fill="ghost">
                <span slot="content" class="-color--action_primary">
                  See recipes
                </span>
                <div slot="icon" class="-inline-flex">
                  <Icon cls="-fill--action_primary" icon="arrow_forward" />
                </div>
              </Button>
            </div>
            <div class="-mt--900">
              <span class="text__paragraph--base--light">
                {loadedProduct.description}
              </span>
            </div>
            <div class="-mt--900 -pt--900">
              <div class="-align-center">
                <h2 class="text__heading--4--regular">Purchase history</h2>
                <Button size="sm" squared color="neutral" fill="borderless">
                  <div slot="icon" class="-inline-flex">
                    <Icon cls="-fill--neutral_3" icon="add" />
                  </div>
                </Button>
              </div>
              <Table
                cls="-mt--500"
                data={{
                  headers: [
                    "Date",
                    "Amount bought",
                    "Amount used",
                    "Spoils in",
                  ],
                  rows: [["2022.04.01", "0.5 kg / 1pc.", "0 kg", "1 day"]],
                }}
              />
            </div>
          </div>
        </div>
      </NotFound>
    {/await}
  </main>
</div>
