<script lang="ts">
  import { Link } from "svelte-navigator";
  import { Routes } from "../../config";
  import type { PantryItem } from "../../services/externalData";
  import { generatePath } from "../../utils/routes";
  import Image from "../atoms/Image.svelte";

  export let item: PantryItem;
</script>

<li class="pantry_list__item">
  <Link to={generatePath(Routes.product, { id: item.id })} class="item_link">
    <Image external src={item.imageURL} alt={item.name} />
    <div class="item_description -pt--300">
      <div>
        <h3 class="text__small_caps--regular">{item.name}</h3>
      </div>
      <p class="text__paragraph--small--light -mt--500">Available:</p>
      <p class="text__paragraph--base--regular item_description__amount">
        4 kg / 12pcs.
      </p>
    </div>
  </Link>
</li>
