import {useEffect, useRef, useState} from 'react';
import {ICalculationProfile} from '../types/CalculationProfile.type';
import {IError} from '../../types';
import useProjectCommandBus from './useProjectCommandBus';
import {IUpdateCalculationProfileCommand} from './useProjectCommandBus.type';
import {useApi} from '../incoming';

const calculationProfileData: ICalculationProfile = {
  'id': '7013a8ae-c059-4b8e-9f51-a8323817dc1c',
  'name': 'new mf2005 profile',
  'engine_type': 'mf2005',
  'engine_settings': {
    'bas': {
      'ichflg': false,
      'hnoflo': -999.99,
      'stoper': null,
    },
    'bcf': {
      'ipakcb': 0,
      'iwdflg': 0,
      'ihdwet': 0,
      'wetfct': 0.1,
      'iwetit': 1,
      'wetdry': -0.01,
      'hdry': -1e+30,
    },
    'chd': {
      'laycbd': false,
    },
    'de4': {
      'itmx': 50,
      'mxup': 0,
      'mxlow': 0,
      'mxbw': 0,
      'ifreq': 3,
      'mutd4': 0,
      'accl': 1,
      'hclose': 1e-05,
      'iprd4': 1,
    },
    'dis': {
      'nlay': 1,
      'nrow': 2,
      'ncol': 2,
      'nper': 1,
      'itmuni': 4,
      'lenuni': 2,
      'extension': 'dis',
      'xul': 4.394531,
      'yul': 52.394531,
      'proj4_str': 'EPSG:4326',
      'unitnumber': null,
      'laycbd': false,
      'start_datetime': '1970-01-01 00:00:00',
      'delr': [
        11876,
        11876,
        11876,
        11876,
        11876,
        11876,
        11876,
        11876,
        11876,
        11876,
        11876,
      ],
      'delc': [
        4415.3,
        4415.3,
        4415.3,
        4415.3,
        4415.3,
        4415.3,
        4415.3,
      ],
    },
    'drn': {
      'ipakcb': 0,
    },
    'evt': {
      'ipakcb': 0,
      'nevtop': 1,
    },
    'fhb': {
      'ipakcb': 0,
      'ifhbss': 0,
      'ifhbpt': 0,
    },
    'ghb': {
      'ipakcb': 0,
    },
    'gmg': {
      'mxiter': 50,
      'iiter': 30,
      'iadamp': 0,
      'hclose': 1e-05,
      'rclose': 1e-05,
      'relax': 1.0,
      'ioutgmg': 0,
      'iunitmhc': 0,
      'ism': 0,
      'isc': 0,
      'damp': 1.0,
      'dup': 0.75,
      'dlow': 0.01,
      'chglimit': 1.0,
    },
    'hob': {
      'hobdry': 0.0,
      'tomulth': 1.0,
    },
    'lak': {
      'ipakcb': 0,
      'theta': 1.0,
    },
    'lpf': {
      'ipakcb': 0,
      'iwdflg': 0,
      'ihdwet': 0,
      'wetfct': 0.1,
      'iwetit': 1,
      'wetdry': -0.01,
      'hdry': -1e+30,
      'storagecoefficient': false,
      'nocvcorrection': false,
      'constantcv': false,
      'novfc': false,
      'thickstrt': false,
    },
    'mf': {
      'verbose': false,
    },
    'oc': {
      'ihedfm': 0,
      'iddnfm': 0,
      'chedfm': null,
      'cddnfm': null,
      'cboufm': null,
      'compact': true,
      'label': 'OC',
    },
    'pcg': {
      'mxiter': 50,
      'iter1': 30,
      'npcond': 1,
      'hclose': 1e-05,
      'rclose': 1e-05,
      'relax': 1.0,
      'nbpol': 0,
      'iprpcg': 0,
      'mutpcg': 3,
      'damp': 1.0,
      'dampt': 1.0,
      'ihcofadd': 0,
    },
    'pcgn': {
      'iter_mo': 50,
      'iter_mi': 30,
      'close_r': 1e-05,
      'close_h': 1e-05,
      'relax': 1.0,
      'ifill': 0,
      'unit_pc': 0,
      'unit_ts': 0,
      'adamp': 0,
      'damp': 1.0,
      'damp_lb': 0.001,
      'rate_d': 0.1,
      'chglimit': 0.0,
      'acnvg': 0,
      'cnvg_lb': 0.001,
      'mcnvg': 2,
      'rate_c': -1.0,
      'ipunit': 0,
    },
    'rch': {
      'ipakcb': 0,
    },
    'riv': {
      'ipakcb': 0,
    },
    'available_solver_packages': [
      'de4',
      'gmg',
      'pcg',
      'pcgn',
      'sip',
    ],
    'selected_solver_package': 'pcg',
    'available_flow_packages': [
      'lpf',
      'bcf',
    ],
    'selected_flow_package': 'lpf',
    'sip': {
      'mxiter': 200,
      'nparm': 5,
      'accl': 1,
      'hclose': 1e-05,
      'ipcalc': 1,
      'wseed': 0.0,
      'iprsip': 0,
    },
    'wel': {
      'ipakcb': 0,
    },
  },
};

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

  useEffect(() => {
    fetchCalculationProfile();
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  const updateCalculationProfile = async (calculationProfile: ICalculationProfile) => {

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const command: IUpdateCalculationProfileCommand = {
      command_name: 'update_calculation_profile_command',
      payload: {
        project_id: projectId,
        calculation_profile_id: calculationProfile.id,
        calculation_profile: calculationProfile,
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