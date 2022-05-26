<script>
  import { Link } from "svelte-routing";

  import Image from "../components/atoms/Image.svelte";
  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Logo from "../components/molecules/Logo.svelte";
  import Tab from "../components/molecules/Tab.svelte";
  import TextInput from "../components/molecules/TextInput.svelte";
</script>

<Stylesheet src="pages/auth.css" />

<main class="page">
  <Logo variant="big" />
  <div class="page_content">
    <div class="tabs_container">
      <Tab to="/login">Log in</Tab>
      <Tab to="/register">Register</Tab>
    </div>
    <form class="form -full-width -mt--1000" action="/login" method="POST">
      <div class="form__inputs_container">
        <TextInput name="email" label="Email" />
        <TextInput name="password" label="Password" type="password" />
      </div>
      <a href="#" class="text__action--link--small -mt--600 -ml--auto">
        <span class="-color--action_default"> Forgot password? </span>
      </a>
      <button
        type="submit"
        class="button button--md button--filled--primary -mt--1000 -full-width -justify-center"
      >
        <span class="text__action--button--large">
          <span class="-color--inverted" href="#"> Log in </span>
        </span>
        <div class="-inline-flex -pl--500 -mt--200">
          <svg
            class="-fill--inverted"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><g id="Navigation / arrow forward"
              ><mask
                id="mask0_70_10339"
                style="mask-type:alpha"
                maskUnits="userSpaceOnUse"
                x="4"
                y="4"
                width="16"
                height="16"
                ><g id="Icon Mask"
                  ><path
                    id="Round"
                    d="M5.20874 13.2644H16.3787L11.4987 18.1444C11.1087 18.5344 11.1087 19.1744 11.4987 19.5644C11.8887 19.9544 12.5187 19.9544 12.9087 19.5644L19.4987 12.9744C19.8887 12.5844 19.8887 11.9544 19.4987 11.5644L12.9187 4.96436C12.7319 4.77711 12.4783 4.67188 12.2137 4.67188C11.9492 4.67188 11.6956 4.77711 11.5087 4.96436C11.1187 5.35436 11.1187 5.98436 11.5087 6.37436L16.3787 11.2644H5.20874C4.65874 11.2644 4.20874 11.7144 4.20874 12.2644C4.20874 12.8144 4.65874 13.2644 5.20874 13.2644Z"
                    fill="black"
                  /></g
                ></mask
              ><g mask="url(#mask0_70_10339)"
                ><rect
                  id="Color Fill"
                  y="0.264648"
                  width="24"
                  height="24"
                  fill="#858C94"
                /></g
              ></g
            ></svg
          >
        </div>
      </button>
    </form>
  </div>
</main>
<div class="bg_photos_container">
  <Image src="auth/onion.jpg" alt="onion" cls="bg_photo bg_photo--right" />
  <Image src="auth/broccoli.jpg" alt="broccoli" cls="bg_photo bg_photo--top" />
  <Image src="auth/garlic.jpg" alt="garlic" cls="bg_photo bg_photo--left" />
</div>
