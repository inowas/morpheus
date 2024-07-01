import {useEffect, useRef, useState} from 'react';
import {ICalculationProfile} from '../types/CalculationProfile.type';
import {IError} from '../../types';
import useProjectCommandBus from './useProjectCommandBus';
import {IUpdateCalculationProfileCommand} from './useProjectCommandBus.type';
import {useApi} from '../incoming';

interface IUseCalculationProfile {
  calculationProfile: ICalculationProfile | null;
  updateCalculationProfile: (calculationProfile: ICalculationProfile) => void;
  loading: boolean;
  error: IError | null;
}

const useCalculationProfile = (projectId: string): IUseCalculationProfile => {

  const isMounted = useRef(true);
  const [calculationProfile, setCalculationProfile] = useState<ICalculationProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchCalculationProfile = async () => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await httpGet<ICalculationProfile>(`/projects/${projectId}/calculation-profiles/selected`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      setCalculationProfile(response.val);
    }

    if (response.err) {
      setError(response.val);
    }
  };

  useEffect(() => {
    fetchCalculationProfile();
    return () => {
      isMounted.current = false;
    };
  }, []);


  const updateCalculationProfile = async (profile: ICalculationProfile) => {

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const command: IUpdateCalculationProfileCommand = {
      command_name: 'update_calculation_profile_command',
      payload: {
        project_id: projectId,
        calculation_profile_id: profile.id,
        calculation_profile: profile,
      },
    };

    const result = await sendCommand(command);
    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      setCalculationProfile(calculationProfile);
    }

    if (result.err) {
      setError(result.val);
    }

  };

  return {
    calculationProfile,
    updateCalculationProfile,
    loading,
    error,
  };
};

export default useCalculationProfile;
export type {IUseCalculationProfile};
