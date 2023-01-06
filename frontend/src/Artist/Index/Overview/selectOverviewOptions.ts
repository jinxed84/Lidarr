import { createSelector } from 'reselect';

const selectOverviewOptions = createSelector(
  (state) => state.artistIndex.overviewOptions,
  (overviewOptions) => overviewOptions
);

export default selectOverviewOptions;
