from ....types.calculation.Calculation import CalculationProfile

from .BasPackage import BasPackageData
from .DisPackage import DisPackageData


class Mf2005CalculationProfile(CalculationProfile):
    name = 'Modflow 2005 default calculation profile'
    description = 'Modflow 2005 default calculation profile'
    packages = {
        'dis': DisPackageData().custom_defaults(),
        'bas': BasPackageData().custom_defaults(),
    }
