import papermill as pm
from glob import glob

for nb in glob('./notebooks/*.ipynb'):
    print(f'Running {nb}')
    try:
        pm.execute_notebook(
            input_path=nb,
            output_path=nb,
        )
    except Exception as e:
        print(f'Error running {nb}: {e}')
