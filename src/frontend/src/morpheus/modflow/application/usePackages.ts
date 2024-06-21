import {useEffect, useState} from 'react';
import calculationProfile from '../presentation/components/Packages/calculationProfile.json';

interface EngineSettings {
  [key: string]: any;
}

interface CalculationProfile {
  id: string;
  name: string;
  engine_type: string;
  engine_settings: EngineSettings;
}

interface Settings {
  engineType: string;
  name: string;
  values: any;
}

const profile: CalculationProfile = calculationProfile as unknown as CalculationProfile;

const usePackages = (packageKey: string) => {

  const [settings, setSettings] = useState<Settings>({
    engineType: '',
    name: '',
    values: null,
  });
  // TODO remove loading state if we don't need it
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (profile) {
      setSettings({
        engineType: profile.engine_type,
        name: profile.name,
        values: profile.engine_settings[packageKey] || null,
      });
      setLoading(false);
    }
  }, [packageKey]);


  return {
    settings,
    loading,
  };
};

export default usePackages;
export type {Settings};

