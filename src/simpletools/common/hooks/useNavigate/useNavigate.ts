import {NavigateFunction, useNavigate as useNavigateHook} from 'react-router-dom';

type IUseNavigate = NavigateFunction;

const useNavigate = (): IUseNavigate => useNavigateHook();

export default useNavigate;
export type {IUseNavigate};
