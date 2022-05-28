<script>
  import { Link } from "svelte-routing";

  import Image from "../components/atoms/Image.svelte";
  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Logo from "../components/molecules/Logo.svelte";
</script>

<Stylesheet src="pages/home.css" />

<div class="page">
  <header class="header">
    <Logo variant="big" />
    <div class="-mr--900 -align-center">
      <Link
        to="/register"
        class="button button--lg button--filled--primary -mx--900"
      >
        <span class="text__action--button--large">
          <span class="-color--inverted"> Create an account </span>
        </span>
      </Link>
      <Link
        to="/login"
        class="button button--lg button--borderless--neutral -mx--900"
      >
        <span class="text__action--button--large">
          <span class="-color--neutral-3"> Log in </span>
        </span>
      </Link>
    </div>
  </header>
  <main class="hero_container">
    <h1 class="text__heading--1--light">Manage your pantry with ease</h1>
    <Image src="home/tomato.jpg" lat="tomato" cls="hero_image" />
  </main>
</div>
