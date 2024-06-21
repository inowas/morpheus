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

const usePackages = (packageKey: string): Settings => {
  const [settings, setSettings] = useState<Settings>({
    engineType: '',
    name: '',
    values: null,
  });

  useEffect(() => {
    if (profile) {
      setSettings({
        engineType: profile.engine_type,
        name: profile.name,
        values: profile.engine_settings[packageKey] || null,
      });
    }
  }, [packageKey]);


  return settings;
};

export default usePackages;

