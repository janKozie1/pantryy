<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { getServices } from "../../services";

  export let redirectTo: string;
  export let isProtected: boolean;

  const services = getServices();
  const navigate = useNavigate();

  $: if (services.auth.isLoggedIn() !== isProtected) {
    navigate(redirectTo);
  }
</script>

<slot />
