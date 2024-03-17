export const getProjectMetadata = (projectId: string) => {
  return {
    'project_id': projectId,
    'general': {
      'project_name': 'Groundwater model in Akrotiri',
      'project_description': 'The newest MODFLOW model in the AGREEMAR project to simulate saltwater intrusion along the coastal communities',
      'current_version': 'v1.0.1',
      'previous_versions': [
        'v1.0.0',
        'v0.9.0',
      ],
      'tags': [
        'tag1',
        'tag121',
        'tag3',
      ],
      'created_at': '2017-01-01T00:00:00.000Z',
      'last_updated_at': '2017-01-01T00:00:00.000Z',
      'url': 'https://api.stoplight.io/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    },
    'permissions': {
      'visibility': 'public',
      'members': [
        {
          'user_id': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'username': 'owner.name',
          'name': 'Owner Name',
          'email': 'owner_name@email.com',
        },
        {
          'user_id': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'username': 'member.name',
          'name': 'Member Name',
          'email': 'member.name@email.com',
          'role': 'owner',
        },
        {
          'user_id': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'username': 'member.name',
          'name': 'Member Name',
          'role': 'editor',
        },
      ],
      'groups': [
        {
          'group_id': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'name': 'Viewer Group Name',
          'role': 'viewer',
        },
        {
          'group_id': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'name': 'Editor Group Name',
          'role': 'editor',
        },
      ],
    },
    'spatial_discretization': {
      'length_unit': 'meters',
      'crs': 'EPSG:4326',
      'area': 10111.12,
      'area_unit': 'square_meters',
      'bounding_box': [
        -122.4194155,
        37.7749295,
        -122.4194155,
        37.7749295,
      ],
      'grid_size': {
        'n_x': 140,
        'n_y': 140,
        'n_z': 3,
      },
      'cell_size': {
        'min_x': 10,
        'max_x': 100,
        'min_y': 10,
        'max_y': 100,
      },
      'rotation': 16.5,
      'grid_local_refinement': true,
    },
    'time_discretization': {
      'time_unit': 'days',
      'start_time': '2001-01-01T00:00:00.000Z',
      'end_time': '2002-12-31T00:00:00.000Z',
      'duration': 730,
      'number_ot_stress_periods': 24,
    },
    'soil_model': {
      'layers': [
        {
          'name': 'Upper Clay Layer',
          'download_url': 'https://api.stoplight.io/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        },
        {
          'name': 'Silty lenses',
          'download_url': 'https://api.stoplight.io/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        },
        {
          'name': 'Sandy Layer (aquifer)',
          'download_url': 'https://api.stoplight.io/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        },
      ],
    },
  };
};