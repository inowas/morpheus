import React from 'react';
import {useProjectSummaries} from '../../application';

const ProjectDashboardContainer = () => {

  const {projects, loading, error} = useProjectSummaries();

  return (
    <>
      <h1>Projects</h1>
      {loading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {projects && (
        <ul>
          {projects.map((project) => (
            <li key={project.project_id}>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <p>{project.created_at}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ProjectDashboardContainer;
