<script lang="ts">
  import Drawer from "../molecules/Drawer.svelte";
  import InputLabel from "../molecules/InputLabel.svelte";
  import RadioInput from "../molecules/RadioInput.svelte";
  import TextInput from "../molecules/TextInput.svelte";

  export let onSubmit: () => void;
  export let onCancel: () => void;
  export let open: boolean;
</script>

<Drawer title="Add new product" {onSubmit} {onCancel} {open}>
  <div class="-mt--1000 -pt--500 -direction-column -gap--800">
    <TextInput name="name" label="Name" />
    <TextInput name="image" label="Image" type="file" cls="-bg--inverted" />
    <InputLabel label="Description">
      <textarea
        name="image"
        class="input__input -bg--inverted -full-width"
        placeholder="Description..."
      />
    </InputLabel>
    <div class="-full-width">
      <div class="-pl--700 -pb--500">
        <span class="text__paragraph--base--heavy">Measurment unit</span>
      </div>
      <div class="-align-center -gap--700">
        <RadioInput label="Kilograms" name="unit" />
        <RadioInput label="Liters" name="unit" />
      </div>
    </div>
  </div>
</Drawer>
