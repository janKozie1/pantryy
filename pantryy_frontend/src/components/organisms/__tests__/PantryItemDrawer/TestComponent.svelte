<script lang="ts">
  import { Router } from "svelte-navigator";
  import type { Props } from "../../../../utils/types";
  import MockedServicesProvider from "../../MockedServicesProvider.svelte";
  import PantryItemDrawer from "../../PantryItemDrawer.svelte";

  type PantryItemDrawerProps = Props<PantryItemDrawer>;

  export let props: PantryItemDrawerProps;
</script>

<Router>
  <MockedServicesProvider>
    <PantryItemDrawer {...props} />
  </MockedServicesProvider>
</Router>
