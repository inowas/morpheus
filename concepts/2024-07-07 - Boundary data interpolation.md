# Boundary data interpolation

## Problem

We have boundary packages which needs stressperiod data for each time step:

These are almost all boundary packages:

* constant_head
* drain
* evapotranspiration
* general_head
* lake
* recharge
* river
* well

We name these boundaries time step dependent boundaries (TSDB)

The Boundary with free data format is:

* flow_and_head

Also we have Head Observations which can be defined freely.

* head_observation

We name these boundaries time step independent boundaries (TSIB)

For both we need to adapt the user input.

## Appetite

We want to spend 1 day on this.

# Solution

As we have the interpolation flag for each boundary we can make use of this to separate.

At the moment we can differentiate between the following Interpolation flags:

* none -> no interpolation, each date can be set independently and the value is used for the time step if existing
* forward-fill -> fill unknown time steps with previous values
* nearest -> nearest interpolation
* linear -> linear interpolation

For the two different types of boundaries we can use the following interpolation flags:

* TSDBs: forward-fill, nearest, linear -> all time steps are interpolated with the selected method
* TSIBs: none -> each date can be set independently from time series

We will develop two different data tables for the two types of boundaries.

One is called: `time_step_dependent_boundary_data_table` and the other one is
called: `time_step_independent_boundary_data_table`.

The `time_step_dependent_boundary_data_table` wil render a row for each time step.
The following columns are available:

* enabled
* date (date of the time step) -> not editable
* data - values for each boundary package

The `time_step_independent_boundary_data_table` will render only one row for the first time step.
More time steps can be added by the user freely.
Buttons to add and remove time steps are available.
Time steps have to be ordered by date automatically.

## Rabbit Holes

* do no reinvent datatable components
* do not reinvent interpolation algorithms

## No-goes

* no interpolation for TSIBs
