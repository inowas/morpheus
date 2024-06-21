from enum import StrEnum


class Privilege(StrEnum):
    FULL_ACCESS = 'full_access'
    VIEW_PROJECT = 'view_project'
    EDIT_PROJECT = 'edit_project'
    MANAGE_PROJECT = 'manage_project'
