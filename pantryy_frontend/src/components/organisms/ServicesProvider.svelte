<script lang="ts">
  import services, { SERVICES_KEY } from "../../services";
  import { setContext } from "svelte";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();

  setContext(SERVICES_KEY, services({ navigate, fetchInstance: fetch }));
</script>

<slot />
