import {IModelCard} from 'components/ModelCard';

function getAuthorCounts(models: IModelCard[]): Record<string, number> {
  const authorCounts: Record<string, number> = {};
  models.forEach(model => {
    const authorName = model.meta_author_name;

    if (authorCounts[authorName]) {
      authorCounts[authorName]++;
    } else {
      authorCounts[authorName] = 1;
    }
  });
  return authorCounts;
}

function createOwnerOptions(models: IModelCard[]) {
  const authorCounts = getAuthorCounts(models);
  const ownerOptions = Object.keys(authorCounts).map(authorName => ({
    key: authorName,
    count: authorCounts[authorName],
    value: authorName,
    text: authorName,
  }));

  return ownerOptions;
}

function boundaryDescription(key: string) {
  switch (key) {
  case 'CHD':
    return 'Constant Head Boundary';
  case 'FHB':
    return 'Flow and Head Boundary';
  case 'WEL':
    return 'Wells';
  case 'RCH':
    return 'Recharge';
  case 'RIV':
    return 'Rivers';
  case 'GHB':
    return 'General Head Boundary';
  case 'EVT':
    return 'Evapotranspiration';
  case 'DRN':
    return 'Drain';
  case 'NB':
    return 'No boundaries';
  default:
    return '';
  }
}

function additionalDescription(key: string) {
  switch (key) {
  case 'soluteTransportMT3DMS':
    return 'Solute Transport MT3DMS';
  case 'dualDensityFlowSEAWAT':
    return 'Dual-density flow SEAWAT';
  case 'realTimeSensors':
    return 'Real-time sensors';
  case 'modelsWithScenarios':
    return 'Models with scenarios';
  default:
    return '';
  }
}

function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export {createOwnerOptions, boundaryDescription, additionalDescription, formatNumber};
