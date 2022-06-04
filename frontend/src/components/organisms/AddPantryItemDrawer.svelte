<script lang="ts">
  import { getServices } from "../../services";
  import type { MeasurmentUnitsResponse } from "../../services/externalData";

  import { mergeFieldErrors, OnSubmitFN } from "../../utils/form";
  import { isNil } from "../../utils/guards";
  import { capitalize } from "../../utils/string";

  import type { Nullable } from "../../utils/types";

  import Drawer from "../molecules/Drawer.svelte";
  import InputLabel from "../molecules/InputLabel.svelte";
  import RadioGroup from "../molecules/RadioGroup.svelte";
  import RadioInput from "../molecules/RadioInput.svelte";
  import TextInput from "../molecules/TextInput.svelte";

  export let onCancel: () => void;
  export let open: boolean;

  type FieldErrors = Record<
    "name" | "image" | "description" | "unit",
    Nullable<string>
  >;

  const services = getServices();

  let fieldErrors: FieldErrors = {
    name: null,
    image: null,
    description: null,
    unit: null,
  };

  let measurmentUnits: Promise<MeasurmentUnitsResponse> =
    services.externalData.getMeasurmentUnits();

  let updateFieldErrors = (newErrors: Nullable<Partial<FieldErrors>>) => {
    fieldErrors = mergeFieldErrors(fieldErrors, newErrors);
  };

  let onSubmit: OnSubmitFN = (data) => {
    const name = data.get("name");
    const image = data.get("image");
    const description = data.get("description");
    const unit = data.get("unit");

    const localValidationResult =
      services.validation.validateAddPantryItemFields({
        name,
        image,
        description,
        unit,
      });

    if (
      !localValidationResult.isValid ||
      isNil(localValidationResult.validFields)
    ) {
      return updateFieldErrors(localValidationResult.errors);
    } else {
      updateFieldErrors(null);
    }

    services.externalData
      .createPantryItem(localValidationResult.validFields)
      .then((response) => {
        if (!response.ok) {
          updateFieldErrors(response.errors);
        } else {
          onCancel();
        }
      });
  };
</script>

<Drawer title="Add new product" {onSubmit} {onCancel} {open}>
  {#await measurmentUnits}
    <p>Loading.AddPantryItemForm...</p>
  {:then loadedMeasurmentUnits}
    <div class="-mt--1000 -pt--500 -direction-column -gap--800">
      <TextInput name="name" label="Name" error={fieldErrors.name} />
      <TextInput
        name="image"
        label="Image"
        type="file"
        cls="-bg--inverted"
        error={fieldErrors.image}
      />
      <InputLabel label="Description" error={fieldErrors.description}>
        <textarea
          name="description"
          class="input__input -bg--inverted -full-width"
          placeholder="Description..."
        />
      </InputLabel>
      <RadioGroup label="Measurment unit" error={fieldErrors.unit}>
        {#each loadedMeasurmentUnits.data as measurmentUnit (measurmentUnit.id)}
          <RadioInput
            label={capitalize(measurmentUnit.name)}
            value={measurmentUnit.id}
            name="unit"
          />
        {/each}
      </RadioGroup>
    </div>
  {/await}
</Drawer>
