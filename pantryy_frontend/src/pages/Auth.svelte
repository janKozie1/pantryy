<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";

  import Icon from "../components/atoms/Icon.svelte";
  import Image from "../components/atoms/Image.svelte";
  import Stylesheet from "../components/atoms/Stylesheet.svelte";
  import Button from "../components/molecules/Button.svelte";
  import Logo from "../components/molecules/Logo.svelte";
  import Tab from "../components/molecules/Tab.svelte";
  import TextInput from "../components/molecules/TextInput.svelte";
  import { Routes } from "../config";

  import { getServices } from "../services";
  import { mergeFieldErrors, OnSubmitFN, withFormData } from "../utils/form";
  import { isNil } from "../utils/guards";
  import type { Nullable } from "../utils/types";

  const services = getServices();
  const navigate = useNavigate();

  const forms = {
    login: Routes.login,
    register: Routes.register,
  };

  type FieldErrors = Record<
    "email" | "password" | "repeatedPassword",
    Nullable<string>
  >;

  let fieldErrors: FieldErrors = {
    email: null,
    password: null,
    repeatedPassword: null,
  };

  let updateFieldErrors = (newErrors: Nullable<Partial<FieldErrors>>) => {
    fieldErrors = mergeFieldErrors(fieldErrors, newErrors);
  };

  let onLoginSubmit: OnSubmitFN = (data) => {
    const email = data.get("email");
    const password = data.get("password");

    const localValidationResult = services.validation.validateLoginFields({
      email,
      password,
    });

    if (
      !localValidationResult.isValid ||
      isNil(localValidationResult.validFields)
    ) {
      return updateFieldErrors(localValidationResult.errors);
    } else {
      updateFieldErrors(null);
    }

    services.auth.login(localValidationResult.validFields).then((response) => {
      if (!response.ok) {
        updateFieldErrors(response.errors);
      } else {
        navigate(Routes.pantry);
      }
    });
  };

  let onRegisterSubmit: OnSubmitFN = (data) => {
    const email = data.get("email");
    const password = data.get("password");
    const repeatedPassword = data.get("repeated_password");

    const localValidationResult = services.validation.validateRegisterFields({
      email,
      password,
      repeatedPassword,
    });

    if (
      !localValidationResult.isValid ||
      isNil(localValidationResult.validFields)
    ) {
      return updateFieldErrors(localValidationResult.errors);
    } else {
      updateFieldErrors(null);
    }

    services.auth
      .register(localValidationResult.validFields)
      .then((response) => {
        if (!response.ok) {
          updateFieldErrors(response.errors);
        } else {
          navigate(Routes.pantry);
        }
      });
  };

  let pathname = window.location.pathname;
</script>

<Stylesheet src="pages/auth.css" />

<main class="page">
  <Logo variant="big" />
  <div class="page_content">
    <div class="tabs_container">
      <Tab to="/login">Log in</Tab>
      <Tab to="/register">Register</Tab>
    </div>
    {#if pathname.includes(forms.login)}
      <form
        on:submit|preventDefault={withFormData(onLoginSubmit)}
        class="form -full-width -mt--1000"
      >
        <div class="form__inputs_container">
          <TextInput name="email" label="Email" error={fieldErrors.email} />
          <TextInput
            name="password"
            label="Password"
            type="password"
            error={fieldErrors.password}
          />
        </div>
        <Link to="#" class="text__action--link--small -mt--600 -ml--auto">
          <span class="-color--action_default">Forgot password?</span>
        </Link>
        <Button
          type="submit"
          cls="-mt--1000 -full-width -justify-center"
          size="lg"
          color="primary"
          fill="filled"
        >
          <span slot="content" class="-color--inverted">Log in</span>
          <div slot="icon" class="-inline-flex -pl--500 -mt--200">
            <Icon cls="-fill--inverted" icon="arrow_forward" />
          </div>
        </Button>
      </form>
    {:else if pathname.includes(forms.register)}
      <form
        on:submit|preventDefault={withFormData(onRegisterSubmit)}
        class="form -full-width -mt--1000"
      >
        <div class="form__inputs_container">
          <TextInput name="email" label="Email" error={fieldErrors.email} />
          <TextInput
            name="password"
            label="Password"
            type="password"
            error={fieldErrors.password}
          />
          <TextInput
            name="repeated_password"
            label="Repeat password"
            placeholder="Password"
            type="password"
            error={fieldErrors.repeatedPassword}
          />
        </div>
        <Button
          type="submit"
          cls="-mt--1000 -full-width -justify-center"
          size="lg"
          color="primary"
          fill="filled"
        >
          <span slot="content" class="-color--inverted">Sign up</span>
          <div slot="icon" class="-inline-flex -pl--500 -mt--200">
            <Icon cls="-fill--inverted" icon="arrow_forward" />
          </div>
        </Button>
      </form>
    {/if}
  </div>
</main>
<div class="bg_photos_container">
  <Image src="auth/onion.jpg" alt="onion" cls="bg_photo bg_photo--right" />
  <Image src="auth/broccoli.jpg" alt="broccoli" cls="bg_photo bg_photo--top" />
  <Image src="auth/garlic.jpg" alt="garlic" cls="bg_photo bg_photo--left" />
</div>
