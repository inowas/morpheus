from task_queue import task_queue


@task_queue.task
def calculate_modflow_model(calculation_id: str):
    return calculation_id
