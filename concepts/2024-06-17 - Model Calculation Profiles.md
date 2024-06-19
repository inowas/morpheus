# Raster interpolations

## Problem

Modflow calculations can be driven by different calculation engines.
These are in our case mf2005, mf6, seawat and mt3dms. In the future, we want to support more calculation engines.

The user should have the possibility to parameterize the calculation engines for each package used by the model in the
frontend.

## Appetite

We want to spend 2 days on this.

## Solution

We want to implement so-called calculation profiles for every calculation engine. These profiles are different for each
calculation engine and can be selected and adapted in the calculation section of the (base)model.

The calculation profiles are stored in a separate reposotor as a list of calculation profiles.
In the project itself, the selected calculation profile is stored as a reference to the calculation profile in the
calculation profile repository.

```
project: {
  ...
  calculation_profile_id: 'aaa-bbb-ccc-ddd-eee',
  ...
}
```

The same calculation profile is used for the model and all scenario calculations.
Each package has a set of parameters that can be set in the calculation profile.
The calculation profile can bw updated by a command.

## Rabbit Holes

Do no spend to uch time in the frontend. The frontend should be able to display the calculation profile and allow the
user to change the parameters.

## No-goes

Do not implement the calculation profiles for other calculation engines as mf2005.
This is out of scope for this story.

