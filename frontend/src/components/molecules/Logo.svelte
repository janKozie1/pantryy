<script lang="ts">
  import type { Nullable } from "../../utils/types";
  import Image from "../atoms/Image.svelte";

  export let variant: Nullable<Variant> = "small";

  const variants = {
    small: {
      class: "small",
      imgSrc: "shared/logo.png",
    },
    big: {
      class: "big",
      imgSrc: "shared/logo_full.png",
    },
  } as const;

  type Variant = keyof typeof variants;
</script>

<Image
  alt="Pantryy logo"
  src={variants[variant].imgSrc}
  cls={`logo--${variants[variant].class}`}
/>
