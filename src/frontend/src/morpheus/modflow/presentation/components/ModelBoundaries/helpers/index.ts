import {
  IBoundary,
  IConstantHeadBoundary,
  IDrainBoundary,
  IEvapotranspirationBoundary,
  IFlowAndHeadBoundary,
  IGeneralHeadBoundary,
  ILakeBoundary,
  IRechargeBoundary, IRiverBoundary, IWellBoundary
} from "../../../../types/Boundaries.type";

export const isConstantHeadBoundary = (boundary: IBoundary): boundary is IConstantHeadBoundary => boundary.type === 'constant_head';
export const isDrainBoundary = (boundary: IBoundary): boundary is IDrainBoundary => boundary.type === 'drain';
export const isEvapotranspirationBoundary = (boundary: IBoundary): boundary is IEvapotranspirationBoundary => boundary.type === 'evapotranspiration';
export const isFlowAndHeadBoundary = (boundary: IBoundary): boundary is IFlowAndHeadBoundary => boundary.type === 'flow_and_head';
export const isGeneralHeadBoundary = (boundary: IBoundary): boundary is IGeneralHeadBoundary => boundary.type === 'general_head';
export const isLakeBoundary = (boundary: IBoundary): boundary is ILakeBoundary => boundary.type === 'lake';
export const isRechargeBoundary = (boundary: IBoundary): boundary is IRechargeBoundary => boundary.type === 'recharge';
export const isRiverBoundary = (boundary: IBoundary): boundary is IRiverBoundary => boundary.type === 'river';
export const isWellBoundary = (boundary: IBoundary): boundary is IWellBoundary => boundary.type === 'well';

export const canHaveMultipleObservations = (b: IBoundary): boolean => ['constant_head', 'drain', 'flow_and_head', 'general_head', 'river'].includes(b.type);
export const canHaveMultipleAffectedLayers = (b: IBoundary): boolean => ['constant_head', 'flow_and_head', 'general_head'].includes(b.type);
