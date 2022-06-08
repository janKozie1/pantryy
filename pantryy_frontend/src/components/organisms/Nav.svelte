<script lang="ts">
  import { Routes } from "../../config";
  import { getServices } from "../../services";
  import Icon from "../atoms/Icon.svelte";

  import Logo from "../molecules/Logo.svelte";
  import NavLink from "../molecules/NavLink.svelte";

  const services = getServices();
</script>

<nav class="nav">
  <div class="nav__content">
    <Logo variant="small" cls="nav__logo -pt--600 -pl--600 -mt--500 -ml--500" />
    <ul class="nav__items">
      <NavLink to={Routes.pantry} icon="dashboard">Pantry</NavLink>
      <NavLink to="#" icon="room_service">Recipes</NavLink>
      <NavLink to="#" icon="paste">To-buy list</NavLink>
    </ul>
    <ul class="nav__items -mt--auto -mb--900">
      <NavLink to="#" icon="settings">Settings</NavLink>
      <li class="nav__item">
        <button
          on:click={services.auth.logout}
          class="nav__link text__action--button--medium -full-width"
        >
          <Icon icon="arrow_back" cls="-fill--neutral_6" />
          <span class="-color--neutral_5"> Log out </span>
        </button>
      </li>
    </ul>
  </div>
  <div class="divider--vertical -full-height -ml--auto" />
</nav>
